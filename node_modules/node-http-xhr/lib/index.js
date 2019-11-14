'use strict';

/**
 * Node.js `XMLHttpRequest` implementation using `http.request()`.
 *
 * @module node-http-xhr
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var url = require('url');
var http = require('http');
var https = require('https');

var NodeXHREventTarget = require('./node-xhr-event-target');

/**
 * Currently-supported response types.
 *
 * @private
 * @readonly
 * @type {Object<String, Boolean>}
 */
var supportedResponseTypes = Object.freeze({
  /** Text response (implicit) */
  '': true,
  /** Text response */
  'text': true
});

/**
 * Makes a request using either `http.request` or `https.request`, depending
 * on the value of `opts.protocol`.
 *
 * @private
 * @param {Object} opts - Options for the request.
 * @param {Function} cb - Callback for request.
 * @returns {ClientRequest} The request.
 */
function makeRequest(opts, cb) {
  if (opts.protocol === 'http:') {
    return http.request(opts, cb);
  } else if (opts.protocol === 'https:') {
    return https.request(opts, cb);
  }

  throw new Error('Unsupported protocol "' + opts.protcol + '"');
}

/**
 * Creates a new `XMLHttpRequest`.
 *
 * @classdesc A wrapper around `http.request` that attempts to emulate the
 * `XMLHttpRequest` API.
 *
 * NOTE: Currently, some features are lacking:
 * - Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
 * - `responseType` values other than '' or 'text' and corresponding parsing
 *   - As a result of the above, `overrideMimeType()` isn't very useful
 * - `setRequestHeader()` doesn't check for forbidden headers.
 * - `withCredentials` is defined as an instance property, but doesn't do
 *   anything since there's no use case for CORS-like requests in `node.js`
 *   right now.
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest
 * `XMLHttpRequest` on MDN
 * } for more details.
 *
 * @class
 * @extends module:node-xhr-event-target
 */
module.exports = function () {
  NodeXHREventTarget.call(this);

  /**
   * Current ready state.
   *
   * @private
   */
  this._readyState = this.UNSENT;

  /**
   * MIME type to use instead of the type specified by the response, or `null`
   * to use the response MIME type.
   *
   * @type {?String}
   * @private
   */
  this._mimetype = null;

  /**
   * Options for `http.request`.
   *
   * @see {@link
   * https://nodejs.org/dist/latest/docs/api/http.html
   * node.js `http` docs
   * }
   * @private
   * @type {Object}
   */
  this._reqOpts = {
    timeout: 0,
    headers: {}
  };

  /**
   * The request (instance of `http.ClientRequest`), or `null` if the request
   * hasn't been sent.
   *
   * @private
   * @type {?http.ClientRequest}
   */
  this._req = null;

  /**
   * The response (instance of `http.IncomingMessage`), or `null` if the
   * response has not arrived yet.
   *
   * @private
   * @type {?http.IncomingMessage}
   */
  this._resp = null;

  /**
   * The type of the response. Currently, only `''` and `'text'` are
   * supported, which both indicate the response should be a `String`.
   *
   * @private
   * @type {String}
   * @default ''
   */
  this._responseType = '';

  /**
   * The current response text, or `null` if the request hasn't been sent or
   * was unsuccessful.
   *
   * @private
   * @type {?String}
   */
  this._responseText = null;
};

/** @alias module:node-http-xhr */
var NodeHttpXHR = module.exports;

//
// Set up public API
//
NodeHttpXHR.prototype = Object.create(
  NodeXHREventTarget.prototype,
  /** @lends module:node-http-xhr.prototype */
  {
    /**
     * Ready state indicating the request has been created, but `open()` has not
     * been called yet.
     *
     * @type {Number}
     * @default 0
     * @readonly
     */
    UNSENT: { value: 0 },
    /**
     * Ready state indicating that `open()` has been called, but the headers
     * have not been received yet.
     *
     * @type {Number}
     * @default 1
     * @readonly
     */
    OPENED: { value: 1 },
    /**
     * Ready state indicating that `send()` has been called and the response
     * headers have been received.
     *
     * @type {Number}
     * @default 2
     * @readonly
     */
    HEADERS_RECEIVED: { value: 2 },
    /**
     * Ready state indicating that the response body is being loaded.
     *
     * @type {Number}
     * @default 3
     * @readonly
     */
    LOADING: { value: 3 },
    /**
     * Ready state indicating that the response has completed, or the request
     * was aborted/encountered an error.
     *
     * @type {Number}
     * @default 4
     * @readonly
     */
    DONE: { value: 4 },
    /**
     * The current ready state.
     *
     * @type {Number}
     * @readonly
     */
    readyState: {
      get: function getReadyState() { return this._readyState; }
    },
    /**
     * The status code for the response, or `0` if the response headers have
     * not been received yet.
     *
     * @type {Number}
     * @example 200
     * @readonly
     */
    status: {
      get: function getStatus() {
        if (!this._resp) {
          return 0;
        }

        return this._resp.statusCode;
      }
    },
    /**
     * The status text for the response, or `''` if the response headers have
     * not been received yet.
     *
     * @type {String}
     * @example 'OK'
     * @readonly
     */
    statusText: {
      get: function getStatusText() {
        if (!this._resp) {
          return '';
        }

        return this._resp.statusMessage;
      }
    },
    /**
     * The timeout for the request, in milliseconds. `0` means no timeout.
     *
     * @type {Number}
     * @default 0
     */
    timeout: {
      get: function getTimeout() { return this._reqOpts.timeout; },
      set: function setTimeout(timeout) {
        this._reqOpts.timeout = timeout;
        if (this._req) {
          this._req.setTimeout(timeout);
        }
      }
    },
    /**
     * The type of the response. Currently, only `''` and `'text'` are
     * supported, which both indicate the response should be a `String`.
     *
     * @see {@link
     * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/responseType
     * `XMLHttpRequest.responseType` on MDN
     * }
     *
     * @type {String}
     * @default ''
     */
    responseType: {
      get: function () { return this._responseType; },
      set: function (responseType) {
        if (!(responseType in supportedResponseTypes)) {
          return;
        }

        this._responseType = responseType;
      }
    },
    /**
     * The response, encoded according to {@link
     * module:node-http-xhr#responseType
     * `responseType`
     * }.
     *
     * If `send()` has not been called yet, this is `null`.
     *
     * If `responseType` is `''` or `'text'`, this is a `String` and will be
     * be incomplete until the response actually finishes.
     *
     * @type {?*}
     * @default ''
     * @readonly
     */
    response: {
      get: function getResponse() {
        var type = this.responseType;
        if (!(type in supportedResponseTypes)) {
          throw new Error('Unsupported responseType "' + type + '"');
        }

        return this._responseText;
      }
    },
    /**
     * The response body as a string.
     *
     * If `send()` has not been called yet, this is `null`.
     *
     * This will be incomplete until the response actually finishes.
     *
     * @type {?String}
     * @readonly
     */
    responseText: {
      get: function getResponseText() { return this._responseText; }
    },
    /**
     * Indicates whether or not cross-site `Access-Control` requests should be
     * made using credentials such as cookies, authorization headers, or TLS
     * client certificates.
     *
     * This flag doesn't do anything at the moment because there isn't much of
     * a use case for doing CORS-like requests in Node.js at the moment.
     *
     * @type {Boolean}
     * @default false
     */
    withCredentials: { value: false, writable: true }
  }
);

/**
 * Sets the ready state and emits the `readystatechange` event.
 *
 * @private
 * @param {Number} readyState - The new ready state.
 */
NodeHttpXHR.prototype._setReadyState = function (readyState) {
  this._readyState = readyState;
  this.dispatchEvent({
    type: 'readystatechange'
  });
};

/**
 * Aborts the request if it has already been sent.
 */
NodeHttpXHR.prototype.abort = function () {
  if (this.readyState === this.UNSENT || this.readyState === this.DONE) {
    return;
  }

  if (this._req) {
    this._req.abort();
  }
};

/**
 * Returns all the response headers, separated by CRLF, as a string.
 *
 * @returns {?String} The response headers, or `null` if no response yet.
 */
NodeHttpXHR.prototype.getAllResponseHeaders = function () {
  if (this.readyState < this.HEADERS_RECEIVED) {
    return null;
  }

  var headers = this._resp.headers;
  return Object.keys(headers).reduce(function (str, name) {
    return str.concat(name + ': ' + headers[name] + '\r\n');
  }, '');
};

/**
 * Returns the string containing the text of the specified header.
 *
 * @param {String} name - The header's name.
 * @returns {?String} The header's value, or `null` if no response yet or
 * the header does not exist in the response.
 */
NodeHttpXHR.prototype.getResponseHeader = function (name) {
  if (this.readyState < this.HEADERS_RECEIVED) {
    return null;
  }

  return this._resp.headers[name.toLowerCase()] || null;
};

/**
 * Initializes a request.
 *
 * @param {String} method - The HTTP method to use.
 * @param {String} reqUrl - The URL to send the request to.
 * @param {Boolean} [async=true] - Whether or not the request is asynchronous.
 */
NodeHttpXHR.prototype.open = function (method, reqUrl, async) {
  if (async === false) {
    throw new Error('Synchronous requests not implemented');
  }

  if (this._readyState > this.UNSENT) {
    this.abort();
    return;
  }

  var opts = this._reqOpts;
  opts.method = method;

  var urlObj = url.parse(reqUrl);
  ['protocol', 'hostname', 'port', 'path'].forEach(function (key) {
    if (key in urlObj) {
      opts[key] = urlObj[key];
    }
  });

  this._setReadyState(this.OPENED);
};

/**
 * Overrides the MIME type returned by the server.
 *
 * Must be called before `#send()`.
 *
 * @param {String} mimetype - The MIME type to use.
 */
NodeHttpXHR.prototype.overrideMimeType = function (mimetype) {
  if (this._req) {
    throw new Error('overrideMimeType() called after send()');
  }

  this._mimetype = mimetype;
};

/**
 * Sets the value of a request header.
 *
 * Must be called before `#send()`.
 *
 * @param {String} header - The header's name.
 * @param {String} value - The header's value.
 */
NodeHttpXHR.prototype.setRequestHeader = function (header, value) {
  if (this.readyState < this.OPENED) {
    throw new Error('setRequestHeader() called before open()');
  }

  if (this._req) {
    throw new Error('setRequestHeader() called after send()');
  }

  this._reqOpts.headers[header] = value;
};

/**
 * Sends the request.
 *
 * @param {*} [data] - The request body.
 */
NodeHttpXHR.prototype.send = function (data) {
  var onAbort = function onAbort() {
    this._setReadyState(this.DONE);

    this.dispatchEvent({
      type: 'abort'
    });
  }.bind(this);

  var opts = this._reqOpts;
  var req = makeRequest(opts, function onResponse(resp) {
    this._resp = resp;
    this._responseText = '';

    resp.setEncoding('utf8');
    resp.on('data', function onData(chunk) {
      this._responseText += chunk;

      if (this.readyState !== this.LOADING) {
        this._setReadyState(this.LOADING);
      }
    }.bind(this));

    resp.on('end', function onEnd() {
      this._setReadyState(this.DONE);
      this.dispatchEvent({
        type: 'load'
      });
    }.bind(this));

    this._setReadyState(this.HEADERS_RECEIVED);
  }.bind(this));

  // Passing `opts.timeout` doesn't actually seem to set the timeout sometimes,
  // so it is set manually here.
  req.setTimeout(opts.timeout);

  req.on('abort', onAbort);
  req.on('aborted', onAbort);

  req.on('timeout', function onTimeout() {
    this._setReadyState(this.DONE);
    this.dispatchEvent({
      type: 'timeout'
    });
  }.bind(this));

  req.on('error', function onError(err) {
    if (this._listenerCount('error') < 1) {
      // Uncaught error; throw something more meaningful
      throw err;
    }

    // Dispatch an error event. The specification does not provide for any way
    // to communicate the failure reason with the event object.
    this.dispatchEvent({
      type: 'error'
    });

    this._setReadyState(this.DONE);
  }.bind(this));

  if (data) {
    req.write(data);
  }
  req.end();

  this._req = req;
};

