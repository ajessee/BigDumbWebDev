# Be sure to restart your server when you modify this file.

# Version of your assets, change this if you want to expire all your assets.
Rails.application.config.assets.version = '1.0'

# Add additional assets to the asset load path.
# Rails.application.config.assets.paths << Emoji.images_path
# Add Yarn node_modules folder to the asset load path.
Rails.application.config.assets.paths << Rails.root.join('node_modules')

# Precompile additional assets.
# application.js, application.css, and all non-JS/CSS in the app/assets
# folder are already added.
#
# The old `%w[projects_3d_scroll.css]` entry here asked Sprockets to compile that one
# .scss file as its own standalone Sprockets-processed CSS target (via sass-rails/sassc)
# - dead weight even before this Sass migration, since nothing ever loaded it as a
# separate stylesheet (only stylesheet_link_tag 'application' is used anywhere in the
# app). Removed as part of replacing sass-rails with dartsass-rails: Sprockets no longer
# has a Sass processor registered at all (dartsass-rails compiles app/assets/stylesheets/
# application.scss, which already @imports projects_3d_scroll.scss, to
# app/assets/builds/application.css directly), so this line would otherwise fail with
# "cannot load such file -- sassc" trying to process it through Sprockets' own pipeline.

# sprockets-rails' own default precompile list always includes "application.css", and
# Rails auto-adds every app/assets/* subdirectory (including app/assets/stylesheets) to
# Sprockets' load path regardless of what manifest.js links. With app/assets/stylesheets/
# application.scss sitting in that load path, Sprockets resolves the "application.css"
# target back to that .scss source and tries to compile it through its OWN (now absent)
# Sass processor - the same "cannot load such file -- sassc" error, just from a different
# trigger than the one above. dartsass-rails already compiles that exact file to
# app/assets/builds/application.css (linked into Sprockets via manifest.js's
# `link_tree ../builds`, which is what stylesheet_link_tag 'application' actually serves)
# - so tell Sprockets not to also treat the .scss source directory as one of its own asset
# paths, and drop the redundant "application.css" precompile target it implies.
#
# Must happen inside `assets.configure` (not directly here): sprockets-rails adds its own
# default app/assets/* paths, including this one, via its own initializer, which runs
# AFTER config/initializers/*.rb - a plain `config.assets.paths.delete` here would run too
# early and get overwritten. `configure` blocks run lazily when the Sprockets::Environment
# is actually built, guaranteed to be after every path has already been added.
Rails.application.config.assets.precompile.delete('application.css')
Rails.application.config.assets.configure do |env|
  # env.paths is a frozen snapshot (no #paths=/single-path #delete) - rebuild it via
  # clear_paths + append_path instead.
  remaining_paths = env.paths.reject { |path| path == Rails.root.join('app/assets/stylesheets').to_s }
  env.clear_paths
  remaining_paths.each { |path| env.append_path(path) }
end
