# :crown:setup-nim-action

![Build Status](https://github.com/jiro4989/setup-nim-action/workflows/build/badge.svg)

This action sets up a [Nim-lang](https://nim-lang.org/):crown: environment.

<!-- vim-markdown-toc GFM -->

* [Usage](#mag_rightusage)
  * [Basic usage](#basic-usage)
  * [Setup a latest patch version Nim](#setup-a-latest-patch-version-nim)
  * [Setup a latest minor version Nim](#setup-a-latest-minor-version-nim)
  * [Cache usage](#cache-usage)
  * [Matrix testing usage](#matrix-testing-usage)
  * [`devel` usage](#devel-usage)
  * [Full example](#full-example)
* [Development](#hammerdevelopment)
* [License](#page_facing_uplicense)

<!-- vim-markdown-toc -->

## :mag_right:Usage

See [action.yml](action.yml)

### Basic usage

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.6.0' # default is 'stable'
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

`repo-token` is using for [Rate limiting](https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting).
It works without setting this parameter, but please set it if the following error message is returned.

> Error: 403 - {"message":"API rate limit exceeded for nn.nn.nn.nnn. (But here's the good news: Authenticated requests get a higher rate limit. Check out the documentation for more details.)","documentation_url":"https://docs.github.com/rest/overview/resources-in-the-rest-api#rate-limiting"}

### Setup a latest patch version Nim

Setup a latest patch version Nim when `nim-version` is `1.n.x` .

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.2.x' # ex: 1.0.x, 1.2.x, 1.4.x ...
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

### Setup a latest minor version Nim

Setup a latest minor version Nim when `nim-version` is `1.x` .

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.x'
      repo-token: ${{ secrets.GITHUB_TOKEN }}
  - run: nimble build -Y
  - run: nimble test -Y
```

### Cache usage

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Cache nimble
    id: cache-nimble
    uses: actions/cache@v3
    with:
      path: ~/.nimble
      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
      restore-keys: |
        ${{ runner.os }}-nimble-
    if: runner.os != 'Windows'
  - uses: jiro4989/setup-nim-action@v1
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
          - 'stable'
          - 'devel'
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@v3
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v1
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
      - uses: actions/checkout@v3
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v1
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
          - 'stable'
        os:
          - ubuntu-latest
          - windows-latest
          - macOS-latest
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@v3
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: ${{ matrix.nim }}
          repo-token: ${{ secrets.GITHUB_TOKEN }}
      - run: nimble build -Y
      - run: nimble test -Y
```

### `devel` usage

Use `date` cache-key for speed-up if you want to use `devel`.
See [cache documents](https://github.com/actions/cache) for more information and how to use the cache.

```yaml
jobs:
  test_devel:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        include:
          - nim-version: 'devel'
            cache-key: 'devel'
    steps:
      - uses: actions/checkout@v3

      - name: Get Date
        id: get-date
        run: echo "::set-output name=date::$(date "+%Y-%m-%d")"
        shell: bash

      - name: Cache choosenim
        id: cache-choosenim
        uses: actions/cache@v3
        with:
          path: ~/.choosenim
          key: ${{ runner.os }}-choosenim-${{ matrix.cache-key }}-${{ steps.get-date.outputs.date }}
          restore-keys: |
            ${{ runner.os }}-choosenim-${{ matrix.cache-key }}-
      - name: Cache nimble
        id: cache-nimble
        uses: actions/cache@v3
        with:
          path: ~/.nimble
          key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
          restore-keys: |
            ${{ runner.os }}-nimble-
      - uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: "${{ matrix.nim-version }}"
          repo-token: ${{ secrets.GITHUB_TOKEN }}

      - run: nimble build
```

### Full example

See [.github/workflows/test.yml](.github/workflows/test.yml).

## :hammer:Development

This project uses [TypeScript](https://www.typescriptlang.org/).
Place TypeScript codes under the `src` directory.
Run `npm run build` when you edited source code.

```bash
$ vim src/installer.ts
$ npm run build
```

`npm run build` command will output a JavaScript file under the `lib` directory. Please commit this.

And please add [test code](https://github.com/jiro4989/setup-nim-action/tree/master/tests) if possible.

## :page_facing_up:License

MIT
