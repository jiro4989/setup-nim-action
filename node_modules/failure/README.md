# failure

[![Made by unshift][made-by]](http://unshift.io)[![Version npm][version]](http://browsenpm.org/package/failure)[![Build Status][build]](https://travis-ci.org/unshiftio/failure)[![Dependencies][david]](https://david-dm.org/unshiftio/failure)[![Coverage Status][cover]](https://coveralls.io/r/unshiftio/failure?branch=master)[![IRC channel][irc]](http://webchat.freenode.net/?channels=unshift)

[made-by]: https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square
[version]: https://img.shields.io/npm/v/failure.svg?style=flat-square
[build]: https://img.shields.io/travis/unshiftio/failure/master.svg?style=flat-square
[david]: https://img.shields.io/david/unshiftio/failure.svg?style=flat-square
[cover]: https://img.shields.io/coveralls/unshiftio/failure/master.svg?style=flat-square
[irc]: https://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square

Failure is a small helper library which allows you to easily generate custom
error objects which can hold addition properties which could be helpful for
debugging your application. In addition to that, it automatically adds a missing
`toJSON` function to the Error object so you can actually get the message and
stack trace once you `JSON.stringify` the error instance.

## Installation

The module is written with browsers and servers in mind and should run in any
environment that runs ES3. The module it self is released in the public npm
registry and can be installed using:

```
npm install --save failure
```

The `--save` flag tells npm to automatically add the installed version to your
`package.json` file as new dependency.

## Usage

First of all, start with including this module in your code:

```js
'use strict';

var failure = require('failure');
```

Now every time you want to pass or create a `new Error` instance, you can use
the `failure` function to generate the error for you. The failure method accepts
2 arguments:

1. An `Error` instance that just needs extra props, or a `string` that should be
   transformed to an `Error`. Please do note that when using a string you will
   have an extra trace in your stack trace as the stack trace will be made inside
   the `failure` function instead of where you called the `failure` function.
2. An object with extra properties that should be introduced on the supplied or
   generated `Error` instance. These properties will not override existing
   properties on the `Error` instance.

Before the function returns the generated `Error` instance it checks if it also
needs to add the missing `.toJSON` method.

Below is a small usage example on how you could use this to provide extra
information when things start failing when you make an HTTP request somewhere.
If request something with an incorrect status code, you might want to know what
statusCode was received, so we can easily add that to the Error object. Same as
parse errors for JSON, you probably want to know what you received and failed.

```js
request('https://googlllll.com', function (err, res, body) {
  if (err) return next(err);
  if (res.statusCode !== 200) return next(failure('Invalid statusCode'), {
    statusCode: res.statusCode
  });

  try { body = JSON.parse(body); }
  catch (e) {
    return next(failure(e, { 
      body: body 
    }));
  }

  next(undefined, body);
})
```

## License

MIT
