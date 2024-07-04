#!/bin/bash

set -eu

fetch_tags() {
  # https://docs.github.com/ja/rest/git/refs?apiVersion=2022-11-28
  curl \
    -H "Accept: application/vnd.github+json" \
    -H "X-GitHub-Api-Version: 2022-11-28" https://api.github.com/repos/nim-lang/nim/git/refs/tags
}

output_dir=".nim_runtime"
# nim_version="2.0.8"
nim_version="$(fetch_tags | jq -r '.[].ref' | sort -V | tail -n 1 | sed -E 's:^refs/tags/v::')"
os="linux"
arch="x64"
download_url="https://nim-lang.org/download/nim-${nim_version}-${os}_${arch}.tar.xz"

mkdir -p "${output_dir}"
cd "${output_dir}"
curl -sSL "${download_url}" > nim.tar.xz
tar xf nim.tar.xz --strip-components 1
cd ..
