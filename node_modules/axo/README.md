# AXO

[![Made by unshift](https://img.shields.io/badge/made%20by-unshift-00ffcc.svg?style=flat-square)](http://unshift.io)[![Version npm](http://img.shields.io/npm/v/axo.svg?style=flat-square)](http://browsenpm.org/package/axo)[![Build Status](http://img.shields.io/travis/unshiftio/axo/master.svg?style=flat-square)](https://travis-ci.org/unshiftio/axo)[![Dependencies](https://img.shields.io/david/unshiftio/axo.svg?style=flat-square)](https://david-dm.org/unshiftio/axo)[![Coverage Status](http://img.shields.io/coveralls/unshiftio/axo/master.svg?style=flat-square)](https://coveralls.io/r/unshiftio/axo?branch=master)[![IRC channel](http://img.shields.io/badge/IRC-irc.freenode.net%23unshift-00a8ff.svg?style=flat-square)](http://webchat.freenode.net/?channels=unshift)

AXO stands for **A**ctive**XO**bject. And the sole purpose of this library is to
return the `ActiveXObject` constructor from the environment it's loaded in.
Normally you would just reference the constructor directly by simply mentioning
this constructor in your source file can [result in blocking of your
file](https://github.com/felixge/node-active-x-obfuscator#why).

There are 2 ways of tackling this issue:

1. Use the [active-x-obfuscator](https://github.com/felixge/node-active-x-obfuscator)
   and introduce another build step in your code.
2. Use `AXO` and never mention it.

## Installation

```
npm install --save axo
```

This module makes the assumption that it can be loaded in node.js/commonjs based
environment and exports it self on the `module.exports`. So using browserify for
the code makes a lot of sense here.

## Usage

```js
var AXO = require('axo');

new AXO('htmlfile');
```

## License

MIT
