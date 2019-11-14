# `node-http-xhr`

[![npm][npm-status]][npm]

[![Build Status][build-status]][travis]

An implementation of [`XMLHttpRequest`][mdn-xhr] for [`node.js`][nodejs] using
the [`http.request`][nodejs-http] API.

[npm-status]:https://nodei.co/npm/node-http-xhr.png
[npm]:https://www.npmjs.com/package/node-http-xhr
[build-status]: https://travis-ci.org/aspyrx/node-http-xhr.svg?branch=master
[travis]: https://travis-ci.org/aspyrx/node-http-xhr
[mdn-xhr]: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
[nodejs]: https://nodejs.org
[nodejs-http]: https://nodejs.org/dist/latest/docs/api/http.html

## Motivation

This package was written to provide the `XMLHttpRequest` API to test browser
code that is being tested in a `node.js` environment.

## Installation

```sh
npm install --save node-http-xhr
```

## Usage

```javascript
// Standalone usage
var XMLHttpRequest = require('node-http-xhr');

// Usage as global XHR constructor
global.XMLHttpRequest = require('node-http-xhr');


var req = new XMLHttpRequest();

// Event handlers via .on${event} properties:
req.onreadystatechange = function() {
  console.log('readyState: ' + req.readyState);
};

// or using .addEventListener(event, handler):
req.addEventListener('load', function() {
  console.log('response: ' + req.response);
});

req.open('GET', 'https://github.com/aspyrx', true);
req.send();
```

### Note about browser environments

If you use a bundler like `browserify` or `webpack` that follows the `browser`
field in `package.json`, the module will simply export `window.XMLHttpRequest`.
This is provided for sake of compatibility.

## Development

### Documentation

To generate documentation:

```sh
npm run doc
```

The `html` documentation will be placed in `doc/`.

### Tests

```sh
npm test
```

### Known issues

Currently, some features are lacking:
- Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
- `responseType` values other than `''` or `'text'` and corresponding parsing
  - As a result of the above, `overrideMimeType()` isn't very useful
- `setRequestHeader()` doesn't check for forbidden headers.
- `withCredentials` is defined as an instance property, but doesn't do anything
  since there's no use case for CORS-like requests in `node.js` right now.

