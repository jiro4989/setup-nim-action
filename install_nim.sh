#!/bin/bash

set -eu

fetch_tags() {
  # https://docs.github.com/ja/rest/git/refs?apiVersion=2022-11-28
  curl \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/nim-lang/nim/git/refs/tags
}

# parse commandline args
nim_version="stable"
nim_install_dir=".nim_runtime"
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
    # --repo-token)
    #   repo_token=$1
    #   ;;
  esac
done

# fetch latest tag if 'nim_version' was 'stable'
if [[ "$nim_version" = "stable" ]]; then
  # NOTE: jq is pre-installed on github actions runner
  nim_version="$(fetch_tags | jq -r '.[].ref' | sort -V | tail -n 1 | sed -E 's:^refs/tags/v::')"
fi

os="linux"
arch="x64"
download_url="https://nim-lang.org/download/nim-${nim_version}-${os}_${arch}.tar.xz"

mkdir -p "${nim_install_dir}"
cd "${nim_install_dir}"
curl -sSL "${download_url}" > nim.tar.xz
tar xf nim.tar.xz --strip-components 1
cd ..
