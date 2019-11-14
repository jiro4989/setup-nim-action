describe('xhr-send', function () {
  'use strict';

  var send = require('./')
    , assume = require('assume');

  it('is exported as function', function () {
    assume(send).is.a('function');
  });

  it('calls the supplied callback with an error', function (next) {
    send(undefined, '', function (err) {
      assume(err).is.instanceOf(Error);
      next();
    });
  });

  it('returns false when it fails', function () {
    assume(send(undefined, '', function (err) {
      assume(err).is.instanceOf(Error);
    })).is.false();
  });

  it('calls xhr open with the supplied data', function (next) {
    next = assume.plan(2, next);
    var stub = {
      send: function (data) {
        assume(data).equals('foo');
      }
    };

    send(stub, 'foo', function (err) {
      assume(err).is.undefined();
      next();
    });
  });
});
