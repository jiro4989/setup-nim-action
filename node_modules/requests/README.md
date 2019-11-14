# requests

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/requests)[![Build Status][build]](https://travis-ci.org/unshiftio/requests)[![Dependencies][david]](https://david-dm.org/unshiftio/requests)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/requests?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/requests.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/requests/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/requests.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/requests/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

Requests is a small library that implements fully and true streaming XHR for
browsers that support these methods. It uses a variety of proprietary
`responseType` properties to force a streaming connection, even for binary data.
For browsers that don't support this we will simply fallback to a regular but
**async** XHR 1/2 request or ActiveXObject in even older deprecated browsers.

- Internet Explorer >= 10: `ms-stream`
- FireFox >= 9: `moz-chunked`
- FireFox < 20: `multipart`

This module comes with build-in protection against ActiveX blocking that is
frequently used in firewalls & virus scanners.

## Installation

The module is released in the public npm registry and can be installed using:

```
npm install --save requests
```

## Usage

The API is a mix between the Fetch API, mixed with EventEmitter API for the
event handling.

```js
'use strict';

var requests = require('requests');
```

Now that we've included the library we can start making requests. The exported
method accepts 2 arguments:

- **url** Required URL that you want to have requested.
- **options** Optional object with additional configuration options:
  - **streaming** Should we use streaming API's to fetch the data, defaults to
  `false`.
  - **method** The HTTP method that should be used to get the contents, defaults
  to `GET`.
  - **mode** The request mode, defaults to `cors`
  - **headers** Object with header name/value that we need to send to the server.
  - **timeout** The timeout in ms before we should abort the request.
  - **manual** Manually `open` the request, defaults to `false`.

```js
requests('https://google.com/foo/bar', { streaming })
.on('data', function (chunk) {
  console.log(chunk)
})
.on('end', function (err) {
  if (err) return console.log('connection closed due to errors', err);

  console.log('end');
});
```

## Events

In the example above you can see the that we're listing to various of events.
The following events are emitted:

- `data` A new chunk of data has been received. It can be a small chunk but also
  the full response depending on the environment it's loaded in.
- `destroy` The request instance has been fully destroyed.
- `error` An error occurred while requesting the given URL.
- `end` Done with requesting the URL. An error argument can be supplied if the
  connection was closed due to an error.
- `before` Emitted before we send the actual request.
- `send` Emitted after we've succesfully started the sending of the data.

### requests#destroy

Destroy the running XHR request and release all the references that the
`requests` instance holds. It returns a boolean as indication of a successful
destruction.

```js
requests.destroy();
```

### Requests.requested

The total amount of requests that we've made in this library. It also serves as
unique id for each request that we store in `.active`.

### Requests.active

An object that contains all running and active requests. Namespaced under
`request.requested` id and the requests instance.

## License

MIT
