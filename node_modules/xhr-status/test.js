describe('xhr-status', function () {
  'use strict';

  var assume = require('assume')
    , status = require('./');

  it('is exported as function', function () {
    assume(status).is.a('function');
  });

  it('corrects the 1233 status code', function () {
    var xhr = {
      status: 1233,
      responseText: 'moo',
      responseURL: 'http://google.com/204'
    };

    assume(status(xhr).code).equals(204);
    assume(status(xhr).error).equals(false);
    assume(status(xhr).text).equals('OK');
  });

  it('corrects status code 0 to 200 for local files', function () {
    var xhr = {
      status: 0,
      responseText: 'moo',
      responseURL: 'file://google/com/204'
    };

    assume(status(xhr).code).equals(200);
    assume(status(xhr).error).equals(false);
    assume(status(xhr).text).equals('OK');
  });

  it('keep status 0 for non local requests', function () {
    var xhr = {
      status: 0,
      responseText: 'moo',
      responseURL: 'http://google.com/204'
    };

    assume(status(xhr).code).equals(0);
    assume(status(xhr).error).equals(true);
    assume(status(xhr).text).equals('An unknown error occured');
  });

  it('uses a blank statusText if it throws (firefox edgecase)', function () {
    var xhr = {
      status: 404,
      responseURL: 'http://google.com/204'
    };

    Object.defineProperty(xhr, 'statusText', {
      get: function () {
        throw new Error('lol cakes');
      }
    });

    assume(status(xhr).error).equals(true);
    assume(status(xhr).code).equals(404);
    assume(status(xhr).text).equals('');
  });
});
