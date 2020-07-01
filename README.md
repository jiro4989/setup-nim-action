# setup-nim-action

![Build Status](https://github.com/jiro4989/setup-nim-action/workflows/build/badge.svg)

This action sets up a Nim environment.

## Usage

See [action.yml](action.yml)

### Basic usage

```yaml
steps:
  - uses: actions/checkout@master
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.2.0'
  - run: nimble build -Y
  - run: nimble test -Y
```

### Cache usage

**Note:**  
Please should not use `Cache nimble` on `windows-latest`.
`setup-nim-action` may Failing to install on `windows-latest`.

```yaml
steps:
  - uses: actions/checkout@master
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
      - uses: actions/checkout@master
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: ${{ matrix.nim }}
      - run: nimble build
```

### `devel --latest` usage

Use `date` cache-key for speed-up if you want to use `devel --latest`.

```yaml
jobs:
  test_devel:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v1

      - name: Get Date
        id: get-date
        run: echo "::set-output name=date::$(date "+%Y-%m-%d")"
        shell: bash

      - name: Cache choosenim
        id: cache-choosenim
        uses: actions/cache@v1
        with:
          path: ~/.choosenim
          key: ${{ runner.os }}-choosenim-devel-latest-${{ steps.get-date.outputs.date }}
      - name: Cache nimble
        id: cache-nimble
        uses: actions/cache@v1
        with:
          path: ~/.nimble
          key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
      - uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: "devel --latest"

      - run: nimble build
```

### Full example

See [.github/workflows/nim.yml](.github/workflows/nim.yml).

## License

MIT
