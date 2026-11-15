#!/bin/bash

set -eu

shfmt -w -i 2 -sr -ci ./*.sh ./lib/*.sh ./script/*.sh ./test/*.bats
