'use strict';

/**
 * Safely access the response body.
 *
 * @param {XHR} xhr XHR request who's body we need to safely extract.
 * @returns {Mixed} The response body.
 * @api public
 */
module.exports = function get(xhr) {
  if (xhr.response) return xhr.response;

  var type = xhr.responseType || '';

  //
  // Browser bugs:
  //
  // IE<10:   Accessing binary data's responseText will throw an Exception
  // Chrome:  When responseType is set to Blob it will throw errors even when
  //          Accessing the responseText property.
  //
  // Firefox: An error is thrown when reading the `responseText` after unload
  //          when responseType is using a `moz-chunked-*` type.
  //          https://bugzilla.mozilla.org/show_bug.cgi?id=687087
  //
  if (~type.indexOf('moz-chunked') && xhr.readyState === 4) return;
  if ('blob' !== type && 'string' === typeof xhr.responseText) {
    return xhr.responseText || xhr.responseXML;
  }
};
