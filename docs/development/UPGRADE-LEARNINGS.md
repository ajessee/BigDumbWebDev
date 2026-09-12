# Rails upgrade handoff: lessons from RDJesseeBlog

Recorded September 11, 2026. Read this together with [UPGRADE-PLAN.md](UPGRADE-PLAN.md) before starting BigDumbWebDev. This is a repository-based memory for future work, not a claim that either production upgrade is complete.

## User intent and current checkpoint

Finish RDJesseeBlog first, then modernize BigDumbWebDev as a separate Rails application. Preserve features, visual identity, content and URLs. Add Docker for reproducible development and portability, keep Heroku initially, and reduce costs based on measured billing. Evaluate a static RDJesseeBlog only after both upgrades stabilize. BigDumbWebDev stays Rails.

The RDJesseeBlog checkpoint is commit `573bae8` on GitHub branch `andre/rdjessee-upgrade` in `ajessee/RDJesseeBlog`. Local source is `/Users/ajessee/Personal/RDJesseeBlog`. It has upgraded application code and Docker support; production has not been deployed. Consult its current UPGRADE-PLAN.md, LOCAL-DEVELOPMENT.md and PRODUCTION-DOCKER.md for later results before reusing this checkpoint. Use an `andre/` branch for this follow-on work, matching the user's explicit naming choice for RDJesseeBlog.

At this checkpoint: 131 RSpec examples, zero failures and 29 inherited pending placeholders; autoloading and asset compilation pass. Local production image builds and earlier non-root HTTP/restart/media-tool checks pass. Browser login, story creation and WAV upload/conversion pass. Microphone capture, actual playback, mobile coverage, final authorization/defaults review, target x86 execution, staging and verified recovery remain open. These are lessons from work in progress, not a completed deployment recipe.

## Repeat the process in this order

1. **Inspect before changing.** Read repository instructions, preserve local edits, record branch/commit, inspect Gemfile and both lockfiles, routes, initializers, storage, mail, callbacks, assets and tests. Compare Heroku's deployed source commit with the checkout: a recent release may only be a configuration change. Recheck current supported Ruby, Rails and Heroku stacks using official sources; versions below are dated observations.
2. **Build an isolated baseline.** Use development Docker Compose with its own PostgreSQL, local media volume and non-delivering mail. Expose the web server on localhost; keep database/services internal. Do not reuse RDJesseeBlog's Compose project, database or volume names. Disable/stub geolocation and other external callbacks. Check what database preparation invokes before running it: RDJesseeBlog's db:prepare populated development with demo seeds. Never run seed or test commands against production.
3. **Make the baseline useful.** Run BigDumbWebDev's existing Minitest suite, record failures and pending/skipped coverage, repair obsolete assertions and add targeted request/system regressions. Do not transplant RSpec or inflate coverage with placeholder tests. Add a test boot guard that rejects a non-test environment and unexpected DATABASE_URL. Establish public pages, login, ownership/admin boundaries, editor persistence and media baselines before the major-version changes.
4. **Upgrade in small framework steps.** Bring Rails 6.1 to its latest usable patch, then 7.0, 7.1, 7.2, 8.0 and 8.1/current stable as appropriate. Change Ruby at a compatible step. After each meaningful step run the suite, eager loading and asset compilation; record exact resolved versions and failures. Intermediate end-of-life runtimes are migration tools, never deployment targets.
5. **Modernize dependencies and assets deliberately.** Remove a dependency only after checking usage. Choose one JS package manager. Replace Webpacker while preserving the application's actual entry points, vendor behavior and editor extensions. Regenerate lockfiles with the chosen toolchain and target Linux platforms. Separate dependency resolution problems from framework behavior changes.
6. **Review defaults and security explicitly.** Compare generated configuration without overwriting app-specific settings. Review cookies, serializers, sessions, callback ordering, cache formats, Active Storage and signed URLs. Cover all write actions with server-side authentication/authorization and CSRF protection. Fix state-changing GET routes, trusted submitted author IDs and unsafe HTML rendering. A version bump alone does not adopt modern framework defaults.
7. **Build the production container separately.** Use a multi-stage build, minimal runtime dependencies, a non-root user, writable log/tmp/storage paths, runtime PORT and secrets, stdout logging and an explicit migration/release command. Compile assets without network or production credentials. Test a clean image against isolated services with synthetic secrets and data, then test health, public pages, compiled assets, restart and real media transformations on the deployment architecture.
8. **Verify browser workflows and security.** Use synthetic local accounts and uploads. Exercise the critical workflows below, including failures and redirects, and inspect browser errors and mobile layouts. Run dependency, static application and OS/image scans using a reproducible tool setup. Record versions, date and unresolved findings. Keep security tooling out of the production bundle where possible, but make it installable in development/CI.
9. **Stage and deploy only after recovery is ready.** Recheck live Heroku configuration, choose buildpacks versus container deployment, validate stack/runtime support, and prepare isolated staging. Agree on new paid resources before provisioning. Arrange fresh private backups and test restoration; document migration compatibility and rollback. Deploy one site at a time and verify the actually running release, stack, TLS, media, mail and logs.

## Compatibility findings to test, not blindly copy

| RDJesseeBlog finding | BigDumbWebDev follow-up |
| --- | --- |
| Original mimemagic 0.3.5 was unavailable, preventing old lockfile installation. | Expect historical dependency resolution failures; establish the smallest viable baseline update and document it. |
| Old Rails needed logger boot ordering adjustments; legacy Bootsnap was temporarily disabled. | Diagnose boot failures before changing unrelated application code; restore updated Bootsnap once compatible. |
| Tested route: Ruby 3.0.7 → 3.3.12 → 4.0.6; final Bundler 4.0.16, Node 24, Debian Trixie. | Recheck releases and platform support. Use a Ruby compatible with each Rails stage, not the newest Ruby at every stage. |
| Rails resolved to 8.1.3.1. JSON 3.0.2 caused session decoding argument errors; JSON 2.21.2 passed. | Test login/session decoding after dependency updates. Constrain JSON only if the same incompatibility reproduces, with a removal condition. |
| Removed trix-rails and unused Webpacker; npm Trix 2.1.19 served by Sprockets retained plain HTML columns. | **Do not copy that editor replacement. BigDumbWebDev uses Action Text.** Upgrade Action Text/Trix together and preserve rich-text records, embedded attachments and signed references. |
| will_paginate 4 broke an old Bootstrap pagination renderer API. | Test multiple pages, previous/next links and styling; inspect this app's renderer before choosing a fix. |
| Cached class-level metadata arrays became stale or returned nil. | Audit boot-time database access and shared mutable data; test changes becoming visible across requests. |
| Asset compilation initially needed secret/storage initialization changes. | Build-only dummy secrets must never become runtime secrets. Preserve production SECRET_KEY_BASE and existing credentials semantics. |
| Non-root boot initially failed because application directories were not writable. | Test actual container startup as the runtime UID, not just a successful image build. |
| Audio conversion must run after the attachment upload commit callback. | Review callback ordering where relevant. Do not copy audio machinery if the app does not need it. |
| Framework defaults still load Rails 6.0 with reviewed overrides. | Track defaults migration separately; test cookies/signed URLs before enabling newer defaults. |
| Elasticsearch 7, Font Awesome 5, image_processing 1.x and legacy Sass/Bootstrap remained exceptions. | Inventory this app independently. Do not add Elasticsearch or inherit unrelated pins. Record any exception with rationale and follow-up. |

Bundler lockfile updates and Bundler-version updates were performed separately. Keep native Linux platforms in the lockfile, but remember that an x86 lock entry does not prove x86 execution. A successful ARM build on the Mac does not validate the eventual Heroku image architecture.

## BigDumbWebDev-specific regression checklist

- Signup/activation, login/logout, reset email, guest-role transitions, profile changes and admin boundaries; preserve enum role integer values when changing deprecated enum syntax.
- Posts/projects: slugs, publication dates, draft visibility, publishing, author attribution and pagination.
- Action Text: save/reload rich text, existing embedded images, custom code formatting/Prism extension and local-storage autosave. Do not disable Trix attachments just because RDJesseeBlog did; the latter uses dedicated upload fields and plain HTML columns.
- Comments/replies, tags, notifications and permissions, including attachment/resume removal. Existing assessment identified `remove_resume` guard coverage and mutating GET routes as review targets, not yet verified fixes.
- Custom navigation/modals, flatpickr, animated landing page and 3D portfolio on desktop/mobile.
- Upload success, unsupported/empty/oversized input, image variants, external attachment access and friendly failures. Choose limits based on this site's content; RDJesseeBlog's 20 MB images and 200 MB audio/video are not universal requirements.
- Real S3 access and SendGrid delivery in the approved staging/release process. A free attached add-on, local mail test or rendered media player does not prove these integrations work.

## Operational lessons and boundaries

Docker on Heroku does not itself reduce dyno/database charges. The dated assessment found roughly $12/month per app ($7 Basic + $5 database), with S3 separate and $39 account invoices not fully attributed. Recheck billing; do not remove unrelated apps or PointDNS records to close the discrepancy. Buildpacks use numbered Heroku stacks; direct Docker deployment uses the container stack. Select based on support and maintenance, not an assumed Docker discount.

The prior production backup capture was declined. No fresh capture was made; resolve that approval before retrying production backup or deployment. Local upgrade work can continue independently. Keep dumps, real user data, credentials, local uploads and generated assets out of Git and Docker build contexts. Do not print config-var values in logs.

RDJesseeBlog scans initially reported no known gem/npm vulnerabilities and zero Brakeman warnings, but the later Brakeman rerun failed because its executable was missing from the development bundle. Make scan setup repeatable and rerun against the final revision; do not carry a historical clean result forward as current evidence. GitHub's default-branch alerts also describe that branch, not proof of the upgrade branch's status.

When committing: inspect staged paths, exclude Finder .DS_Store files, run diff checks, and push to GitHub origin rather than the Heroku deployment remote. If HTTPS Git lacks credentials but gh is already authenticated, the existing gh credential helper can be used for that command without exposing tokens or changing global Git settings.

## Maintain this memory as RDJesseeBlog finishes

Append final Rails-default decisions, dependency exceptions, target-architecture results, staging findings, actual deployed stack/release, backup/restore and rollback evidence, and cost changes. Replace provisional advice with verified outcomes. At the start of BigDumbWebDev, reconcile this handoff with RDJesseeBlog's latest plan and source rather than copying its Dockerfile or Gemfile verbatim.

## RDJesseeBlog final status (added 2026-09-12)

RDJesseeBlog's upgrade is complete and deployed to production (Heroku release v171 at the time of writing, on `heroku-24` via buildpacks, not the Docker image). Final toolchain: Rails 8.1.3.1, Ruby 4.0.6, Bundler 4.0.16, Node 24, Debian Trixie. JSON stayed pinned to 2.x (2.21.2) — no framework/dependency combination has yet made 3.x's session-decoding break go away, so treat that as a standing exception rather than a temporary one until re-tested. Its Rails/JSON/Node version numbers are a reference point, not something to copy blindly — recheck current stable releases when this app's upgrade actually starts.

Two additional things worth carrying over that this document didn't cover:

1. **A five-year-old missing migration only broke production after the Rails 8.1 deploy.** `db/schema.rb` had declared `active_storage_variant_records` since 2021, but the migration file that should have created it was never committed, so production Postgres never had the table — invisible until Rails 8.1's `ActiveStorage::VariantWithRecord` started requiring it for every image variant, which broke every image on the site until fixed. **Already checked for this app:** BigDumbWebDev's `db/schema.rb` and `db/migrate/20210305030844_create_active_storage_variant_records.active_storage.rb` are present and consistent with each other, so this specific gap is not expected to repeat — but verify `heroku run bin/rails db:migrate:status` against the live `big-dumb-web-dev` app before/after its own Rails 8.1 cutover anyway, rather than trusting schema.rb alone.
2. **RDJesseeBlog's docs got reorganized into `docs/development/` (living docs + a `ROADMAP.md`) and `docs/archive/` (point-in-time upgrade/rollout records), with only `README.md` staying at the repo root.** This app's docs now follow the `docs/development/` half of that convention (see `README.md`); once this app's own upgrade actually happens, the same split (moving what becomes historical into `docs/archive/`) is worth applying here too.

Full detail lives in `/Users/ajessee/Personal/RDJesseeBlog/docs/archive/UPGRADE-PLAN.md` and `docs/archive/HEROKU-DEPLOYMENT.md`, or ask Claude to summarize — its memory has a `rails-upgrade-playbook` entry distilling all of this.
