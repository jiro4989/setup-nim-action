# xhr-response

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/xhr-response)[![Build Status][build]](https://travis-ci.org/unshiftio/xhr-response)[![Dependencies][david]](https://david-dm.org/unshiftio/xhr-response)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/xhr-response?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/xhr-response.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/xhr-response/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/xhr-response.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/xhr-response/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

The `xhr-response` is a small helper library for safely extracting response data
from XHR requests. There are some minor bugs in browsers which can cause
exceptions to be thrown when accessing the wrong properties of an XHR request
instance. This module works around these bugs. 

## Installation

This module is primary written for client-side code which use the commonjs
module pattern for exporting.

```
npm install --save xhr-response
```

## Usage

It's just as simple as:

```js
var response = require("xhr-response");

var xhr = new XMLHTTPRequest();
// .. stuffs ..

xhr.onload = function () {
  var data = response(xhr);

  console.log('data', data);
};
```

## License

MIT
