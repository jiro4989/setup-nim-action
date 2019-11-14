'use strict';

/**
 * Node.js `XMLHttpRequestEventTarget` implementation.
 *
 * @module node-xhr-event-target
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var EventTarget = require('./node-event-target');

var events = [
  /**
   * The {@link
   * module:node-http-xhr#readyState
   * `readyState`
   * } changed.
   *
   * @event module:node-xhr-event-target#readystatechange
   */
  'readystatechange',
  /**
   * The request was aborted.
   *
   * @event module:node-xhr-event-target#abort
   */
  'abort',
  /**
   * An error was encountered.
   *
   * @event module:node-xhr-event-target#error
   * @type {Error}
  */
  'error',
  /**
   * The request timed out.
   *
   * @event module:node-xhr-event-target#timeout
   */
  'timeout',
  /**
   * The response finished loading.
   *
   * @event module:node-xhr-event-target#load
   */
  'load'
];

/**
 * Creates a new `XMLHttpRequestEventTarget`.
 *
 * @classdesc The interface that describes the event handlers for an
 * `XMLHttpRequest`.
 *
 * NOTE: Currently, some features are lacking:
 * - Some ProgressAPI events (`loadstart`, `loadend`, `progress`)
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequestEventTarget
 * `XMLHttpRequestEventTarget` on MDN
 * } for more details.
 *
 * @class
 * @extends module:node-event-target
 */
module.exports = function () {
  EventTarget.call(this);

  var props = {};

  // Add private event handler properties
  events.forEach(function (type) {
    props['_on' + type] = { value: null, writable: true };
  });

  Object.defineProperties(this, props);
};

/** @alias module:node-xhr-event-target */
var NodeXHREventTarget = module.exports;

var protoProps = {};

//
// Set up event handler properties
//
events.forEach(function (type) {
  var key = 'on' + type;
  protoProps[key] = {
    get: function getHandler() { return this['_' + key]; },
    set: function setHandler(handler) {
      if (typeof handler === 'function') {
        this.addEventListener(type, handler);
        this['_' + key] = handler;
      } else {
        var old = this['_' + key];
        if (old) {
          this.removeEventListener(type, old);
        }

        this['_' + key] = null;
      }
    }
  };
});

NodeXHREventTarget.prototype = Object.create(
  EventTarget.prototype, protoProps
);

