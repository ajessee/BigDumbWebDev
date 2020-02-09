#!/usr/bin/env bash

echo "Running pre-commit hook"
./scripts/run-rubocop.bash

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 echo "Rubocop issues detected. Please fix them. Soonish."
#  exit 1
fi