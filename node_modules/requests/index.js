'use strict';

var Requested = require('./requested')
  , listeners = require('loads')
  , send = require('xhr-send')
  , hang = require('hang')
  , AXO = require('axo')
  , XMLHttpRequest = require('node-http-xhr');

/**
 * RequestS(tream).
 *
 * Options:
 *
 * - streaming: Should the request be streaming.
 * - method: Which HTTP method should be used.
 * - headers: Additional request headers.
 * - mode: Enable CORS mode.
 * - body: The payload for the request.
 *
 * @constructor
 * @param {String} url The URL we want to request.
 * @param {Object} options Various of request options.
 * @api public
 */
var Requests = module.exports = Requested.extend({
  constructor: function bobthebuilder(url, options) {
    if (!(this instanceof Requests)) return new Requests(url, options);

    Requested.apply(this, arguments);
  },

  /**
   * The offset of data that we've already previously read
   *
   * @type {Number}
   * @private
   */
  offset: 0,

  /**
   * The requests instance has been fully initialized.
   *
   * @param {String} url The URL we need to connect to.
   * @api private
   */
  initialize: function initialize(url) {
    this.socket = Requests[Requests.method](this);

    //
    // Open the socket BEFORE adding any properties to the instance as this might
    // trigger a thrown `InvalidStateError: An attempt was made to use an object
    // that is not, or is no longer, usable` error in FireFox:
    //
    // @see https://bugzilla.mozilla.org/show_bug.cgi?id=707484
    //
    this.socket.open(this.method.toUpperCase(), url, true);

    //
    // Register this as an active HTTP request.
    //
    Requests.active[this.id] = this;
  },

  /**
   * Initialize and start requesting the supplied resource.
   *
   * @param {Object} options Passed in defaults.
   * @api private
   */
  open: function open() {
    var what
      , slice = true
      , requests = this
      , socket = requests.socket;

    requests.on('stream', function stream(data) {
      if (!slice) {
        return requests.emit('data', data);
      }

      //
      // Please note that we need to use a method here that works on both string
      // as well as ArrayBuffer's as we have no certainty that we're receiving
      // text.
      //
      var chunk = data.slice(requests.offset);
      requests.offset = data.length;

      requests.emit('data', chunk);
    });

    requests.on('end', function cleanup() {
      delete Requests.active[requests.id];
    });

    if (this.timeout) {
      socket.timeout = +this.timeout;
    }

    if ('cors' === this.mode.toLowerCase() && 'withCredentials' in socket) {
      socket.withCredentials = true;
    }

    //
    // ActiveXObject will throw an `Type Mismatch` exception when setting the to
    // an null-value and to be consistent with all XHR implementations we're going
    // to cast the value to a string.
    //
    // While we don't technically support the XDomainRequest of IE, we do want to
    // double check that the setRequestHeader is available before adding headers.
    //
    // Chrome has a bug where it will actually append values to the header instead
    // of overriding it. So if you do a double setRequestHeader(Content-Type) with
    // text/plain and with text/plain again, it will end up as `text/plain,
    // text/plain` as header value. This is why use a headers object as it
    // already eliminates duplicate headers.
    //
    for (what in this.headers) {
      if (this.headers[what] !== undefined && this.socket.setRequestHeader) {
        this.socket.setRequestHeader(what, this.headers[what] +'');
      }
    }

    //
    // Set the correct responseType method.
    //
    if (requests.streaming) {
      if (!this.body || 'string' === typeof this.body) {
        if ('multipart' in socket) {
          socket.multipart = true;
          slice = false;
        } else if (Requests.type.mozchunkedtext) {
          socket.responseType = 'moz-chunked-text';
          slice = false;
        }
      } else {
        if (Requests.type.mozchunkedarraybuffer) {
          socket.responseType = 'moz-chunked-arraybuffer';
        } else if (Requests.type.msstream) {
          socket.responseType = 'ms-stream';
        }
      }
    }

    listeners(socket, requests, requests.streaming);
    requests.emit('before', socket);

    send(socket, this.body, hang(function send(err) {
      if (err) {
        requests.emit('error', err);
        requests.emit('end', err);
      }

      requests.emit('send');
    }));
  },

  /**
   * Completely destroy the running XHR and release of the internal references.
   *
   * @returns {Boolean} Successful destruction
   * @api public
   */
  destroy: function destroy() {
    if (!this.socket) return false;

    this.emit('destroy');

    this.socket.abort();
    this.removeAllListeners();

    this.headers = {};
    this.socket = null;
    this.body = null;

    delete Requests.active[this.id];

    return true;
  }
});

/**
 * Create a new XMLHttpRequest.
 *
 * @returns {XMLHttpRequest}
 * @api private
 */
Requests.XHR = function create() {
  try { return new XMLHttpRequest(); }
  catch (e) {}
};

/**
 * Create a new ActiveXObject which can be used for XHR.
 *
 * @returns {ActiveXObject}
 * @api private
 */
Requests.AXO = function create() {
  var ids = ['MSXML2.XMLHTTP.6.0', 'MSXML2.XMLHTTP.3.0', 'Microsoft.XMLHTTP']
    , id;

  while (ids.length) {
    id = ids.shift();

    try { return new AXO(id); }
    catch (e) {}
  }
};

/**
 * Requests that are currently running.
 *
 * @type {Object}
 * @private
 */
Requests.active = {};

/**
 * The type of technology we are using to establish a working Ajax connection.
 * This can either be:
 *
 * - XHR: XMLHttpRequest
 * - AXO: ActiveXObject
 *
 * This is also used as internal optimization so we can easily get the correct
 * constructor as we've already feature detected it.
 *
 * @type {String}
 * @public
 */
Requests.method = !!Requests.XHR() ? 'XHR' : (!!Requests.AXO() ? 'AXO' : '');

/**
 * Boolean indicating
 *
 * @type {Boolean}
 * @public
 */
Requests.supported = !!Requests.method;

/**
 * The different type of `responseType` parsers that are supported in this XHR
 * implementation.
 *
 * @type {Object}
 * @public
 */
Requests.type = 'XHR' === Requests.method ? (function detect() {
  var types = 'arraybuffer,blob,document,json,text,moz-blob,moz-chunked-text,moz-chunked-arraybuffer,ms-stream'.split(',')
    , supported = {}
    , type, xhr, prop;

  while (types.length) {
    type = types.pop();
    prop = type.replace(/-/g, '');
    xhr = Requests.XHR();

    //
    // Older versions of Firefox/IE11 will throw an error because previous
    // version of the specification do not support setting `responseType`
    // before the request is opened. Thus, we open the request here.
    //
    // Note that `open()` does not actually open any connections; it just
    // initializes the request object.
    //
    try {
      // Try opening a request to current page.
      xhr.open('get', '/', true);
    } catch (e) {
      // In JSDOM the above will fail because it only supports full URLs, so
      // try opening a request to localhost.
      try {
        xhr.open('get', 'http://localhost/', true);
      } catch (err) {
        supported[prop] = false;
        continue;
      }
    }

    try {
      xhr.responseType = type;
      supported[prop] = 'response' in xhr && xhr.responseType === type;
    } catch (e) {
      supported[prop] = false;
    }

    xhr = null;
  }

  return supported;
}()) : {};

/**
 * Do we support streaming response parsing.
 *
 * @type {Boolean}
 * @private
 */
Requests.streaming = 'XHR' === Requests.method && (
     'multipart' in XMLHttpRequest.prototype
  || Requests.type.mozchunkedarraybuffer
  || Requests.type.mozchunkedtext
  || Requests.type.msstream
  || Requests.type.mozblob
);

//
// IE has a bug which causes IE10 to freeze when close WebPage during an XHR
// request: https://support.microsoft.com/kb/2856746
//
// The solution is to completely clean up all active running requests.
//
if (global.attachEvent) global.attachEvent('onunload', function reap() {
  for (var id in Requests.active) {
    Requests.active[id].destroy();
  }
});

//
// Expose the Requests library.
//
module.exports = Requests;
