ENV['BUNDLE_GEMFILE'] ||= File.expand_path('../Gemfile', __dir__)

# Load stdlib Logger before Bundler activates the pinned `logger` gem (added for
# selenium-webdriver - see Gemfile). active_support/logger.rb requires
# active_support/logger_silence before it requires "logger" itself, and that file
# references Logger::Severity at load time - it only worked before by accident, via
# whatever else happened to load `logger` first. Requiring it explicitly here restores
# that ordering regardless of what else changes.
require 'logger'

require 'bundler/setup' # Set up gems listed in the Gemfile.
require 'bootsnap/setup' # Speed up boot time by caching expensive operations.
