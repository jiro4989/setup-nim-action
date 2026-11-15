#!/bin/bash

# Print the assets of the preferred Nim devel nightly release.
#
# $1 is a path to a JSON array of GitHub releases. Prefer the rolling
# "latest-devel" release. When it is missing, use the first release whose tag
# matches "YYYY-MM-DD-devel-<sha>". The releases API returns newest first, so
# the first dated match is the latest; this function does not sort by date.
# "latest-devel" is kept even when it has no assets.
#
# Prints a JSON array of assets, or [] when nothing matches or the chosen
# release has no assets.
filter_latest_devel_assets() {
  jq -r '
    [ .[] | select(.tag_name == "latest-devel") ] +
    [ .[] | select(.tag_name | test("^[0-9]{4}-[0-9]{2}-[0-9]{2}-devel-")) ] |
    .[0].assets // []
  ' "$1"
}

# Print the release asset whose name matches an OS target.
#
# $1 is an unanchored regular expression matched against each asset name.
# $2 is a path to a JSON array of release assets. Each match is printed as a
# JSON object. Nothing is printed when no name matches.
filter_os_asset() {
  jq --arg target "$1" -r '.[] | select(.name | test($target))' "$2"
}

# Convert a Nim version wildcard into an anchored extended regular expression.
#
# $1 is a wildcard such as "1.6.x" or "1.x". Dots are escaped, "^" is added,
# and a trailing "x" is removed so the expression matches any suffix. Intended
# for grep -E over tag names with the leading "v" already stripped.
#
# Prints the expression. "1.6.x" becomes "^1\.6\." and "1.x" becomes "^1\.".
tag_regexp() {
  version=$1
  echo "$version" |
    sed -E \
      -e 's/\./\\./g' \
      -e 's/^/^/' \
      -e 's/x$//'
}

# Print the greatest version read from stdin.
#
# Each line is one version. The maximum is chosen with sort -V. Nothing is
# printed when stdin is empty.
latest_version() {
  sort -V | tail -n 1
}
