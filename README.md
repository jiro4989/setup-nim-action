# setup-nim-action

![Build Status](https://github.com/jiro4989/setup-nim-action/workflows/build/badge.svg)

This action sets up a Nim environment.

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
  - uses: actions/checkout@master
  - uses: jiro4989/setup-nim-action@v1
    with:
      nim-version: '1.2.0'
  - run: nimble build -Y
  - run: nimble test -Y
```

Use cache:
```yaml
steps:
  - uses: actions/checkout@master
  - name: Cache nimble
    id: cache-nimble
    uses: actions/cache@v1
    with:
      path: ~/.nimble
      key: ${{ runner.os }}-nimble-${{ hashFiles('*.nimble') }}
  - uses: jiro4989/setup-nim-action@v1
  - run: nimble build -Y
  - run: nimble test -Y
```

Matrix Testing:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        nim: [ '1.2.0', 'stable' ]
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@master
      - name: Setup nim
        uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: ${{ matrix.nim }}
      - run: nimble build
```

Use `date` cache-key if you want to use `stable` or `devel` or `devel --latest` and caching.

```yaml
jobs:
  test_devel:
    runs-on: ubuntu-latest
    env:
      nim_version: 'devel'
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
          key: ${{ runner.os }}-choosenim-${{ env.nim_version }}-${{ steps.get-date.outputs.date }}
      - name: Cache nimble
        id: cache-nimble
        uses: actions/cache@v1
        with:
          path: ~/.nimble
          key: ${{ runner.os }}-nimble-${{ env.nim_version }}-${{ hashFiles('*.nimble') }}
      - uses: jiro4989/setup-nim-action@v1
        with:
          nim-version: ${{ env.nim_version }}

      - run: nimble build
```

# License

MIT
