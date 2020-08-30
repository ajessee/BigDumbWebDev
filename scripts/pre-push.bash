#!/usr/bin/env bash

echo "Running pre-push hook"
./scripts/run-brakeman.bash
./scripts/run-tests.bash

# $? stores exit value of the last command
if [ $? -ne 0 ]; then
 echo "Brakeman and Minitests must pass before pushing!"
 echo "Make sure you pull the prod DB and create new fixtures prod DB or you'll get weird errors"
 exit 1
fi