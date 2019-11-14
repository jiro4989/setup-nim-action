# hang

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/hang)[![Build Status][build]](https://travis-ci.org/unshiftio/hang)[![Dependencies][david]](https://david-dm.org/unshiftio/hang)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/hang?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/hang.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/hang/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/hang.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/hang/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

`hang` is micro helper function that will guarantee that your callbacks are
called async. The returned function can be called in sync or completely async.
When it's called in `sync` we will "hang" execution in a `setImmidiate` or
`setTimeout(0)` to ensure that it's called in async.

## Installation

The module is released in the public npm registry and can be installed by
running:

```
npm install --save hang
```

## Usage

Require the module and supply it the function that should be called in
completely async:

```js
'use strict';

var hang = require('hang');

var fn = hang(function (foo) {
  console.log(this, foo); // foo, bar
});

fn.call('foo', 'bar')

//
// Or call it "async"
//
setTimeout(function () {
  fn.call('foo', 'bar')
}, 10);
```

## License

MIT
