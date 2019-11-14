'use strict';

var path = require('path');
var fs = require('fs');
var assume = require('assume');
var requests = require('../');
var staticserver = require('./static');

/**
 * Make a URL unique so we can bust the browser cache which could affect
 *
 * @param {String} url Transform to an URL.
 * @returns {String} A unique URL.
 * @api private
 */
function unique(url) {
  return url + '?t=' + (+new Date());
}

describe('requests', function () {
  var closeServer;
  var req;

  before(function (done) {
    //
    // Start-up a small static file server so we can download files and fixtures
    // inside our tests.
    //
    staticserver(function (close) {
      closeServer = close;
    }, done);
  });

  after(function (done) {
    closeServer(done);
  });

  beforeEach(function () {
    req = requests(unique('http://localhost:8080/index.html'), { manual: true });
  });

  afterEach(function () {
    req.destroy();
  });

  it('is exported as function', function () {
    assume(requests).is.a('function');
  });

  it('sets the stream\'s booleans', function () {
    assume(req.readable).is.true();
    assume(req.writable).is.false();
  });

  it('stores active requests', function () {
    assume(requests.active[req.id]).equals(req);
  });

  it('successfully makes a request', function (done) {
    var resp = '';
    req.on('data', function (data) {
      resp += data;
    });

    req.on('end', function () {
      fs.readFile(
        path.resolve(__dirname, 'index.html'),
        { encoding: 'utf8' },
        function (err, file) {
          if (err) {
            throw err;
          }

          assume(resp).equals(file);
          done();
        }
      );
    });
    req.open();
  });

  it('does not receive content for 204 requests', function (done) {
    req.destroy();
    req = requests(unique('http://localhost:8080/204'));

    req.on('data', function () {
      throw new Error('I should never be called');
    });

    req.on('end', done);
  });

  describe('#destroy', function () {
    it('removes the .active instance', function () {
      assume(requests.active[req.id]).equals(req);
      req.destroy();
      assume(requests.active[req.id]).is.undefined();
    });
  });
});
