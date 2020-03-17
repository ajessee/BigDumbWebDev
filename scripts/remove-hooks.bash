#!/usr/bin/env bash

GIT_DIR=$(git rev-parse --git-dir)

echo "Removing hooks..."
rm $GIT_DIR/hooks/pre-commit
rm $GIT_DIR/hooks/pre-push
echo "Done!"