#!/bin/bash

set -eux

for p in "$@"; do
  npm i --save-dev "$p"
  git add .
  git commit --no-verify -m "$p"
done
