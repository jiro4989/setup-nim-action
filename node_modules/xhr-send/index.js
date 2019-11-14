'use strict';

/**
 * Safely send data over XHR.
 *
 * @param {XHR} xhr The XHR object that we should send.
 * @param {Mixed} data The data that needs to be send.
 * @param {Function} fn Send callback.
 * @returns {Boolean} Successful sending
 * @api public
 */
module.exports = function send(xhr, data, fn) {
  //
  // @TODO detect binary data.
  // @TODO polyfill sendAsBinary (firefoxy only)?
  //
  try { xhr.send(data); }
  catch (e) { return fn(e), false; }

  //
  // Call the completion callback __after__ the try catch to prevent unwanted
  // and extended try wrapping.
  //
  return fn(), true;
};
