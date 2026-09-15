# Heroku deployment record — Phase 1 rollout

> **Archived.** Point-in-time record of the Phase 1 (Rails 6.1→8.1) production rollout. For current outstanding work, see [ROADMAP.md](../development/ROADMAP.md) and [UPGRADE-PLAN.md](UPGRADE-PLAN.md).

Deployed 2026-09-15. The user explicitly authorized skipping a separate staging environment and deploying straight to production with fast rollback readiness (a fresh backup beforehand, Heroku's native `rollback` available). This authorization was for this rollout specifically; it is not standing authorization for future production mutations.

## Starting state (before this rollout)

No code from the Rails 6.1→8.1 upgrade (see UPGRADE-PLAN.md Sections 1-4) had ever been deployed — production was still running the pre-upgrade Rails 6.1 app on the `heroku-20` stack, with only a couple of config-var-only releases (`v281`, `v282`) since February. Last database backup: 2021-03-08. No backup schedule. No Node buildpack (Webpacker's auto-provisioning had covered this on the old code).

## Blocker: heroku-20 is fully end-of-life

The first deploy attempt was rejected outright: `heroku-20` builds are no longer supported at all (end-of-life since April 30, 2025), not merely deprecated. This forced the stack upgrade to happen *before* any code could deploy, reversing the originally-planned order (deploy first, bump stack later, to change one variable at a time). Set to `heroku-24` — the stable middle option between `heroku-22` (older) and the very new `heroku-26` — matching the same choice RDJesseeBlog made for its own rollout.

## Buildpack correction

Added `heroku/nodejs` explicitly, before `heroku/ruby`:

1. `https://github.com/heroku/heroku-buildpack-activestorage-preview`
2. `heroku/nodejs`
3. `heroku/ruby`

Required because Webpacker's auto-provisioning of Node (which the old code relied on implicitly) is gone — Shakapacker needs its own explicit Node buildpack, confirmed necessary during the original Webpacker→Shakapacker migration (see UPGRADE-PLAN.md Section 2) and now exercised for real.

## Pre-deploy safety steps

- Fresh manual backup (`b043`) captured and verified (`heroku pg:backups:info`) before touching anything.
- A daily backup schedule (07:00 America/New_York) set up — previously nonexistent.

## Rollout sequence and a real bug found in production

1. `git push heroku andre/bigdumbwebdev-upgrade:master` → **release `v283`**. Build succeeded on `heroku-24` (Ruby 3.3.9 x86_64, Node 24.21.0, Shakapacker's webpack build completed, asset precompile clean). App booted and served real traffic immediately on the new code, still against the old (pre-migration) schema — confirmed safe, since nothing at boot depends on the pending migration.
2. `heroku run rails db:migrate` **failed**: `PG::UndefinedTable: table "version_associations" does not exist`. The migration (`DropPaperTrailVersionsTables`, written during Section 3) had only ever been verified against the local dev database — its own comment claimed both `versions` and `version_associations` were "still physically present in... dev/production databases," but production actually had neither table at all. Confirmed via `heroku run rails runner` querying `ActiveRecord::Base.connection.tables` directly.
3. Fixed the migration to use `drop_table ..., if_exists: true` on both tables (safe regardless of which exist where), verified both directions (migrate/rollback/migrate) against local dev, redeployed → **release `v284`**, re-ran `db:migrate` — succeeded cleanly this time.
4. Full production verification: `/up`, `/`, `/posts`, `/projects` all `200`; pack JS/CSS assets `200`; zero errors in logs since deploy; SES mail config confirmed resolving correctly (`delivery_method: ses`, real credentials present) without sending a live test message; a real browser check of the live site (desktop and mobile) — landing animation and the 3D-portfolio scroll section both render correctly, zero console errors.
5. Removed the now-dead `SENDGRID_API_KEY`/`SENDGRID_USERNAME`/`SENDGRID_PASSWORD` and `RAILS_LOG_TO_STDOUT` config vars (the latter vestigial since logging became unconditional in code — see UPGRADE-PLAN.md Section 3) → releases `v285`/`v286`. Confirmed the app stayed healthy after each restart.
6. Added a `release: bundle exec rails db:migrate` line to the `Procfile`, converting future migrations from a manual post-deploy `heroku run` step (used for this rollout) to an automatic Heroku release-phase step — see [PRODUCTION-DOCKER.md](../development/PRODUCTION-DOCKER.md) for the reasoning.

## Verified current state (end of this rollout)

- App: `big-dumb-web-dev`, one Basic web dyno, `heroku-24` stack.
- Buildpacks: activestorage-preview, `heroku/nodejs`, `heroku/ruby` (in that order).
- Running release: `v286`, deployed from commit `d29fc41` (the migration fix; `v283`/`v284` were the two code deploys, `v285`/`v286` were config-only cleanups).
- Config vars are now exactly: `DATABASE_URL`, `LANG`, `RACK_ENV`, `RAILS_ENV`, `RAILS_MASTER_KEY`, `RAILS_MAX_THREADS` (`5`), `RAILS_SERVE_STATIC_FILES` — no dead SendGrid or log-toggle vars remaining.
- Database: 29 migrations applied, including the paper_trail table drop; schema matches this branch exactly.
- Mail: Amazon SES (see [DOMAIN-AND-EMAIL.md](../development/DOMAIN-AND-EMAIL.md)), confirmed resolving correctly in the real production runtime.
- Backups: daily schedule active; a restore drill is written up but not yet executed — see [BACKUP-AND-RESTORE.md](../development/BACKUP-AND-RESTORE.md).
- Not yet done: uptime/error monitoring (recommended UptimeRobot's free tier — this app qualifies as non-commercial — but account setup is the user's own action, not something done here).

## Outstanding follow-up work

Tracked in [UPGRADE-PLAN.md](UPGRADE-PLAN.md) Section 5 rather than duplicated here — check there for exact current status, not this archived record.
