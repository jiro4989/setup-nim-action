#!/bin/bash

set -eu

shfmt -w -i 2 -sr -ci ./*.sh
