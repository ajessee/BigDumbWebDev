# Production Docker image

The image runs Rails 8.1.3.1 on Ruby 3.3.9 with Bundler 2.7.2 and Rails 8.1 application defaults. It is a locally validated portability candidate — production still deploys via Heroku buildpacks (see [UPGRADE-PLAN.md](UPGRADE-PLAN.md) Section 5), not this container image, mirroring the same decision already made on the sibling RDJesseeBlog app (see its own `docs/development/PRODUCTION-DOCKER.md`). Unlike RDJesseeBlog, this app has no audio/video processing (no ffmpeg) and uses ImageMagick rather than libvips for Active Storage variants (see UPGRADE-PLAN.md's `image_processing`/`variant_processor` finding), so this image is smaller and simpler.

## Build

```sh
docker build -t bigdumbwebdev-production:local .
```

For a security-validation build, refresh the base image and Debian packages rather than reusing cached layers:

```sh
docker build --pull --no-cache -t bigdumbwebdev-production:local .
```

The build installs gems and Yarn packages in separate stages from the final runtime image. Asset precompilation (Sprockets + Shakapacker, both run by the one `assets:precompile` task) runs with `--network=none` and a dummy `SECRET_KEY_BASE_DUMMY` — it needs no database, S3, SES, or any other external service, verified directly by that flag rather than assumed. The final image includes ImageMagick and excludes Node, Yarn, and all build tools; it runs as UID 1000 (`rails`), is 488 MB, and has no `config/master.key` or other secret baked in (verified directly inside the built image, not assumed from `.dockerignore` alone — see the "Dockerignore hardening" note below for why this needed checking).

## Dockerignore hardening (found and fixed 2026-09-14)

Before this work, `.dockerignore` didn't exclude `config/master.key` — `Dockerfile.dev`'s `COPY . .` was copying the real production Rails master key into every dev image layer, confirmed by `cat`-ing it directly out of the running dev container's filesystem. Since these images have only ever been built locally (never pushed to a registry), the actual exposure was contained to this machine, but the pattern itself was live and would have baked the same secret into any future image, dev or production. Fixed by adding `config/master.key`, `config/credentials/*.key`, `*.dump`, `*.sql`, and `.env*` to `.dockerignore`. The dev environment's bind mount (`.:/app` in `docker-compose.yml`) already supplies the real key at runtime regardless of what's baked into the image, so this was a zero-functional-impact fix, verified by rebuilding and confirming dev still boots and reads credentials correctly.

## Runtime configuration

Inject secrets through the host's secret configuration or an untracked environment file. Required settings:

- `DATABASE_URL`: the intended PostgreSQL database.
- `RAILS_MASTER_KEY`: decrypts `config/credentials.yml.enc`, which holds `secret_key_base`, the S3 (`aws:`) credentials, and the SES (`ses:`) credentials (see [DOMAIN-AND-EMAIL.md](DOMAIN-AND-EMAIL.md) for the SES migration).
- `PORT`: defaults to 3000. `RAILS_MAX_THREADS` defaults to 5 (already the actual Heroku production value as of 2026-09-14 — see UPGRADE-PLAN.md Section 3); keep total connections across all dynos/instances below the Postgres Essential-0 plan's 20-connection limit.

The server serves precompiled assets itself (`RAILS_SERVE_STATIC_FILES=1`, baked into the image) and logs to stdout unconditionally. HTTPS is enforced (`config.force_ssl = true`); a reverse proxy must terminate TLS and supply `X-Forwarded-Proto`. The `/up` endpoint verifies Rails can serve a request — it is not a database or S3/SES availability check.

```sh
docker run --rm --env-file .env.production -p 127.0.0.1:3000:3000 bigdumbwebdev-production:local
```

Only use this command with a correctly configured TLS proxy. Do not point an unvalidated local instance at production services.

## Release operation

The entrypoint (`bin/docker-entrypoint`) does not run migrations — they're a separate, explicit release step, matching this app's existing preference for a manual `heroku run rails db:migrate` (see UPGRADE-PLAN.md Section 5's still-open item on this same question):

```sh
docker run --rm --env-file .env.production bigdumbwebdev-production:local bundle exec rails db:migrate
```

Do not use `db:seed`/`db:prepare` against production — `db/seeds.rb` uses `faker`, which is deliberately excluded from the production Gemfile group (see UPGRADE-PLAN.md Section 2) and will raise `NameError: uninitialized constant Faker` if attempted; this is a real, useful guard against accidentally seeding demo data into production, not a bug to fix.

## Local validation, 2026-09-14

Built and rescanned iteratively (see `docs/development/SECURITY-ACCEPTANCE.md` for the full CVE-remediation detail: base-OS package upgrades, `erb`/`net-imap` gem version bumps, and removing superseded default-gem files that a scanner can't know are unused). Final validation:

- Boots as UID 1000, runs `db:create`/`db:migrate` cleanly against an isolated, disposable Postgres 13 container (all 29 migrations applied, including the `paper_trail` table drop from earlier in this project).
- `/up` returns `200` both on first boot and after a `docker restart` (restart persistence confirmed).
- `/` and `/projects` return `500`/render empty against a truly empty database (no seed data) — not a container defect: `ProjectsController`/`HelloController`'s views depend on an admin user existing (`@user.projects`), and `db:seed` can't run against this image by design (see above). Seeding one admin user + one project directly via `bin/rails runner` (no Faker) confirmed both routes render `200` with real data and real DB queries.
- `GET /signup` returns `406 Not Acceptable` regardless of database state — **a genuine, pre-existing application behavior, not a container issue**: `UsersController#new` has no `.html` template (only `_new.html.erb`, a partial, and `new.js.erb`), so this route has only ever worked via the JS-driven modal fetch, never a direct browser navigation/bookmark/refresh. Confirmed by inspecting the view directory directly. Out of scope for this Docker work; worth its own look separately.
- `docker scout cves`: 0 Critical, 3 High as of 2026-09-15 (down from an initial 27 findings, 5 Critical, on 2026-09-14; the shakapacker upgrade the same day as this update resolved 2 more) — see SECURITY-ACCEPTANCE.md for the full remediation and the 3 remaining, genuinely-unfixed-upstream findings.
- `bin/security-scan` (Brakeman + `bundler-audit` + `yarn audit`): Brakeman clean (fixed one real, if low-severity, finding — `store_location` skipped `HEAD` requests since `request.get?` returns `false` for them; changed to `request.get? || request.head?`); `bundler-audit`/`yarn audit` both carry the one documented shakapacker-era finding, not gating the script's exit code (see SECURITY-ACCEPTANCE.md).
- Full test suite (`bin/rails test` 97/186, `test:system` 37/749, both 0 failures/errors) and eager loading verified unaffected by every change in this pass (the `store_location` fix, the `erb`/`net-imap` Gemfile pins, and the Dockerfile itself, which doesn't touch the dev image at all).
