#!/bin/bash

set -eu

DATE_FORMAT="%Y-%m-%d %H:%M:%S"

info() {
  echo "$(date +"$DATE_FORMAT") [INFO] $*"
}

err() {
  echo "$(date +"$DATE_FORMAT") [ERR] $*"
}

fetch_tags() {
  # https://docs.github.com/ja/rest/git/refs?apiVersion=2022-11-28
  curl \
    -H "Accept: application/vnd.github+json" \
    -H "Authorization: Bearer ${repo_token}" \
    -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/nim-lang/nimble/git/refs/tags |
    jq -r '.[].ref' |
    sed -E 's:^refs/tags/v::'
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

# parse commandline args
nimble_version="stable"
nimble_install_dir=".nimble_runtime"
os="Linux"
repo_token=""
parent_nimble_install_dir=""

while ((0 < $#)); do
  opt=$1
  shift
  case $opt in
    --nimble-version)
      nimble_version=$1
      shift
      ;;
    --nimble-install-directory)
      nimble_install_dir=$1
      shift
      ;;
    --parent-nimble-install-directory)
      parent_nimble_install_dir=$1
      shift
      ;;
    --os)
      os=$1
      shift
      ;;
    --repo-token)
      repo_token=$1
      shift
      ;;
  esac
done

if [[ "$parent_nimble_install_dir" = "" ]]; then
  parent_nimble_install_dir="$PWD"
fi

cd "$parent_nimble_install_dir"

# get exact version if stable
if [[ "$nimble_version" = "stable" ]]; then
  nimble_version=$(fetch_tags | latest_version)
elif [[ "$nimble_version" =~ ^[0-9]+\.[0-9]+\.x$ ]] || [[ "$nimble_version" =~ ^[0-9]+\.x$ ]]; then
  nimble_version="$(fetch_tags | grep -E "$(tag_regexp "$nimble_version")" | latest_version)"
fi

info "Installing nimble $nimble_version"

info "Current directory: $(pwd)"
info "Installing to: ${nimble_install_dir}/bin"

# Create installation directory
mkdir -p "${nimble_install_dir}/bin"

# Set architecture
arch="x64"

if [[ "$os" = "Windows" ]]; then
  download_url="https://github.com/nim-lang/nimble/releases/download/v${nimble_version}/nimble-windows_${arch}.zip"
  info "Downloading from: ${download_url}"
  curl -sSL "${download_url}" > nimble.zip
  unzip -j nimble.zip "nimble.exe" -d "${nimble_install_dir}/bin"
  rm -f nimble.zip
elif [[ "$os" = "macOS" || "$os" = "Darwin" ]]; then
  download_url="https://github.com/nim-lang/nimble/releases/download/v${nimble_version}/nimble-macosx_${arch}.tar.gz"
  info "Downloading from: ${download_url}"
  curl -sSL "${download_url}" | tar xvz -C "${nimble_install_dir}/bin"
else
  download_url="https://github.com/nim-lang/nimble/releases/download/v${nimble_version}/nimble-linux_${arch}.tar.gz"
  info "Downloading from: ${download_url}"
  curl -sSL "${download_url}" | tar xvz -C "${nimble_install_dir}/bin"
fi

info "Contents of ${nimble_install_dir}/bin:"
ls -la "${nimble_install_dir}/bin"

info "Nimble installation complete"
