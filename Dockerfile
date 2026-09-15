# syntax=docker/dockerfile:1
#
# Production image. A locally validated portability candidate, mirroring the pattern
# already proven out on the sibling RDJesseeBlog app (see its docs/development/
# PRODUCTION-DOCKER.md) rather than reinventing one - production itself still deploys via
# Heroku buildpacks (see docs/development/UPGRADE-PLAN.md Section 5), not this image.
#
# Unlike RDJesseeBlog, this app has no audio/video processing (no ffmpeg) and uses
# mini_magick/ImageMagick rather than libvips for Active Storage variants (see
# UPGRADE-PLAN.md's image_processing/variant_processor finding) - so this image installs
# imagemagick instead of libvips42/ffmpeg, and is correspondingly smaller.
ARG RUBY_VERSION=3.3.9
FROM node:24.21.0-trixie AS node
FROM ruby:${RUBY_VERSION}-slim-trixie AS base
WORKDIR /app
# perl/dpkg/libc6/zlib1g are already present in the base image (not app dependencies),
# but listed explicitly so apt actually upgrades them to whatever patched version is
# available - a bare `apt-get install` of just the new packages below leaves already-
# installed base-image packages at whatever version the image was built with. Same
# pattern RDJesseeBlog used for its own OpenSSL base-layer CVE.
RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    ca-certificates curl dpkg imagemagick libc6 libpcre2-8-0 libpq5 libsqlite3-0 \
    openssl perl tzdata zlib1g \
    && rm -rf /var/lib/apt/lists/*
# RAILS_LOG_TO_STDOUT is intentionally not set here: production.rb logs to STDOUT
# unconditionally now (see UPGRADE-PLAN.md Section 3), so the var is no longer read.
ENV RAILS_ENV=production BUNDLE_PATH=/usr/local/bundle \
    BUNDLE_WITHOUT=development:test RAILS_SERVE_STATIC_FILES=1

FROM base AS build
RUN apt-get update -qq && apt-get install --no-install-recommends -y \
    build-essential git libpq-dev libyaml-dev pkg-config \
    && rm -rf /var/lib/apt/lists/*
COPY --from=node /usr/local/bin/node /usr/local/bin/node
COPY --from=node /usr/local/lib/node_modules /usr/local/lib/node_modules
RUN ln -s /usr/local/lib/node_modules/npm/bin/npm-cli.js /usr/local/bin/npm \
    && npm install -g yarn@1.22.19
# Matches Gemfile.lock's BUNDLED WITH - see Dockerfile.dev for why this has to be forced
# via gem install rather than trusting Ruby's own bundled-default Bundler version.
RUN gem install bundler -v 2.7.2
ENV BUNDLER_VERSION=2.7.2
COPY Gemfile Gemfile.lock ./
RUN bundle config set frozen true && bundle install && rm -rf /usr/local/bundle/cache
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --ignore-scripts
COPY . .
# This stage cannot reach a database, S3, SES, or any external service - proves the
# asset build (Sprockets + Shakapacker, both run by this one task) needs none of them.
RUN --network=none SECRET_KEY_BASE_DUMMY=1 bundle exec rails assets:precompile
RUN rm -rf node_modules tmp/cache log/*

FROM base
RUN groupadd --gid 1000 rails && useradd --uid 1000 --gid 1000 --create-home rails
COPY --from=build /usr/local/bundle /usr/local/bundle
COPY --from=build --chown=rails:rails /app /app
# Ruby's own bundled default versions of net-imap/erb are superseded by the Gemfile pins
# (see Gemfile's comment) but still physically present in this `base`-derived stage's own
# Ruby install (a separate path from Bundler's /usr/local/bundle above, so copying that
# alone never removes these) - a security scanner has no way to know Bundler will never
# load them, so remove them outright rather than leave known-CVE files sitting unused in
# the shipped image. `gem uninstall` refuses on principle for true default gems (erb), so
# delete the files directly instead.
RUN rm -rf /usr/local/lib/ruby/gems/3.3.0/gems/net-imap-0.4.* \
    /usr/local/lib/ruby/gems/3.3.0/specifications/net-imap-0.4.*.gemspec \
    /usr/local/lib/ruby/gems/3.3.0/cache/net-imap-0.4.*.gem \
    /usr/local/lib/ruby/gems/3.3.0/gems/erb-4.0.* \
    /usr/local/lib/ruby/gems/3.3.0/specifications/default/erb-4.0.*.gemspec
RUN mkdir -p /app/log /app/tmp/pids /app/storage \
    && chown -R rails:rails /app/log /app/tmp /app/storage \
    && chown rails:rails /app
USER rails
EXPOSE 3000
ENTRYPOINT ["/app/bin/docker-entrypoint"]
CMD ["bundle", "exec", "puma", "-C", "config/puma.rb"]
