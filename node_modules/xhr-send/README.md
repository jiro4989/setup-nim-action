# xhr-send

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/xhr-send)[![Build Status][build]](https://travis-ci.org/unshiftio/xhr-send)[![Dependencies][david]](https://david-dm.org/unshiftio/xhr-send)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/xhr-send?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/xhr-send.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/xhr-send/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/xhr-send.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/xhr-send/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

A cross-browser implementation for sending data over the supplied XHR
connection.

## Installation

```
npm install --save xhr-send
```

## Usage

The module requires 3 arguments:

- `xhr` The reference to your constructed `XMLHTTPRequest` instance.
- `data` The data that needs to be send.
- `fn` Completion callback that receives the error as first argument.

```js
var send = require('xhr-send');

send(xhr, 'data', function (err) {
  if (err) return console.error('failed to send because of reasons', err);

  console.log('send without any isseus.');
});
```

## License

MIT
