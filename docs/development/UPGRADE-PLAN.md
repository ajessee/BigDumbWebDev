# BigDumbWebDev upgrade plan

Updated September 12, 2026. Status: no upgrade steps have been taken yet. This plan was fleshed out from a full source-level audit (Gemfile/Gemfile.lock, package.json/both lockfiles, `config/routes.rb`, every controller and model, the test suite, and deployment config) rather than the September 9 external assessment alone — every claim below was verified by reading the actual code, not inferred from RDJesseeBlog's experience.

Implementation handoff: [RDJesseeBlog upgrade lessons and repeatable roadmap](UPGRADE-LEARNINGS.md). Read this before implementation — RDJesseeBlog's own upgrade is now complete and deployed, so treat its plan/roadmap as a finished reference, not a work-in-progress.

## Scope and deployment approach

Upgrade BigDumbWebDev and RDJesseeBlog as separate Rails applications, keep both on Heroku initially, add tested Docker configurations, improve security and operations, and investigate costs. Preserve this site's blog, portfolio, editor, account and comment workflows, visual identity, and URLs. RDJesseeBlog's static conversion is a decision for that app alone; there is no static conversion planned for BigDumbWebDev.

Working recommendation, matching RDJesseeBlog: retain Heroku buildpacks on the latest supported numbered stack while adding Docker for reproducible development and portability. Direct Docker deployment on Heroku is optional, uses the `container` stack, and does not eliminate dyno or database charges.

## Verified baseline

| Area | Finding |
| --- | --- |
| Ruby / Rails | `.ruby-version` and `Gemfile` pin Ruby `3.0.0`; `Gemfile.lock` resolves Rails to `6.1.3`. **`config/application.rb` still has `config.load_defaults 6.0`** — the app has never actually adopted Rails 6.1 framework defaults despite running the 6.1 gem, so the 6.0→6.1 defaults migration is its own unstarted step, separate from any gem-version bump. Bundler pinned at `2.2.6`. |
| Heroku app | `big-dumb-web-dev`, US region, one Basic web dyno, stack `heroku-20` (verified via `heroku stack`; `heroku-22/24/26` are all available to move to). Current release `v281` (Feb 2026) is a database-config-only bump — no application code has shipped in a long time. Buildpacks: `heroku-buildpack-activestorage-preview` + `heroku/ruby`, **no explicit Node buildpack** (Heroku's classic Ruby buildpack auto-provisions Node/Yarn when it detects Webpacker; this stops working once Webpacker is removed, so a `heroku/nodejs` buildpack must be added explicitly at that point, same as RDJesseeBlog needed). |
| Add-ons | `heroku-postgresql:essential-0` (~$5/mo cap), `pointdns:developer` (free), `sendgrid:starter` (free) — verified via `heroku addons`. Config vars present: `DATABASE_URL`, `RAILS_MASTER_KEY`, `RAILS_LOG_TO_STDOUT`, `RAILS_SERVE_STATIC_FILES`, `RAILS_MAX_THREADS`, `SENDGRID_*`. **No `BIG_DUMB_WEB_DEV_DATABASE_PASSWORD` var exists**, even though `config/database.yml`'s `production:` block is written to use explicit `database`/`username`/`password` fields (sourced from that env var) rather than `DATABASE_URL` directly — needs reconciling before assuming either path is what's actually in effect today. |
| JS/asset tooling | Both `package-lock.json` (8,496 lines) and `yarn.lock` (6,835 lines) exist and currently agree with each other, but having both violates "pick one package manager." `package.json`'s `@rails/webpacker` dependency is **git-sourced directly from `github.com/rails/webpacker`**, not from the npm registry — a hard blocker for any `npm ci`/`yarn install --frozen-lockfile` on a locked-down build image. `@rails/actioncable`/`@rails/activestorage`/`@rails/ujs` are still on leftover `^6.0.0-alpha`/`^6.0.0-beta1` ranges. `.nvmrc` pins **Node 12.19.0** (EOL, incompatible with any modern bundler that would replace Webpacker). |
| Frontend | ERB, Sprockets/Sass (`sass-rails` 6.0.0 → `sassc` 2.4.0, a native-extension gem), Webpacker 5.2.1, custom vanilla JS (no jQuery). 27 files under `app/javascript/application/`, all loaded together via one Webpacker entrypoint with implicit load-order dependencies (`main.js` sets `window.utils`/`window.projects` globals other files read). Includes a 1.1 MB vendored `fontawesome-all.min.js`, a custom Trix toolbar extension (`trix.js`), the 3D-portfolio scroll effect (`projects-3d-scroll.js`), the animated landing page (`fadeIn.js`), and the local-storage blog autosave (`postAutoSaver.js`). |
| Action Text / Trix | `actiontext` gem locked to exactly `6.1.3`; npm `trix@1.3.0` / `@rails/actiontext@6.0.3` (resolved from loose ranges in `package.json`). Three models use rich text: `User#details`, `Post#content`, `Comment#content`. A custom `config/initializers/action_text.rb` allow-lists the `style` HTML attribute so the custom Trix color-swatch/heading extensions survive sanitization — **this must be re-verified after the Rails/rails-html-sanitizer/loofah upgrade**, since a lost allow-list would silently un-style every existing colored/heading rich-text record. Prism (code syntax highlighting) is **CDN-loaded** (`cdnjs.cloudflare.com`, pinned to Prism **1.17.1**, from 2019), not npm-managed — untouched by the Webpacker migration but worth upgrading and worth allow-listing explicitly if a CSP is ever added (see below). |
| Active Storage | `db/schema.rb` (version `20210305030844`) and `db/migrate/20210305030844_create_active_storage_variant_records.active_storage.rb` are present and consistent with each other — **unlike RDJesseeBlog, this app does not have the "missing migration" gap** that broke image serving there under Rails 8.1's `VariantWithRecord`. Still worth a `db:migrate:status` check against the live app before/after the eventual cutover rather than trusting this source-level read alone. `config.active_storage.service` is `:amazon` in **both development and production** — local development is configured to hit real S3 by default (a deliberate historical choice, per an inline comment, to work against production-pulled data), which needs an explicit decision before Docker/local-dev work begins so a fresh dev environment doesn't need real AWS credentials just to boot. |
| Auth / roles | Custom `has_secure_password`, no Devise/Sorcery. `User#role` uses the **old keyword-arg `enum role: [...]` syntax** (`guest_1=0, guest_2=1, user=2, admin=3` implicitly) — needs migrating to the modern positional `enum :role, [...]` form while preserving the exact same integer mapping. A two-stage anonymous-guest system (`guest_1`/`guest_2`) backs anonymous commenting before signup. |
| Tests | Minitest (not RSpec) confirmed. Real coverage exists for `User` (97 lines) and `Post` (34 lines) models plus six user-flow system tests and one integration test. **`Comment`, `Project`, `Resource`, `Tag`, and `Tagging` model tests are empty scaffold stubs** — zero real coverage. **No controller tests exist at all for `PostsController` or `CommentsController`** — the two controllers with the most business logic, and the one (`Comments`) with a confirmed authorization gap (see below). System tests run non-headless Chrome via `selenium-webdriver 3.142.7` + the deprecated `webdrivers` 4.6.0 gem (Selenium 3 protocol; needs replacing with Selenium 4's built-in Selenium Manager). |
| Deployment | No Dockerfile, Compose config, or CI workflow exists. `Procfile` is already present and correct (`web: bundle exec puma -C config/puma.rb`) — one less thing to add versus RDJesseeBlog, which had to create this. |
| Content/domain | Portfolio + blog site (posts, projects, tags, nested comments), `www.bigdumbweb.dev`, automatic cert management. No audio/video processing (no ffmpeg dependency needed, unlike RDJesseeBlog) — image-only media via `has_one_attached :image` (User, Project, Resource) and `:resume` (User). |

## Known issues found during the code audit

These were confirmed by reading the actual source, not inferred — treat them as findings to act on, not hypotheses to re-verify.

**Security — fix independently of the Rails upgrade, not gated on it:**

- **`GET /remove_user_resume/:id` (`UsersController#remove_resume`) has no authentication or ownership check at all.** Its sibling `remove_image` has both `logged_in_user` and `correct_user` guards in its `before_action :only` list; `remove_resume` was left out of both lists entirely (`app/controllers/users_controller.rb:108-115`). Any anonymous visitor can hit this URL for any user ID and permanently detach that user's resume, right now, in production. This looks like an accidental omission (the sibling action does it correctly) rather than a design choice. Recommend fixing this as its own small, immediate change — it doesn't need to wait for the Rails upgrade.
- `GET /remove_user_image/:id` and `GET /demote_guest` are both state-changing GET routes (correctly guarded on auth where relevant, but GET-for-mutation is itself bad practice — Rails 8.1's per-form CSRF/Origin-validation defaults are a natural point to convert these to `DELETE`/`PATCH`).
- `CommentsController#create`'s strong params (`comment_params`) permit a client-supplied `:user_id`, and nothing overwrites it for a logged-in user before that params hash is built (only the guest path substitutes `guest_user.id`). A logged-in user can currently submit an arbitrary `user_id` in the comment form and have the comment attributed to someone else.
- CSP is fully disabled (`config/initializers/content_security_policy.rb` is the untouched, all-commented-out Rails template). Low urgency today since nothing else assumes a CSP exists, but worth closing once Prism/Font Awesome/any other CDN or vendored asset sourcing is finalized.

**Logic bugs, independent of any framework version:**

- `TagsController#destroy` iterates `@posts.each { |post| post.tags.destroy(@tag) }`, redundantly destroying the same `@tag` object on every iteration of the loop instead of once — worth a second look regardless of the upgrade.
- `User#fetch_ip` makes a live outbound HTTP call to `http://checkip.amazonaws.com/` on every non-production request, and `UsersController#show` calls it unconditionally — this fires on every dev-server page load and every test/system test that visits a user page, and needs stubbing before a real Docker/CI baseline is useful.
- `Geocoder` gem and `User#guess_city/guess_region/guess_country/guess_address` appear to be entirely dead code — no callers found anywhere in `app/` or `test/`. Candidate for outright removal (confirm with the app owner first in case something calls it dynamically) rather than upgrade work.
- Two orphaned tables, `versions` and `version_associations`, exist in `db/schema.rb` with no corresponding migration and no `paper_trail`-style gem anywhere in the Gemfile — likely leftovers from a removed auditing gem. Decide whether to drop them via a new migration or just document them as intentionally orphaned.

**Dependency/tooling landmines to expect, based on RDJesseeBlog's experience:**

- `mimemagic 0.3.5` is a **transitive** dependency (via `activestorage 6.1.3` → `marcel 0.3.3`) — the exact yanked-from-RubyGems version that broke RDJesseeBlog's fresh installs. Expect the identical failure on a clean `bundle install`/Docker build here.
- `rubocop`, `brakeman`, `pry-byebug`, `faker`, and `humanize` all live in the Gemfile's **default group**, meaning they currently ship to production. Move each to `:development`/`:test` (faker likely only needed for `db/seeds.rb`).
- `selenium-webdriver 3.142.7` + `webdrivers 4.6.0` need replacing together — Selenium 4's built-in Selenium Manager obsoletes the `webdrivers` gem, and Selenium 3's protocol won't drive a current Chrome/Chromedriver pairing.
- `will_paginate` is currently `3.3.0`, not yet on the `4.x` line that broke RDJesseeBlog's Bootstrap pagination renderer — so that specific break hasn't happened yet here, but will need the same renderer check whenever this app's `will_paginate` gets bumped to 4.x.
- `sass-rails`/`sassc` (native extension) will need replacing alongside Webpacker, same as RDJesseeBlog's Sass/Bootstrap asset pipeline.

## Implementation checklist

### 1. Reproduce and protect the existing app

- [ ] Create an `andre/`-prefixed upgrade branch (matching the user's naming convention from RDJesseeBlog), preserve any local changes, and confirm the deployed Heroku source commit actually matches this checkout (release `v281` is a config-only bump, so the last real code release predates it — confirm which commit that is).
- [ ] Arrange a fresh private database backup and a separate S3 media-inventory check; prove restoration before any production change. Exclude secrets/personal data from Git and Docker build contexts.
- [ ] Decide `config.active_storage.service` for local development explicitly — currently `:amazon` in both dev and production, meaning a fresh Docker environment would need real AWS credentials just to boot. Switching development to `:local` (Disk service, already defined in `config/storage.yml`) is the safer default unless there's a specific reason to keep pulling real media locally.
- [ ] Boot locally with isolated Postgres, local media, and non-delivering mail (own Compose project/volume names — do not reuse RDJesseeBlog's). Stub `User#fetch_ip`'s outbound network call before relying on test results; it currently fires on every non-production request.
- [ ] Run the existing Minitest suite, record failures, and note the coverage gaps directly rather than assuming they'll surface naturally: no `PostsController`/`CommentsController` tests exist, and `Comment`/`Project`/`Resource`/`Tag`/`Tagging` model tests are empty stubs. Add targeted tests for the authorization boundaries in `CommentsController#create` (the trusted `user_id` finding) and the corrected `remove_resume` guard before/alongside fixing it.
- [ ] Capture desktop/mobile examples of the 3D portfolio scroll, the animated landing page, the blog autosave, and Trix's custom toolbar (heading levels, color swatches, underline, horizontal rule, attach-files) — these are all hand-rolled and easy to silently break during the Webpacker replacement.

### 2. Update Ruby, Rails and dependencies

- [ ] Recheck current stable Rails/Ruby releases at implementation time (RDJesseeBlog's target was Rails 8.1.3.1 / Ruby 4.0.6 — don't assume those numbers are still current without checking).
- [ ] First, flip `config.load_defaults 6.0` → `6.1` on its own and get the suite green — this is an unstarted step independent of any gem-version bump, since the app has been running Rails 6.1.3's gem with Rails 6.0 defaults the whole time.
- [ ] Then work through 6.1 → 7.0 → 7.1 → 7.2 → 8.0 → 8.1 (or newer stable), one version at a time, changing Ruby only at compatible steps. Run the suite + eager loading + asset compilation after every step.
- [ ] Migrate `User#role`'s `enum role: [...]` keyword-arg syntax to the modern positional `enum :role, [...]` form, explicitly preserving the `guest_1=0, guest_2=1, user=2, admin=3` integer mapping.
- [ ] Replace Webpacker. This app's specific blockers: the git-sourced `@rails/webpacker` npm dependency, Node 12 (`.nvmrc`), and 27 files under `app/javascript/application/` with an implicit load order via global `window.utils`/`window.projects` objects that a bundler migration must preserve. Consolidate `package-lock.json` and `yarn.lock` into one lockfile as part of this, not before (there's no reason to pick a package manager before knowing what the replacement build tool needs).
- [ ] Update Action Text/Trix together with Rails; specifically re-verify the `style`-attribute sanitizer allow-list in `config/initializers/action_text.rb` survives, and manually smoke-test the custom Trix toolbar (it manipulates Trix's internal DOM structure directly, so even a Trix patch bump needs a visual check).
- [ ] Replace `sass-rails`/`sassc` and consolidate the two JS lockfiles into one package manager's workflow as part of the same Webpacker-removal step.
- [ ] Replace `selenium-webdriver 3.142.7` + `webdrivers 4.6.0` with a current Selenium 4 setup (built-in Selenium Manager), and switch `ApplicationSystemTestCase` to a headless driver for CI/Docker use (it currently forces a visible Chrome window with devtools open).
- [ ] Move `rubocop`, `brakeman`, `pry-byebug`, `faker`, and `humanize` out of the Gemfile's default group into `:development`/`:test`.
- [ ] Update Puma, Bundler, Node LTS, and remaining gems (`pg`, `bcrypt`, `mini_magick`/`image_processing`, `aws-sdk-s3`, `jbuilder`, `bootsnap`, `diffy`). Pin resolved versions and regenerate the lockfile with the final toolchain, targeting Linux platforms explicitly.

### 3. Security and application behavior

- [ ] **Fix `UsersController#remove_resume`'s missing authorization independently of the rest of this list** — add it to the same `logged_in_user`/`correct_user` `before_action :only` lists as `remove_image`. This doesn't need to wait for anything else here.
- [ ] Convert `remove_image`, `remove_resume`, and `demote_guest` from state-changing GET routes to `DELETE`/`PATCH`, updating links/tests accordingly.
- [ ] Fix `CommentsController#create` trusting a client-supplied `user_id` for logged-in users; derive it from the session the same way the guest path derives `guest_user.id`.
- [ ] Decide on the two orphaned `versions`/`version_associations` tables (drop via migration, or document as intentionally orphaned) and the dead `Geocoder`-based methods on `User` (remove, pending confirmation nothing calls them dynamically).
- [ ] Fix the `TagsController#destroy` redundant-destroy-in-a-loop bug.
- [ ] Reconcile `config/database.yml`'s production block (explicit `username`/`password` fields sourced from a `BIG_DUMB_WEB_DEV_DATABASE_PASSWORD` env var that doesn't currently exist on Heroku) against `DATABASE_URL`, which the addon actually sets — confirm which one the app is really connecting with today before changing either.
- [ ] Verify the actual SendGrid configuration and Postgres/S3 credentials rather than assuming a free attached add-on proves mail delivery works.
- [ ] Add a health endpoint, unconditional stdout logging (currently gated on `RAILS_LOG_TO_STDOUT` being present rather than always on), and size Puma threads/database pool within the 20-connection Essential-0 limit.
- [ ] Decide whether to add a CSP now that the CDN-loaded Prism dependency and vendored Font Awesome bundle are both known quantities.

### 4. Docker and repeatable builds

- [ ] Add a multi-stage production Dockerfile, `.dockerignore`, non-root runtime — none exist today. The existing `Procfile` (`web: bundle exec puma -C config/puma.rb`) is already correct and can be reused as-is for the eventual buildpack deploy.
- [ ] Add development Compose with isolated Postgres, local media (see the `config.active_storage.service` decision above), and non-delivering mail. Stub `User#fetch_ip`'s network call in this environment.
- [ ] Precompile assets in the build stage without production database access or secrets.
- [ ] Test clean image builds, boot, migrations, health, and restart persistence on the target architecture (this app has no ffmpeg/audio-processing requirement, so its production image should be noticeably simpler than RDJesseeBlog's).
- [ ] Add CI for tests, production asset build, Docker smoke tests, and dependency/security scanning (Brakeman/bundler-audit/npm audit), reusing RDJesseeBlog's `bin/security-scan`/`bin/container-security-scan` pattern rather than reinventing it.

### 5. Stage, deploy and operate

- [ ] Recheck Heroku stack support — this app is still on `heroku-20`; `heroku-22/24/26` are all available (verified via `heroku stack`). Move to the newest supported stack incrementally, not simultaneously with the Rails version jump.
- [ ] Add the `heroku/nodejs` buildpack explicitly before `heroku/ruby` once Webpacker (and its auto-provisioned Node) is removed — otherwise the build will silently lose its Node runtime.
- [ ] Prepare isolated staging with non-production database/media/email; agree on costs before provisioning temporary paid resources.
- [ ] Require passing tests (with the new coverage from Phase 1), reviewed security findings, successful production asset/Docker builds, and mobile/browser checks covering the 3D portfolio, animated landing page, and blog autosave specifically.
- [ ] Prepare fresh verified backups and a rollback procedure; deploy one site at a time and verify the actually-running release/stack/TLS/media/mail/logs, matching how RDJesseeBlog was rolled out.
- [ ] Set up scheduled database exports, a periodic restore drill, and uptime/error monitoring — none exist today beyond Heroku's continuous-protection reporting.
- [ ] Decide, once deploy cadence and trust in the migration review process are established, whether to keep `db:migrate` a manual `heroku run` step (RDJesseeBlog's current choice, made deliberately to keep a human review point before traffic shifts) or automate it via a Heroku release phase.

## Cost plan

Verified via `heroku addons`/`heroku apps:info`: `heroku-postgresql:essential-0` (~$5/month cap) plus one Basic dyno (~$7/month) — about $12/month base, matching the September 9 assessment. `pointdns:developer` and `sendgrid:starter` both report free. RDJesseeBlog adds another ~$12/month on the same account. Recent account invoices total ~$39/month; the remaining ~$15 has not been attributed to a specific line item — inspect the billing breakdown before proposing removals, and preserve PointDNS if it serves active DNS records.

Docker on Heroku is for portability and repeatability, not direct savings. Keep the small database plan unless measured usage requires more.

## Definition of done

- Supported current Ruby/Rails/dependencies with any exception documented (expect at least a JSON-version exception, mirroring RDJesseeBlog's).
- The `remove_resume` authorization gap and the `CommentsController` trusted-`user_id` issue fixed, whether as part of this upgrade or independently before it.
- Latest validated Heroku stack actually deployed, not merely selected for the next build.
- Reproducible Docker setup and clear local/build/deploy documentation.
- Real test coverage for `PostsController`, `CommentsController`, and the currently-empty `Comment`/`Project`/`Resource`/`Tag`/`Tagging` model stubs — not just "critical features covered," since today several of them have zero coverage at all.
- Verified recovery path, scheduled backups, and basic monitoring.
- Documented app-level recurring costs and the remaining account-level billing discrepancy.

## References

- [Rails releases](https://rubyonrails.org/) and [upgrade guide](https://guides.rubyonrails.org/upgrading_ruby_on_rails.html)
- [Ruby releases](https://www.ruby-lang.org/en/downloads/)
- [Heroku stacks](https://devcenter.heroku.com/articles/stack), [Ruby support](https://devcenter.heroku.com/articles/ruby-support-reference), and [pricing](https://www.heroku.com/pricing/)

Version and pricing observations are dated; recheck before implementation or purchasing resources.
