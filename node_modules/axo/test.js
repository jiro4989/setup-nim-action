/* istanbul ignore next */
this.ActiveXObject = global.ActiveXObject = function foobar() {
  // Node doesn't have an ActiveXObject so introduce it as global.
};

var assert = require('assert')
  , AXO = require('./');

assert.ok('function' === typeof AXO, 'should export the ActiveXObject constructor');
assert.ok(AXO === ActiveXObject, 'it should return the ActiveXObject');
