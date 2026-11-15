#!/usr/bin/env bats

setup() {
  # shellcheck source=lib/lib.sh
  source "${BATS_TEST_DIRNAME}/../lib/lib.sh"
}

assert_eq() {
  if [[ "$1" != "$2" ]]; then
    printf 'expected: %s\nactual:   %s\n' "$2" "$1" >&2
    return 1
  fi
}

assert_json_eq() {
  local actual="$1"
  local expected="$2"
  if ! jq -e -n --argjson actual "$actual" --argjson expected "$expected" '$actual == $expected' > /dev/null; then
    printf 'expected JSON: %s\nactual JSON:   %s\n' "$expected" "$actual" >&2
    return 1
  fi
}

@test "tag_regexp anchors a minor wildcard and escapes dots" {
  run tag_regexp "1.6.x"
  [ "$status" -eq 0 ]
  assert_eq "$output" '^1\.6\.'
}

@test "tag_regexp anchors a major wildcard and escapes dots" {
  run tag_regexp "1.x"
  [ "$status" -eq 0 ]
  assert_eq "$output" '^1\.'
}

@test "tag_regexp escapes every dot in a multi-digit wildcard" {
  run tag_regexp "10.20.x"
  [ "$status" -eq 0 ]
  assert_eq "$output" '^10\.20\.'
}

@test "latest_version prints the highest version" {
  local actual
  actual="$(
    printf '%s\n' \
      '1.4.8' \
      '1.6.0' \
      '1.6.2' \
      '1.6.10' \
      '2.0.0' \
      '2.0.9' \
      '2.0.10' \
      '1.9.9' |
      latest_version
  )"
  assert_eq "$actual" "2.0.10"
}

@test "latest_version prints the only version" {
  local actual
  actual="$(printf '%s\n' '1.6.8' | latest_version)"
  assert_eq "$actual" "1.6.8"
}

@test "latest_version prints nothing for empty input" {
  local actual
  actual="$(latest_version < /dev/null)"
  assert_eq "$actual" ""
}

@test "tag_regexp and latest_version resolve a minor wildcard" {
  local actual
  actual="$(
    printf '%s\n' \
      '1.4.8' \
      '1.6' \
      '1.6.0' \
      '1.6.2' \
      '1.6.12' \
      '1.60.0' \
      '2.0.0' |
      grep -E "$(tag_regexp '1.6.x')" |
      latest_version
  )"
  assert_eq "$actual" "1.6.12"
}

@test "tag_regexp and latest_version resolve a major wildcard" {
  local actual
  actual="$(
    printf '%s\n' \
      '1.4.8' \
      '1.6.12' \
      '1.10.0' \
      '2.0.0' \
      '11.0.0' |
      grep -E "$(tag_regexp '1.x')" |
      latest_version
  )"
  assert_eq "$actual" "1.10.0"
}

@test "filter_latest_devel_assets prefers latest-devel over dated releases" {
  local releases="$BATS_TEST_TMPDIR/releases.json"
  cat > "$releases" << 'EOF'
[
  {
    "tag_name": "2026-11-15-devel-newsha",
    "assets": [{ "name": "dated.tar.xz" }]
  },
  {
    "tag_name": "latest-devel",
    "assets": [
      {
        "name": "linux_x64.tar.xz",
        "browser_download_url": "https://example.invalid/latest"
      }
    ]
  }
]
EOF

  run filter_latest_devel_assets "$releases"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '[{"name":"linux_x64.tar.xz","browser_download_url":"https://example.invalid/latest"}]'
}

@test "filter_latest_devel_assets falls back to the first dated devel release" {
  local releases="$BATS_TEST_TMPDIR/releases.json"
  cat > "$releases" << 'EOF'
[
  {
    "tag_name": "v2.2.0",
    "assets": [{ "name": "stable.tar.xz" }]
  },
  {
    "tag_name": "2026-11-15-devel-newsha",
    "assets": [{ "name": "newer.tar.xz" }]
  },
  {
    "tag_name": "2020-01-01-devel-oldsha",
    "assets": [{ "name": "older.tar.xz" }]
  }
]
EOF

  run filter_latest_devel_assets "$releases"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '[{"name":"newer.tar.xz"}]'
}

@test "filter_latest_devel_assets keeps API order instead of sorting dates" {
  local releases="$BATS_TEST_TMPDIR/releases.json"
  cat > "$releases" << 'EOF'
[
  {
    "tag_name": "2020-01-01-devel-oldsha",
    "assets": [{ "name": "first.tar.xz" }]
  },
  {
    "tag_name": "2026-11-15-devel-newsha",
    "assets": [{ "name": "second.tar.xz" }]
  }
]
EOF

  run filter_latest_devel_assets "$releases"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '[{"name":"first.tar.xz"}]'
}

@test "filter_latest_devel_assets returns an empty array when latest-devel has no assets" {
  local releases="$BATS_TEST_TMPDIR/releases.json"
  cat > "$releases" << 'EOF'
[
  {
    "tag_name": "latest-devel"
  },
  {
    "tag_name": "2026-11-15-devel-abc",
    "assets": [{ "name": "dated.tar.xz" }]
  }
]
EOF

  run filter_latest_devel_assets "$releases"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '[]'
}

@test "filter_latest_devel_assets returns an empty array when nothing matches" {
  local releases="$BATS_TEST_TMPDIR/releases.json"
  cat > "$releases" << 'EOF'
[
  {
    "tag_name": "2026-1-02-devel-abc",
    "assets": [{ "name": "unpadded.tar.xz" }]
  },
  {
    "tag_name": "prefix-2026-11-15-devel-abc",
    "assets": [{ "name": "prefixed.tar.xz" }]
  },
  {
    "tag_name": "devel",
    "assets": [{ "name": "devel.tar.xz" }]
  },
  {
    "tag_name": "v2.2.0",
    "assets": [{ "name": "stable.tar.xz" }]
  }
]
EOF

  run filter_latest_devel_assets "$releases"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '[]'
}

@test "filter_latest_devel_assets returns an empty array for an empty release list" {
  local releases="$BATS_TEST_TMPDIR/releases.json"
  printf '%s\n' '[]' > "$releases"

  run filter_latest_devel_assets "$releases"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '[]'
}

@test "filter_latest_devel_assets fails when the release file is missing" {
  run filter_latest_devel_assets "$BATS_TEST_TMPDIR/missing.json"
  [ "$status" -ne 0 ]
}

write_os_assets() {
  local path="$1"
  cat > "$path" << 'EOF'
[
  {
    "name": "linux_x64.tar.xz",
    "browser_download_url": "https://example.invalid/linux"
  },
  {
    "name": "windows_x64.zip",
    "browser_download_url": "https://example.invalid/windows"
  },
  {
    "name": "macosx_x64.tar.xz",
    "browser_download_url": "https://example.invalid/macos"
  }
]
EOF
}

@test "filter_os_asset selects the linux asset" {
  local assets="$BATS_TEST_TMPDIR/assets.json"
  write_os_assets "$assets"

  run filter_os_asset "linux_x64" "$assets"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '{"name":"linux_x64.tar.xz","browser_download_url":"https://example.invalid/linux"}'
}

@test "filter_os_asset selects the windows asset" {
  local assets="$BATS_TEST_TMPDIR/assets.json"
  write_os_assets "$assets"

  run filter_os_asset "windows_x64" "$assets"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '{"name":"windows_x64.zip","browser_download_url":"https://example.invalid/windows"}'
}

@test "filter_os_asset selects the macos asset" {
  local assets="$BATS_TEST_TMPDIR/assets.json"
  write_os_assets "$assets"

  run filter_os_asset "macosx_x64" "$assets"
  [ "$status" -eq 0 ]
  assert_json_eq "$output" '{"name":"macosx_x64.tar.xz","browser_download_url":"https://example.invalid/macos"}'
}

@test "filter_os_asset prints nothing when no asset matches" {
  local assets="$BATS_TEST_TMPDIR/assets.json"
  write_os_assets "$assets"

  run filter_os_asset "linux_arm64" "$assets"
  [ "$status" -eq 0 ]
  assert_eq "$output" ""
}

@test "filter_os_asset fails when the asset file is missing" {
  run filter_os_asset "linux_x64" "$BATS_TEST_TMPDIR/missing.json"
  [ "$status" -ne 0 ]
}
