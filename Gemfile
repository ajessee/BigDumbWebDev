# frozen_string_literal: true

source 'https://rubygems.org'
git_source(:github) { |repo| "https://github.com/#{repo}.git" }

# TO DEVELOP ON WINDOWS, UNCOMMENT THESE GEMS
# gem 'wdm', '>= 0.1.0' if Gem.win_platform?
# Windows does not include zoneinfo files, so bundle the tzinfo-data gem
# gem 'tzinfo-data', platforms: [:mingw, :mswin, :x64_mingw, :jruby]

# Bumped 3.0.0 -> 3.0.7 as an interim step (not yet the version-climb): needed for a
# Debian base image with glibc >= 2.29 for Nokogiri's precompiled binary. RDJesseeBlog
# made this identical move at this identical starting point - see UPGRADE-LEARNINGS.md.
ruby '3.0.7'

# Bundle edge Rails instead: gem 'rails', github: 'rails/rails'
# Version climb step: 6.1 -> 7.0 (gem only; config.load_defaults stays 6.1 for now,
# bumped separately once this step is green - see UPGRADE-PLAN.md).
gem 'rails', '~> 7.0.0'
# Use postgresql as the database for Active Record
gem 'pg'
# Use Puma as the app server
gem 'puma'
# Use SCSS for stylesheets
gem 'sass-rails'
# Transpile app-like JavaScript. Read more: https://github.com/rails/webpacker
gem 'webpacker'
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
# Reduces boot times through caching; required in config/boot.rb
gem 'bootsnap', require: false
gem 'faker'
gem 'will_paginate'
# Use rubocop for git pre-commit hook
gem 'rubocop'
# Use brakeman for git pre-push hook
gem 'brakeman'
# Used for creating fixtures from dev database, see rake tasks
gem 'humanize'
# Gem to do all kinds of geolocation magic
gem 'geocoder'
# Call 'byebug' anywhere in the code to stop execution and get a debugger console
gem 'pry-byebug', platforms: %i[mri mingw x64_mingw]

# Ruby default gems that Bundler must never activate a different version of than the one
# already active by default, or every boot hits "already activated X, but Gemfile
# requires Y" (Bundler treats default gems specially). Both are genuine activesupport
# dependencies now (not just brought in by a test-only gem), so pinned here, not in a
# group. Versions match Ruby 3.0.7's own bundled defaults.
gem 'logger', '1.4.3'
gem 'mutex_m', '0.1.1'

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
end

group :test do
  # Bumped alongside selenium-webdriver: 3.35.3 predates Selenium 4.26's logger API
  # changes and calls into it incompatibly (ArgumentError inside logger_suppressor.rb).
  gem 'capybara', '~> 3.40'
  gem 'capybara-email'
  gem 'minitest-reporters'
  # Selenium 4's built-in Selenium Manager replaces the deprecated `webdrivers` gem
  # (which pinned selenium-webdriver < 4.0 and can't drive a current Chrome/Chromedriver).
  gem 'selenium-webdriver', '~> 4.0'
end
