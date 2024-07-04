#!/bin/bash

set -eu

output_dir=".nim_runtime"
nim_version="2.0.8"
os="linux"
arch="x64"
download_url="https://nim-lang.org/download/nim-${nim_version}-${os}_${arch}.tar.xz"

mkdir -p "${output_dir}"
cd "${output_dir}"
curl -sSL "${download_url}" > nim.tar.xz
tar xf nim.tar.xz --strip-components 1
export PATH=${PATH}:${PWD}/bin
cd ..

nim --version
nimble --version
