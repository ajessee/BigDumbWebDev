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
# Pinned to the latest 6.1.x patch (not yet a version-climb step) because the original
# 6.1.3 lockfile depends on mimemagic 0.3.5, which was yanked from RubyGems; a newer
# 6.1.x patch pulls in a newer activestorage -> marcel requirement that avoids it
# entirely, same fix RDJesseeBlog used at this identical starting point.
gem 'rails', '~> 6.1.0'
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

group :development do
  # Access an interactive console on exception pages or by calling 'console' anywhere in the code.
  gem 'listen', '>= 3.0.5', '< 3.2'
  gem 'web-console', '>= 3.3.0'
  # Spring speeds up development by keeping your application running in the background. Read more: https://github.com/rails/spring
  gem 'spring'
  gem 'spring-watcher-listen', '~> 2.0.0'
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
  # selenium-webdriver depends on logger ~> 1.4, which resolves to the newest 1.x by
  # default. Pinned to exactly match Ruby's own bundled default logger gem version so
  # Bundler never activates a different version than what's already active by default -
  # a mismatch there caused "already activated logger 1.4.3, but Gemfile requires ..."
  # conflicts in binstubs that require 'bundler/setup' directly (e.g. webpack-dev-server).
  gem 'logger', '1.4.3'
end
