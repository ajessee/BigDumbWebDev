require_relative 'boot'

require 'rails/all'

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module BigDumbWebDev
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 8.1

    # load_defaults 8.1 (actually since 7.1 - see railties/lib/rails/application/
    # configuration.rb) switches Active Storage's default variant_processor to :vips.
    # This app has only ever declared mini_magick/image_processing in its Gemfile, never
    # ruby-vips - :vips silently became the active default anyway once this app adopted
    # load_defaults 8.1, without anyone deciding it should be. Restoring it explicitly to
    # :mini_magick, the tool this app actually uses: with image_processing bumped to 2.x
    # (which dropped its own hard dependency on ruby-vips), :vips being selected forces
    # ActiveStorage::Transformers::Vips to require "image_processing/vips" at boot - which
    # raises a LoadError whose wording ("...requires the ruby-vips gem...") doesn't match
    # either pattern ActiveStorage::Engine's own rescue looks for (/libvips/ or
    # /image_processing/), so it crashes boot entirely rather than warning. Even with
    # ruby-vips added back, Debian Bullseye's libvips42 package is 8.10.5, older than the
    # 8.13 Active Storage itself now requires to safely enable vips's "untrusted content"
    # protections - a separate, hard RuntimeError with no override, only fixable by a
    # newer base image (out of scope here). :mini_magick sidesteps both problems and
    # matches how this app has always actually processed images.
    config.active_storage.variant_processor = :mini_magick

    # Configuration for the application, engines, and railties goes here.
    #
    # These settings can be overridden in specific environments using the files
    # in config/environments, which are processed later.
    #
    # config.time_zone = "Central Time (US & Canada)"
    # config.eager_load_paths << Rails.root.join("extras")
  end
end
