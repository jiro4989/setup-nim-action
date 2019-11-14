'use strict';

var response = require('xhr-response')
  , statuscode = require('xhr-status')
  , one = require('one-time')
  , fail = require('failure');

/**
 * Simple nope function that assigned to XHR requests as part of a clean-up
 * operation.
 *
 * @api private
 */
function nope() {}

/**
 * Attach various of event listeners to a given XHR request.
 *
 * @param {XHR} xhr A XHR request that requires listening.
 * @param {EventEmitter} ee EventEmitter that receives events.
 * @api public
 */
function loads(xhr, ee) {
  var onreadystatechange
    , onprogress
    , ontimeout
    , onabort
    , onerror
    , onload
    , timer;

  /**
   * Error listener.
   *
   * @param {Event} evt Triggered error event.
   * @api private
   */
  onerror = xhr.onerror = one(function onerror(evt) {
    var status = statuscode(xhr)
      , err = fail(new Error('Network request failed'), status);

    ee.emit('error', err);
    ee.emit('end', err, status);
  });

  /**
   * Fix for FireFox's odd abort handling behaviour. When you press ESC on an
   * active request it triggers `error` instead of abort. The same is called
   * when an HTTP request is canceled onunload.
   *
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=768596
   * @see https://bugzilla.mozilla.org/show_bug.cgi?id=880200
   * @see https://code.google.com/p/chromium/issues/detail?id=153570
   * @param {Event} evt Triggerd abort event
   * @api private
   */
  onabort = xhr.onabort = function onabort(evt) {
    onerror(evt);
  };

  /**
   * ReadyStateChange listener.
   *
   * @param {Event} evt Triggered readyState change event.
   * @api private
   */
  onreadystatechange = xhr.onreadystatechange = function change(evt) {
    var target = evt.target;

    if (4 === target.readyState) return onload(evt);
  };

  /**
   * The connection has timed out.
   *
   * @api private
   */
  ontimeout = xhr.ontimeout = one(function timeout(evt) {
    ee.emit('timeout', evt);

    //
    // Make sure that the request is aborted when there is a timeout. If this
    // doesn't trigger an error, the next call will.
    //
    if (xhr.abort) xhr.abort();
    onerror(evt);
  });

  //
  // Fallback for implementations that did not ship with timer support yet.
  // Microsoft's XDomainRequest was one of the first to ship with `.timeout`
  // support so we all XHR implementations before that require a polyfill.
  //
  // @see https://bugzilla.mozilla.org/show_bug.cgi?id=525816
  //
  if (xhr.timeout) timer = setTimeout(ontimeout, +xhr.timeout);

  /**
   * IE needs have it's `onprogress` function assigned to a unique function. So,
   * no touchy touchy here!
   *
   * @param {Event} evt Triggered progress event.
   * @api private
   */
  onprogress = xhr.onprogress = function progress(evt) {
    var status = statuscode(xhr)
      , data;

    ee.emit('progress', evt, status);

    if (xhr.readyState >= 3 && status.code === 200 && (data = response(xhr))) {
      ee.emit('stream', data, status);
    }
  };

  /**
   * Handle load events an potential data events for when there was no streaming
   * data.
   *
   * @param {Event} evt Triggered load event.
   * @api private
   */
  onload = xhr.onload = one(function load(evt) {
    var status = statuscode(xhr)
      , data = response(xhr);

    if (status.code < 100 || status.code > 599) return onerror(evt);

    //
    // There is a bug in FireFox's XHR2 implementation where status code 204
    // triggers a "no element found" error and bad data. So to be save here,
    // we're just **never** going to emit a `stream` event as for 204's there
    // shouldn't be any content.
    //
    if (data && status.code !== 204) {
      ee.emit('stream', data, status);
    }

    ee.emit('end', undefined, status);
  });

  //
  // Properly clean up the previously assigned event listeners and timers to
  // prevent potential data leaks and unwanted `stream` events.
  //
  ee.once('end', function cleanup() {
    xhr.onreadystatechange = onreadystatechange =
    xhr.onprogress = onprogress =
    xhr.ontimeout = ontimeout =
    xhr.onerror = onerror =
    xhr.onabort = onabort =
    xhr.onload = onload = nope;

    if (timer) clearTimeout(timer);
  });

  return xhr;
}

//
// Expose all the things.
//
module.exports = loads;
