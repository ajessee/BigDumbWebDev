#!/usr/bin/env bash

set -e

cd "${0%/*}/.."

echo "Running tests"
bundle exec rails test
bundle exec rails test:system