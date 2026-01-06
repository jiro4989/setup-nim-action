#!/bin/bash

set -eu

DATE_FORMAT="%Y-%m-%d %H:%M:%S"

fetch_tags() {
  # https://docs.github.com/ja/rest/git/refs?apiVersion=2022-11-28
  curl \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${repo_token}" \
    -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/nim-lang/nim/git/refs/tags |
    jq -r '.[].ref' |
    sed -E 's:^refs/tags/v::'
}

fetch_nightlies_releases() {
  # https://docs.github.com/en/rest/releases/releases?apiVersion=2022-11-28
  curl -sSL \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${repo_token}" \
    -H "X-GitHub-Api-Version: 2022-11-28" \
    https://api.github.com/repos/nim-lang/nightlies/releases
}

filter_latest_devel_assets() {
  jq -r '.[] | select(.tag_name | test("latest-devel")) | .assets' "$1"
}

filter_os_asset() {
  jq --arg target "$1" -r '.[] | select(.name | test($target))' "$2"
}

info() {
  echo "$(date +"$DATE_FORMAT") [INFO] $*"
}

err() {
  echo "$(date +"$DATE_FORMAT") [ERR] $*"
}

tag_regexp() {
  version=$1
  echo "$version" |
    sed -E \
      -e 's/\./\\./g' \
      -e 's/^/^/' \
      -e 's/x$//'
}

latest_version() {
  sort -V | tail -n 1
}

move_nim_compiler() {
  src_dir="$1"
  dst_dir="$2"
  if [[ -d "$dst_dir" ]]; then
    info "remove cached directory (path = $dst_dir)"
    rm -rf "$dst_dir"
  fi
  mv "$src_dir" "$dst_dir"
}

# parse commandline args
nim_version="stable"
nim_install_dir=".nim_runtime"
os="Linux"
repo_token=""
parent_nim_install_dir=""
use_nightlies="false"
while ((0 < $#)); do
  opt=$1
  shift
  case $opt in
    --nim-version)
      nim_version=$1
      ;;
    --nim-install-directory)
      nim_install_dir=$1
      ;;
    --parent-nim-install-directory)
      parent_nim_install_dir=$1
      ;;
    --os)
      os=$1
      ;;
    --repo-token)
      repo_token=$1
      ;;
    --use-nightlies)
      use_nightlies=$1
      ;;
  esac
done

if [[ "$parent_nim_install_dir" = "" ]]; then
  parent_nim_install_dir="$PWD"
fi

cd "$parent_nim_install_dir"

# build nim compiler for devel branch
if [[ "$nim_version" = "devel" ]]; then
  if [[ "$os" = Windows ]]; then
    err "'devel' version and windows runner are not supported yet"
    exit 1
  fi

  if [[ "$use_nightlies" = true ]]; then
    target="linux_x64"
    if [[ "$os" = macOS ]]; then
      target="macosx_x64"
    fi

    work_dir="/tmp/setup_nim_action_work"
    mkdir -p "$work_dir"
    pushd "$work_dir"

    fetch_nightlies_releases > releases.json
    filter_latest_devel_assets releases.json > assets.json
    filter_os_asset "$target" assets.json > os_asset.json
    asset_name="$(jq -r '.name' os_asset.json)"
    browser_download_url="$(jq -r '.browser_download_url' os_asset.json)"
    info "download nightlies build: asset_name = $asset_name, browser_download_url = $browser_download_url"
    # asset_name ex: linux_x64.tar.xz
    curl -sSL "$browser_download_url" > "$asset_name"
    mkdir -p outfiles
    tar xf "$asset_name" -C outfiles --strip-components=1
    rm -f "$asset_name"

    popd
    move_nim_compiler "${work_dir}/outfiles" "${nim_install_dir}"
    rm -rf "$work_dir"
  else
    git clone -b devel --depth 1 https://github.com/nim-lang/Nim
    cd Nim
    info "build nim compiler (devel)"
    ./build_all.sh
    cd ..
    move_nim_compiler Nim "${nim_install_dir}"
  fi

  exit
fi

# get exact version of stable
if [[ "$nim_version" = "stable" ]]; then
  nim_version=$(curl -sSL https://nim-lang.org/channels/stable)
elif [[ "$nim_version" =~ ^[0-9]+\.[0-9]+\.x$ ]] || [[ "$nim_version" =~ ^[0-9]+\.x$ ]]; then
  nim_version="$(fetch_tags | grep -E "$(tag_regexp "$nim_version")" | latest_version)"
fi

info "install nim $nim_version"

# download nim compiler
arch="x64"
if [[ "$os" = Windows ]]; then
  download_url="https://nim-lang.org/download/nim-${nim_version}_${arch}.zip"
  curl -sSL "${download_url}" > nim.zip
  unzip -q nim.zip
  rm -f nim.zip
elif [[ "$os" = macOS ]]; then
  # need to build compiler
  download_url="https://nim-lang.org/download/nim-${nim_version}.tar.xz"
  curl -sSL "${download_url}" > nim.tar.xz
  tar xf nim.tar.xz
  rm -f nim.tar.xz

  # homebrew: https://github.com/Homebrew/homebrew-core/blob/736836cf038c04e304e635ccd04dcd0bdff8f57b/Formula/n/nim.rb
  # nim: https://github.com/nim-lang/Nim/blob/devel/build_all.sh
  cd "nim-${nim_version}"

  info "build nim compiler"
  ./build.sh

  info "build koch tool"
  ./bin/nim c --noNimblePath --skipUserCfg --skipParentCfg --hints:off koch

  info "koch boot"
  ./koch boot -d:release --skipUserCfg --skipParentCfg --hints:off

  info "koch tools"
  ./koch tools --skipUserCfg --skipParentCfg --hints:off

  cd ..
elif [[ "$os" = "Linux" && "$(uname -m)" = "$arch" ]]; then
  download_url="https://nim-lang.org/download/nim-${nim_version}-linux_${arch}.tar.xz"
  curl -sSL "${download_url}" > nim.tar.xz
  tar xf nim.tar.xz
  rm -f nim.tar.xz
else
  # need to build compiler
  download_url="https://nim-lang.org/download/nim-${nim_version}.tar.xz"
  curl -sSL "${download_url}" > nim.tar.xz
  tar xf nim.tar.xz
  rm -f nim.tar.xz
  cd "nim-${nim_version}"
  info "build nim compiler (${nim_version})"
  ./build_all.sh
  cd ..
fi
move_nim_compiler "nim-${nim_version}" "${nim_install_dir}"
