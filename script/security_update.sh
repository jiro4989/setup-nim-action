#!/bin/bash

set -eux

today=$(date +%Y-%m-%d)
git checkout -b "chore/security-update-$today"
npm audit fix
git add package*.json node_modules
git commit -m ':shield: security update'
