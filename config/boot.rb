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

# Psych 4+ (bundled with Ruby since 3.1) disabled YAML alias parsing by default in
# YAML.load/load_file. This app trusts all of its own YAML files, so restore the old
# behavior globally rather than track down every affected caller. Concrete trigger:
# Webpacker 5.2.1's own bundled default config template (vendored inside the gem, not a
# file this app can edit) uses `<<: *default` anchors and loads them with plain
# YAML.load_file, crashing (Psych::AliasesNotEnabled) during Webpacker's railtie
# initializer - which runs too early for a config/initializers/*.rb version of this fix to
# help, hence it's here in boot.rb instead. Webpacker is slated for full replacement later
# in this upgrade (see UPGRADE-PLAN.md) - remove this once that happens.
if Psych::VERSION.to_i >= 4
  module PsychAliasesCompatibility
    def load(yaml, *args, **kwargs)
      kwargs[:aliases] = true unless kwargs.key?(:aliases)
      super(yaml, *args, **kwargs)
    end

    def load_file(path, *args, **kwargs)
      kwargs[:aliases] = true unless kwargs.key?(:aliases)
      super(path, *args, **kwargs)
    end
  end

  YAML.singleton_class.prepend(PsychAliasesCompatibility)
end
