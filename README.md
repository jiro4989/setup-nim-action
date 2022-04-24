# setup-nim-action

![Build Status](https://github.com/jiro4989/setup-nim-action/workflows/build/badge.svg)

This action sets up a Nim environment.

<!-- vim-markdown-toc GFM -->

* [Usage](#usage)
  * [Basic usage](#basic-usage)
  * [Setup a latest patch version Nim](#setup-a-latest-patch-version-nim)
  * [Setup a latest minor version Nim](#setup-a-latest-minor-version-nim)
  * [Cache usage](#cache-usage)
  * [Matrix testing usage](#matrix-testing-usage)
  * [`devel` usage](#devel-usage)
  * [Full example](#full-example)
* [License](#license)

<!-- vim-markdown-toc -->

## Usage

See [action.yml](action.yml)

### Basic usage

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.6.0' # default is 'stable'
  - run: nimble build -Y
  - run: nimble test -Y
```

### Setup a latest patch version Nim

Setup a latest patch version Nim when `nim-version` is `1.n.x` .

```yaml
steps:
  - uses: actions/checkout@v3
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.2.x' # ex: 1.0.x, 1.2.x, 1.4.x ...
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
  - run: nimble build -Y
  - run: nimble test -Y
```

### Cache usage

```yaml
steps:
  - uses: actions/checkout@v3
  - name: Cache nimble
    id: cache-nimble
    uses: actions/cache@v1
    with:
      path: ~/.nimble
      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
    if: runner.os != 'Windows'
  - uses: jiro4989/setup-nim-action@v1
  - run: nimble build -Y
  - run: nimble test -Y
```

### Matrix testing usage

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        nim: [ '1.2.0', 'stable', 'devel' ]
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@v3
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: ${{ matrix.nim }}
      - run: nimble build
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
        uses: actions/cache@v1
        with:
          path: ~/.choosenim
          key: ${{ runner.os }}-choosenim-${{ matrix.cache-key }}-${{ steps.get-date.outputs.date }}
      - name: Cache nimble
        id: cache-nimble
        uses: actions/cache@v1
        with:
          path: ~/.nimble
          key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
      - uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: "${{ matrix.nim-version }}"

      - run: nimble build
```

### Full example

See [.github/workflows/test.yml](.github/workflows/test.yml).

## License

MIT

