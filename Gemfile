# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# TO DEVELOP ON WINDOWS, UNCOMMENT THESE GEMS
# gem 'wdm', '>= 0.1.0' if Gem.win_platform?
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:windows, :jruby]

# Bumped 3.0.7 -> 3.3.9 as part of this version-climb step: Rails 7.2 requires Ruby
# >= 3.1. Matches RDJesseeBlog's own path through this transition (3.0.7 -> 3.3.12 ->
# 4.0.6); 4.x deferred until the Rails 8.x steps.
ruby '3.3.9'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
# Version climb step: 8.0 -> 8.1, the final targeted version (gem only; config.load_defaults
# stays 6.1 for now).
gem 'rails', '~> 8.1.0'
# Use postgresql as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma'
# sass-rails -> sassc-rails -> sassc (LibSass, a native extension) was replaced with
# dartsass-rails, the Rails-team-maintained successor. LibSass itself has been
# deprecated upstream since 2020 (superseded by Dart Sass); Rails 7+ app generators no
# longer offer sass-rails at all. Functional parity only - Sprockets still serves the
# compiled CSS via stylesheet_link_tag 'application' exactly as before.
gem 'dartsass-rails'
# sass-rails was the only thing pulling in sprockets-rails - Rails 7+ no longer bundles
# it by default (the asset pipeline is opt-in via an explicit gem now). This app still
# needs it directly for app/assets/{images,audio,stylesheets} and asset_path/
# stylesheet_link_tag, independent of whichever Sass compiler is in use.
gem 'sprockets-rails'
# Webpacker's maintained successor (webpacker itself is EOL and no longer accepted by
# Rails/its own bugs). Kept deliberately, not a jsbundling-rails/esbuild swap: it's still
# genuinely webpack under the hood, so app/javascript/application/index.js's
# require.context-based dynamic loading (a webpack-only API this app's whole hand-rolled
# JS load order depends on) keeps working unchanged. Functional parity only this phase -
# the idiomatic import-map/Turbo/Stimulus rewrite is Phase 2's job.
gem 'shakapacker', '~> 8.0'
# Shakapacker's DevServerProxy relies on rack-proxy's old dynamic-backend-by-default
# behavior to proxy /packs/* to the dev server, based on env["HTTP_HOST"] etc, which it
# sets directly but never pairs with rack-proxy's own :backend/allow_dynamic_backend
# opts (Shakapacker::Engine's "shakapacker.proxy" initializer only passes
# ssl_verify_none: true). Per rack-proxy's own source comment ("Since 1.0 that dynamic
# mode is refused (502) unless explicitly opted into"), this SSRF-hardening default
# actually landed AT 1.0.0, not 2.0 as first suspected from the 2.0.0 changelog alone -
# confirmed by reading 1.0.2's perform_request, which still unconditionally 502s here.
# Shakapacker's gemspec has no upper bound on rack-proxy (>= 0.6.1), so Bundler
# resolves the newest incompatible line unless pinned to the last pre-1.0 release here.
gem 'rack-proxy', '~> 0.8.3'
# Build JSON APIs with ease. Read more: https://github.com/rails/jbuilder
gem 'jbuilder'
# Use Redis adapter to run Action Cable in production
# gem 'redis', '~> 4.0'
# Use Active Model has_secure_password
gem 'bcrypt'
gem 'mini_magick'
# Gem to do HTML diffs
gem 'diffy'
# Use Active Storage variant
gem 'image_processing'
# AWS gem
gem 'aws-sdk-s3', require: false
# SES mail delivery (see app/lib/ses_delivery_method.rb)
gem 'aws-sdk-sesv2', require: false
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false
gem 'will_paginate'
# Gem to do all kinds of geolocation magic
gem 'geocoder'

# Ruby default gems that Bundler must never activate a different version of than the one
# already active by default, or every boot hits "already activated X, but Gemfile
# requires Y" (Bundler treats default gems specially). Both are genuine activesupport
# dependencies now (not just brought in by a test-only gem), so pinned here, not in a
# group. Versions must track whatever Ruby itself currently bundles by default - update
# these whenever Ruby is bumped (currently Ruby 3.3.9's own bundled defaults).
gem 'logger', '1.6.0'
gem 'mutex_m', '0.2.0'
# JSON 3.0.2 (Rails 8.1's resolved default) breaks ActiveStorage blob metadata
# deserialization here (ArgumentError: wrong number of arguments in JSON.parse) - the
# same session/JSON-decoding regression RDJesseeBlog's identical upgrade hit at this same
# Rails version (see UPGRADE-LEARNINGS.md). Same fix: pin to the 2.x line.
gem 'json', '~> 2.0'

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  # Rails 7.0's ActiveSupport::EventedFileUpdateChecker requires listen ~> 3.5; the old
  # '< 3.2' ceiling was just the original rails-new-generated default, not a deliberate pin.
  gem 'listen', '~> 3.5'
  gem 'web-console', '>= 3.3.0'
  # Spring removed as part of the Rails 6.1 -> 7.0 step: 2.1.1 (the latest release) calls
  # ActiveSupport::Dependencies.mechanism=, removed under Rails 7's Zeitwerk-only
  # autoloading. No newer Spring release exists to fix this - it's unmaintained relative
  # to current Rails. bin/rails and bin/rake no longer load it.
  #
  # Moved out of the default group, 2026-09-14: none of these four are needed at runtime
  # (production or otherwise) - they were only in the default group because that's where
  # they started out, not for any actual boot-time dependency. `require: false` on
  # rubocop/brakeman since both are invoked as external CLI commands
  # (`bundle exec rubocop`/`bin/rubocop`, `bundle exec brakeman`), never `require`d by
  # app code.
  # Use rubocop for git pre-commit hook
  gem 'rubocop', require: false
  # Use brakeman for git pre-push hook
  gem 'brakeman', require: false
  # Used for creating fixtures from dev database, see lib/tasks/create_fixtures_from_db.rake
  # - genuinely dev-only, not referenced anywhere else in app/lib.
  gem 'humanize'
end

# faker is also used by test/helpers/generate_user_info.rb (not just db/seeds.rb), and
# pry-byebug is as useful for dropping a breakpoint inside a failing test as inside a
# dev-server request - hence :development, :test rather than :development alone.
group :development, :test do
  gem 'faker'
  # Call 'byebug' anywhere in the code to stop execution and get a debugger console
  # Bundler 2.7+ deprecates :mingw/:x64_mingw in favor of the consolidated :windows
  # platform (bumped as part of the Bundler 2.5.22 -> 2.7.2 update below).
  gem 'pry-byebug', platforms: %i[mri windows]
end

group :test do
  # Bumped alongside selenium-webdriver: 3.35.3 predates Selenium 4.26's logger API
  # changes and calls into it incompatibly (ArgumentError inside logger_suppressor.rb).
  gem 'capybara', '~> 3.40'
  gem 'capybara-email'
  gem 'minitest-reporters'
  # minitest-reporters' loose upper bound (< 7) let bundler pick minitest 6.x, which
  # Rails 7.2.3's test_unit integration isn't compatible with yet (ArgumentError in
  # railties/test_unit/line_filtering.rb). Pin to the 5.x line Rails actually supports.
  gem 'minitest', '~> 5.0'
  # Selenium 4's built-in Selenium Manager replaces the deprecated `webdrivers` gem
  # (which pinned selenium-webdriver < 4.0 and can't drive a current Chrome/Chromedriver).
  gem 'selenium-webdriver', '~> 4.0'
end
