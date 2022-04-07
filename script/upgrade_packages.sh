#!/bin/bash

set -eux

git pull
git checkout "$1"
rm -rf node_modules/
npm ci
git add node_modules/
git commit -m 'npm ci'
git push
