describe('failure', function () {
  'use strict';

  var assume = require('assume')
    , failure = require('./');

  it('returns an Error instance with supplied str as message', function () {
    var err = failure('what');

    assume(err).is.instanceOf(Error);
    assume(err.message).equals('what');
  });

  it('does not merge over existing properties', function () {
    var err = failure(new Error('what'), { foo: 'bar', message: 'hi' });

    assume(err.message).equals('what');
    assume(err.foo).equals('bar');
  });

  it('defaults to unspecified error', function () {
    assume(failure().message).includes('error');
  });

  it('accepts Object.create(null)', function () {
    var obj = Object.create(null)
      , err;

    obj.foo = 'bar';
    obj.message = 'hi';

    err = failure(new Error('what'), obj);

    assume(err.message).equals('what');
    assume(err.foo).equals('bar');
  });

  describe('#toJSON', function () {
    it('adds the `toJSON` function', function () {
      assume(failure().toJSON).is.a('function');
    });

    it('returns the stack and message', function () {
      var err = failure('hi').toJSON();

      assume(err).is.a('object');
      assume(err.message).equals('hi');
      assume(err.stack).is.a('string');
    });

    it('includes non standard values if defined on the error', function () {
      var err = failure('hi', { statusCode: 200, what: 'why' })
        , res = err.toJSON();

      assume(err.what).equals('why');
      assume(res.what).is.equals('why');
      assume(res.statusCode).equals(200);
      assume(err.statusCode).equals(200);
    });

    it('includes properties that were previously specified on a given error', function () {
      var err = new Error('fools')
        , res;

      err.warning = true;
      res = failure(err, { what: 'lol' }).toJSON();

      assume(res.what).equals('lol');
      assume(res.warning).equals(true);
      assume(res.message).equals('fools');
    });

    it('does not override existing toJSON functions', function () {
      var err = new Error('lol');

      err.toJSON = function () {
        return 'run, fools!';
      };

      assume(failure(err).toJSON()).equals('run, fools!');
    });
  });
});
