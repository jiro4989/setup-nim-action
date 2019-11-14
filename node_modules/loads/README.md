# loads

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/loads)[![Build Status][build]](https://travis-ci.org/unshiftio/loads)[![Dependencies][david]](https://david-dm.org/unshiftio/loads)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/loads?branch=master)[![IRC channel][irc]](https://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/loads.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/loads/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/loads.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/loads/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

Loads is a small helper library which automatically assigns and listens to the
various of XHR event hooks and emits the corrected and normalized responses over
a supplied EventEmitter instance.

## Installation

This module was primary developed with browsers in mind and is released in the
public npm registry. It can be installed by running:

```
npm install --save loads
```

## Usage

```js
var loads = require('loads')
  , xhr = new XMLHTTPRequest()
  , EventEmitter = require('events').EventEmitter;

var ee = new EventEmitter();
loads(xhr, ee);

ee.on('stream', function (data) {
  // data chunk received.
});

ee.on('end', function () {});

xhr.open(url);
xhr.send();
```

## License

[MIT](LICENSE)
