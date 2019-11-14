describe('requests', function () {
  'use strict';

  //
  // Include the Base class that we inherit from to ensure that it's also
  // included in the test run as it should run on both browsers and node.js
  //
  require('./requested');

  var Requested = require('../requested')
    , requests = require('..')
    , assume = require('assume')
    , req;

  beforeEach(function () {
    req = requests(unique('http://localhost:8080'), { manual: true });
  });

  afterEach(function () {
    req.destroy();
  });

  /**
   * Make a URL unique so we can bust the browser cache which could affect
   *
   * @param {String} url Transform to an URL.
   * @returns {String}
   * @api private
   */
  function unique(url) {
    return url + '?t='+ (+ new Date());
  }

  it('is exported as function', function () {
    assume(requests).is.a('function');
  });

  it('increments the internal `.id` for each instance', function () {
    var id = req.id;

    assume(id).equals(Requested.requested);

    req.destroy();
    req = requests(unique('http://localhost:8080'), { manual: true });

    assume(req.id).is.above(id);
    assume(Requested.requested).is.above(id);
  });

  it('sets the stream\'s booleans', function () {
    assume(req.readable).is.true();
    assume(req.writable).is.false();
  });

  it('stores active requests', function () {
    assume(requests.active[req.id]).equals(req);
  });

  it('does not receive content for 204 requests', function (done) {
    req.destroy();
    req = requests(unique('http://localhost:8080/204'));

    req.on('data', function () {
      throw new Error('I should never be called');
    });

    req.on('end', done);
  });

  it('can handle large files with streaming', function (done) {
    this.timeout(3E4);

    req = requests(unique('http://localhost:8080/unshiftio/requests/master/test/large.js'), {
      streaming: true
    });

    var buffer = [];

    req.on('data', function received(chunk) {
      buffer.push(chunk);
    });

    req.on('error', done);

    req.once('end', function end(err, status) {
      assume(buffer.length).to.be.above(1);
      assume(buffer.join('').length).equals(2127897);
      assume(status.code).to.equal(200);
      assume(status.text).to.equal('OK');

      buffer = null;
      done();
    });
  });

  describe('#destroy', function () {
    it('removes the .active instance', function () {
      assume(requests.active[req.id]).equals(req);
      req.destroy();
      assume(requests.active[req.id]).is.undefined();
    });
  });
});
