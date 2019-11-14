# xhr-status

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/xhr-status)[![Build Status][build]](https://travis-ci.org/unshiftio/xhr-status)[![Dependencies][david]](https://david-dm.org/unshiftio/xhr-status)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/xhr-status?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/xhr-status.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/xhr-status/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/xhr-status.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/xhr-status/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

Normalize the XHR status codes across various of environments. This eliminates
all the odd browser bugs that you might run in to while working with XHR
requests in browsers:

- Captures thrown errors when accessing `statusText`
- Normalizes the `1233` status code in Internet Explorer for `204` content.
- Normalizes the `0` status code to `200` for `file://` requests.

## Installation

The module is released in the public npm registry and can be installed by
running:

```
npm install --save xhr-status
```

## Usage

This module exports a single function. The returned function accepts one single
argument which is a reference to the `xhr` instance that you've created. It will
return an object with the following keys:

- **code** The XHR status code.
- **text** The XHR status text.

See for an implementation example:

```js
'use strict';

var xhrstatus = require('xhr-status')
  , xhr = new XMLHTTPRequest.

xhr.open('GET', 'http://google.com/gen_204', true);
xhr.onload = function () {
  var status = xhrstatus(xhr);

  console.log(status.code) // 204
  console.log(status.text) // OK
};

xhr.send();
```

## License

MIT
