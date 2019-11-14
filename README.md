# setup-nim-actions

This action sets up a Nim environment.

# Usage

See [action.yml](action.yml)

Basic:
```yaml
steps:
- uses: actions/checkout@master
- uses: jiro4989/setup-nim-actions@v1
  with:
    nim-version: '1.0.2'
- run: nimble build
```

Matrix Testing:
```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    strategy:
      matrix:
        nim: [ '1.0.2', 'stable' ]
    name: Nim ${{ matrix.nim }} sample
    steps:
      - uses: actions/checkout@master
      - name: Setup nim
        uses: jiro4989/setup-nim-actions@v1
        with:
          nim-version: ${{ matrix.nim }}
      - run: nimble build
```

# License

MIT
