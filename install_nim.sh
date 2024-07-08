#!/bin/bash

set -eu

info() {
  echo "$(date) [INFO] $*"
}

err() {
  echo "$(date) [ERR] $*"
}

latest_version() {
  sort -V | tail -n 1
}

# parse commandline args
nim_version="stable"
nim_install_dir=".nim_runtime"
os="Linux"
repo_token=""
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
    --os)
      os=$1
      ;;
    --repo-token)
      repo_token=$1
      ;;
  esac
done

# get exact version of stable
if [[ "$nim_version" = "stable" ]]; then
    nim_version=$(curl -sSL https://nim-lang.org/channels/stable)
fi

# build nim compiler for devel branch
if [[ "$nim_version" = "devel" ]]; then
  if [[ "$os" = Windows ]]; then
    err "'devel' version and windows runner are not supported yet"
    exit 1
  fi

  git clone -b devel --depth 1 https://github.com/nim-lang/Nim
  cd Nim
  info "build nim compiler (devel)"
  ./build_all.sh
  cd ..
  mv Nim "${nim_install_dir}"

  exit
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
else
  download_url="https://nim-lang.org/download/nim-${nim_version}-linux_${arch}.tar.xz"
  curl -sSL "${download_url}" > nim.tar.xz
  tar xf nim.tar.xz
  rm -f nim.tar.xz
fi
mv "nim-${nim_version}" "${nim_install_dir}"
