'use strict';

/**
 * Get the correct status code for a given XHR request.
 *
 * @param {XHR} xhr A XHR request who's status code needs to be retrieved.
 * @returns {Object}
 * @api public
 */
module.exports = function status(xhr) {
  var local = /^file:/.test(xhr.responseURL)
    , code = xhr.status
    , text = '';

  //
  // Older version IE incorrectly return status code 1233 for requests that
  // respond with a 204 header.
  //
  // @see http://stackoverflow.com/q/10046972
  //
  if (1233 === code) return {
    error: false,
    text: 'OK',
    code: 204
  };

  //
  // If you make a request with a file:// protocol it returns status code 0 by
  // default so we're going to assume 200 instead. But if you do a HTTP request
  // to dead server you will also get the same 0 response code in chrome. So
  // we're going to assume statusCode 200 for local files.
  //
  if (0 === code) return local ? {
    error: false,
    text: 'OK',
    code: 200
  } : {
    error: true,
    text: 'An unknown error occured',
    code: 0
  };

  //
  // FireFox will throw an error when accessing the statusText on faulty
  // cross-domain requests.
  //
  try { text = xhr.statusText; }
  catch (e) {}

  return {
    error: code >= 400,
    text: text,
    code: code
  };
};
