# :crown:setup-nim-action

![Build Status](https://github.com/jiro4989/setup-nim-action/workflows/build/badge.svg)

This action sets up a [Nim-lang](https://nim-lang.org/):crown: environment.

<!-- vim-markdown-toc GFM -->

* [`v2` version was released :tada:](#v2-version-was-released-tada)
* [Migration to v2 from v1](#migration-to-v2-from-v1)
  * [Q&A](#qa)
    * [getAppFilename failed](#getappfilename-failed)
* [:mag_right:Usage](#mag_rightusage)
  * [Basic usage](#basic-usage)
  * [Setup a latest patch version Nim](#setup-a-latest-patch-version-nim)
  * [Setup a latest minor version Nim](#setup-a-latest-minor-version-nim)
  * [Cache usage](#cache-usage)
  * [Matrix testing usage](#matrix-testing-usage)
  * [`devel` usage](#devel-usage)
  * [Change Nim installation directory](#change-nim-installation-directory)
  * [Full example](#full-example)
* [:hammer:Development](#hammerdevelopment)
* [:page_facing_up:License](#page_facing_uplicense)

<!-- vim-markdown-toc -->

## `v2` version was released :tada:

setup-nim-action has released `v2` ( <https://github.com/jiro4989/setup-nim-action/pull/491> ).

setup-nim-action `v1` depended on `choosenim`.
One day, an issue occurred that installation became very slow with `choosenim` ( <https://github.com/jiro4989/setup-nim-action/issues/483> ).
This process took between 6 and 20 minutes.

I changed setup-nim-action so that is does not use choosenim to solve this problem.

## Migration to v2 from v1

1. Upgrade version of `setup-nim-action` to `v2` from `v1`
1. Change cache key to clear cache if you are using it.
   The key can be anything if the cache will be cleared.
   Nothing to do if you are not using `actions/cache`
1. Remove caching `choosenim` if you are using it.
   `setup-nim-action` does not use choosenim now.
   Nothing to do if you are not caching `choosenim`
1. Remove `yes` and `no-color` parameters if you are using it.
   These parameters are not used now.
   Nothing to do if you are not these parameters

```diff
 steps:
   - uses: actions/checkout@v4

   - name: Cache nimble
     id: cache-nimble
     uses: actions/cache@v4
     with:
       path: ~/.nimble
-      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
+      key: ${{ runner.os }}-nimble-v2-${{ hashFiles('*.nimble') }}
       restore-keys: |
-        ${{ runner.os }}-nimble-
+        ${{ runner.os }}-nimble-v2-
     if: runner.os != 'Windows'

-  - name: Cache choosenim
-    id: cache-choosenim
-    uses: actions/cache@v4
-    with:
-      path: ~/.choosenim
-      key: ${{ runner.os }}-choosenim-${{ matrix.cache-key }}-${{ steps.get-date.outputs.date }}
-      restore-keys: |
-        ${{ runner.os }}-choosenim-${{ matrix.cache-key }}-

-  - uses: jiro4989/setup-nim-action@v1
+  - uses: jiro4989/setup-nim-action@v2
     with:
       nim-version: '2.0.0' # default is 'stable'
+      repo-token: ${{ secrets.GITHUB_TOKEN }}
-      yes: false
-      no-color: yes
   - run: nimble build -Y
   - run: nimble test -Y
```

### Q&A

#### getAppFilename failed

Please clear cache if you get the following error.

> getAppFilename failed. (Error was: Unable to read /home/runner/.choosenim/current. (Error was: No installation has been chosen. (File missing: /home/runner/.choosenim/current)))

Cache is cleared if you change cache key.

```diff
     uses: actions/cache@v4
     with:
       path: ~/.nimble
-      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
+      key: ${{ runner.os }}-nimble-v2-${{ hashFiles('*.nimble') }}
       restore-keys: |
-        ${{ runner.os }}-nimble-
+        ${{ runner.os }}-nimble-v2-
     if: runner.os != 'Windows'
```

Or please remove actions/cache.

```diff
-    uses: actions/cache@v4
-    with:
-      path: ~/.nimble
-      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
-      restore-keys: |
-        ${{ runner.os }}-nimble-
-    if: runner.os != 'Windows'
```

## :mag_right:Usage

See [action.yml](action.yml)

### Basic usage

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: jiro4989/setup-nim-action@v2
    with:
      nim-version: '2.0.0' # default is 'stable'
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

`repo-token` is using for [Rate limiting](https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting).
It works without setting this parameter, but please set it if the following error message is returned.

> Error: 403 - {"message":"API rate limit exceeded for nn.nn.nn.nnn. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)","documentation_url":"<https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"}>

### Setup a latest patch version Nim

Setup a latest patch version Nim when `nim-version` is `2.n.x` .

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: jiro4989/setup-nim-action@v2
    with:
      nim-version: '2.0.x' # ex: 1.0.x, 1.2.x, 1.4.x, 2.0.x ...
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

### Setup a latest minor version Nim

Setup a latest minor version Nim when `nim-version` is `2.x` .

```yaml
steps:
  - uses: actions/checkout@v4
  - uses: jiro4989/setup-nim-action@v2
    with:
      nim-version: '2.x'
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

### Cache usage

```yaml
steps:
  - uses: actions/checkout@v4
  - name: Cache nimble
    id: cache-nimble
    uses: actions/cache@v4
    with:
      path: ~/.nimble
      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
      restore-keys: |
        ${{ runner.os }}-nimble-
    if: runner.os != 'Windows'
  - uses: jiro4989/setup-nim-action@v2
    with:
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

### Matrix testing usage

If you want to support multiple Nim versions or multiple platforms, `strategy.matrix` is useful.

e.g. Tests multiple Nim versions:

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        nim:
          - '1.2.0'
          - '1.2.x'
          - '1.4.x'
          - '1.6.x'
          - '2.0.x'
          - 'stable'
          - 'devel'
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@v4
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v2
        with:
          nim-version: ${{ matrix.nim }}
          repo-token: ${{ secrets.GITHUB_TOKEN }}
      - run: nimble build -Y
      - run: nimble test -Y
```

e.g. Tests multiple platforms:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        os:
          - ubuntu-latest
          - windows-latest
          - macOS-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v2
        with:
          repo-token: ${{ secrets.GITHUB_TOKEN }}
      - run: nimble build -Y
      - run: nimble test -Y
```

e.g. Tests multiple Nim versions and platforms:

:warning: **WARN** :warning: Depending on matrix count, the number of test jobs may be very large.
It is recommend to keep the small matrix count.

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}
    strategy:
      matrix:
        nim:
          - '1.4.x'
          - '1.6.x'
          - '2.0.x'
          - 'stable'
        os:
          - ubuntu-latest
          - windows-latest
          - macOS-latest
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@v4
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v2
        with:
          nim-version: ${{ matrix.nim }}
          repo-token: ${{ secrets.GITHUB_TOKEN }}
      - run: nimble build -Y
      - run: nimble test -Y
```

### `devel` usage

Use `devel` version if you want to use devel compiler of Nim.
setup-nim-action will fetch the devel source code and build the nim compiler every time.

```yaml
jobs:
  test_devel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Cache nimble
        id: cache-nimble
        uses: actions/cache@v4
        with:
          path: ~/.nimble
          key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
          restore-keys: |
            ${{ runner.os }}-nimble-

      - uses: jiro4989/setup-nim-action@v2
        with:
          nim-version: devel
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - run: nimble build -Y
```

But building the devel compiler takes a long time.
If you don't want to build it every time, set `use-nightlies` to `true`.

```yaml
jobs:
  test_devel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Cache nimble
        id: cache-nimble
        uses: actions/cache@v4
        with:
          path: ~/.nimble
          key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
          restore-keys: |
            ${{ runner.os }}-nimble-

      - uses: jiro4989/setup-nim-action@v2
        with:
          nim-version: devel
          use-nightlies: true
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - run: nimble build -Y
```

### Change Nim installation directory

`setup-nim-action` installs Nim to `.nim_runtime` directory of current directory.
You can use `parent-nim-install-directory` and `nim-install-directory` parameters if you want to change it.

Use `parent-nim-install-directory` if you want to install nim to temporary directory.
This example installs nim to `/home/runner/work/_temp/.nim_runtime`.

```yaml
  - uses: jiro4989/setup-nim-action@v2
    with:
      nim-version: stable
      repo-token: ${{ secrets.GITHUB_TOKEN }}
      parent-nim-install-directory: ${{ runner.temp }}
```

Use `nim-install-directory` if you want to change base directory name.
This example installs nim to `$PWD/nim_compiler`.

```yaml
  - uses: jiro4989/setup-nim-action@v2
    with:
      nim-version: stable
      repo-token: ${{ secrets.GITHUB_TOKEN }}
      nim-install-directory: nim_compiler
```

### Full example

See [.github/workflows/test.yml](.github/workflows/test.yml).

## :hammer:Development

This project uses shell script only.
Run `script/format.sh` when you edited source code.

```bash
vim install_nim.sh
./script/format.sh
```

## :page_facing_up:License

MIT

