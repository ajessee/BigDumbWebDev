# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

BigDumbWebDev (`www.bigdumbweb.dev`) is Andre's personal portfolio and blog site — a Rails 6.1 app (still running Rails 6.0 framework defaults) built to document his own path into web development. It's deployed on Heroku (`big-dumb-web-dev`) and deliberately hand-rolled: vanilla JS/CSS rather than a frontend framework, a custom rich-text editor extension, a custom modal/notification/menu system, and a from-scratch auth system rather than Devise/Sorcery.

**A Rails 6.1 → 8.1 upgrade is planned but not started.** Before making any non-trivial change, read [docs/development/UPGRADE-PLAN.md](docs/development/UPGRADE-PLAN.md) (a source-level audit of exactly what's outdated, broken, or risky in this codebase) and [docs/development/UPGRADE-LEARNINGS.md](docs/development/UPGRADE-LEARNINGS.md) (lessons carried over from the sibling RDJesseeBlog app's completed identical upgrade). Both docs contain specific, already-confirmed findings (not speculation) about this exact codebase.

## Commands

There is no working local Ruby installation or Docker setup for this app yet (Ruby `3.0.0` per `.ruby-version`/`Gemfile`; setting one up is Phase 1 of the upgrade plan). The commands below are what the codebase itself expects, for whenever a working toolchain exists — do not assume they currently run on this machine.

- Setup: `bin/setup` (bundles, runs `bin/yarn`, `bin/rails db:prepare`, clears logs/tmp, restarts)
- Dev server: `bin/rails server` — **also requires `bin/webpack-dev-server` running in a separate process** for JS/CSS to recompile (standard Webpacker dual-process setup; there's no single "just run the app" command until Webpacker is replaced)
- All non-system tests: `bin/rails test`
- System tests only (not run by `bin/rails test`): `bin/rails test:system` — runs real (non-headless) Chrome via Selenium at `--auto-open-devtools-for-tabs`, `screen_size: [1920, 1080]`; Capybara is fixed to `localhost:3001`
- Single test file: `bin/rails test test/models/user_test.rb`
- Single test by name: `bin/rails test test/models/user_test.rb -n test_method_name` (or `-n "/pattern/"`)
- Lint: `bundle exec rubocop` (no `.rubocop.yml` — runs on RuboCop's default rules; the Gemfile comment aspires to a pre-commit hook, but none is actually installed in `.git/hooks`)
- Security scan: `bundle exec brakeman`
- Pull production data into development: `rake db:pull_prod_db` — captures a real Heroku Postgres backup and restores it over the local dev database. **This is why `config.active_storage.service` is set to `:amazon` (real S3) in `development.rb`, not `:local`** — the two are linked; changing one without the other will leave dev pointing at attachments that don't resolve, or vice versa.
- Regenerate `test/fixtures/*.yml` from the current dev database: `rake db:create_fixtures` — worth knowing that several fixture files referenced by (commented-out) tests don't currently exist (e.g. no `test/fixtures/users.yml`), so this task hasn't been run recently or its output isn't checked in.

## Architecture

**Authorization is entirely controller-level, not route-level.** `config/routes.rb` has no `constraints`/`namespace` scoping by role — every auth/ownership check lives in `before_action` callbacks inside each controller (e.g. `UsersController`'s `logged_in_user`/`correct_user`/`admin_user`). When adding a new mutating action, the existing pattern to follow is: add it to the relevant `before_action ..., only: %i[...]` list(s), not just implement the action. This same pattern is *why* `remove_resume` was missing its guard until recently — it's easy to add an action and forget to also add it to every relevant filter's `only:` list.

**Two-stage anonymous "guest" identity system**, distinct from full signup: `User#role` enum is `guest_1 → guest_2 → user → admin` (currently declared with the old keyword-arg `enum role: [...]` syntax — preserve the integer order if this is ever migrated to the modern positional form). `GuestUsersHelper` creates a cookie-identified `guest_1` user on first visit (random `guest_#{uuid}@bigdumbweb.dev` email, shared password from Rails credentials) so anonymous visitors can comment; `UsersController#create` promotes `guest_1 → guest_2` when someone starts filling out the signup form, and `GET /demote_guest` can reverse that. All of `ApplicationController`'s cross-cutting behavior (`SessionsHelper`, `GuestUsersHelper`, `MessagesAndCookieHelper`, `ErrorsHelper`, `PostsHelper`) is mixed in via `include`, not inheritance — start there when tracing where a helper method used across controllers is actually defined.

**Rich text (Action Text/Trix) has a custom, DOM-coupled toolbar extension.** `User#details`, `Post#content`, and `Comment#content` all `has_rich_text`. `app/javascript/application/trix.js` registers custom heading levels, foreground/background color swatches, underline, a horizontal-rule attachment, and an "attach files" action — all via direct `Trix.config`/DOM manipulation against Trix's internal toolbar structure, so a Trix version bump needs a manual visual smoke test, not just a green test suite. `config/initializers/action_text.rb` allow-lists the `style` HTML attribute specifically so the color-swatch feature survives Action Text's sanitizer — if that allow-list is ever lost, existing colored/heading rich text will silently render unstyled rather than error. Code syntax highlighting (Prism) is a CDN script tag in the layout (`app/views/layouts/_prism_js.html.erb`/`_prism_css.html.erb`), not an npm package — it's independent of the Rails/Trix/Webpacker stack entirely.

**Frontend JS has an implicit load-order dependency, not a module system.** Everything under `app/javascript/application/` is loaded together via one Webpacker entrypoint (`packs/application.js`); `main.js` sets global `window.utils`/`window.projects` objects that other files (e.g. `projects-3d-scroll.js`, the 3D portfolio effect) read as globals. Any future bundler migration needs to either preserve load order or make these dependencies explicit.

**Active Storage**: `User` has `image`/`resume` (`has_one_attached`), `Project`/`Resource` have `image`. No custom variants/previews are defined anywhere — attachments are used as-is. Storage service is S3 (`:amazon`) in both development and production (see the `pull_prod_db` note above for why).
