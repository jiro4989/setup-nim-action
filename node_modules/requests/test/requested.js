describe('Requested', function () {
  'use strict';

  var Requested = require('../requested')
    , assume = require('assume')
    , r;

  it('is exported as a function', function () {
    assume(Requested).is.a('function');
  });

  describe('#typeof', function () {
    it('knows the difference between an array and object', function () {
      var r = new Requested();

      assume(r.typeof({})).equals('object');
      assume(r.typeof([])).equals('array');
    });
  });

  describe('#merge', function () {
    before(function () {
      r = new Requested();
    });

    it('returns the merge', function () {
      var x = { foo: 'foo' }
        , y = { bar: 'bar' }
        , z = r.merge(x, y);

      assume(z).equals(x);
      assume(x.bar).equals('bar');
    });

    it('merges multiple objects', function () {
      var xyz = r.merge({}, { foo: 'foo' }, { bar: 'bar' }, { hello: 'world' });

      assume(xyz.foo).equals('foo');
      assume(xyz.bar).equals('bar');
      assume(xyz.hello).equals('world');
    });

    it('can deep merge without modification', function () {
      var x = { foo: 'foo' }
        , y = { deep: { nested: 'object' } }
        , z = { deep: { another: 'key' } }
        , xyz = r.merge(x, y, z);

      assume(x.deep).is.a('object');
      assume(x.deep).does.not.equal(y.deep);
      assume(x.deep).does.not.equal(z.deep);
      assume(x.deep.nested).equals('object');
      assume(x.deep.another).equals('key');
    });
  });
});
