describe('hang', function () {
  'use strict';

  var hang = require('./')
    , assume = require('assume');

  it('is exported as a function', function () {
    assume(hang).is.a('function');
  });

  it('returns a function with the same name as the provided fn', function () {
    var what = hang(function what() {});

    assume(what.displayName).equals('what');
  });

  it('calls the supplied callback', function (next) {
    var h = hang(next);

    assume(h).does.not.equals(next);
    h();
  });

  it('instantly calls the supplied function if called async', function (next) {
    setImmediate(hang(next));
  });

  it('proxies the arguments and this value', function (next) {
    var fn = hang(function (a, b, c) {
      assume(a).equals('a');
      assume(b).equals('b');
      assume(c).equals('c');

      assume(this).equals('foo');
      next();
    });

    fn.apply('foo', ['a', 'b', 'c']);
  });
});
