'use strict';

/**
 * Node.js `EventTarget` implementation using Node's `EventEmitter`.
 *
 * @module node-event-target
 * @author Stan Zhang <stan.zhang2@gmail.com>
 */

var EventEmitter = require('events').EventEmitter;

/**
 * Creates a new `EventTarget`.
 *
 * @classdesc The interface implemented by objects that can receive events and
 * may have listeners for them.
 *
 * See {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget
 * `EventTarget` on MDN
 * } for more details.
 *
 * @class
 */
module.exports = function () {
  EventEmitter.call(this);
};

/** @alias module:node-event-target */
var EventTarget = module.exports;

//
// Inherit some EventEmitter functions as private functions
//
['on', 'removeListener', 'emit', 'listeners'].forEach(function (key) {
  Object.defineProperty(EventTarget.prototype, '_' + key, {
    value: EventEmitter.prototype[key]
  });
});

Object.defineProperty(EventTarget.prototype, '_listenerCount', {
  value: 'listenerCount' in EventEmitter.prototype
  ? EventEmitter.prototype.listenerCount
  // Shim `EventEmitter#listenerCount` support
  : function (event) {
    return this._listeners(event).length;
  }
});

//
// Wrap the event listener methods so that the `EventEmitter` events are not
// exposed.
//

/**
 * Adds an event listener.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener
 * `EventTarget.addEventListener` on MDN
 * }
 * @param {String} type - The event type.
 * @param {Function} listener - The callback.
 * @param {Object} [options] - Options for the listener.
 * @param {Boolean} [options.once=false] - Invoke listener once.
 */
EventTarget.prototype.addEventListener = function (type, listener, options) {
  // Re-implement `#once()` behavior
  // This is necessary because the built-in `#once()` calls functions that we've
  // renamed on the prototype.
  var fired = false;

  /** @this NodeHttpXHR */
  function onceListener() {
    this._removeListener(type, onceListener);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  this._on(type, options && options.once
    ? onceListener
    : listener
  );
};

/**
 * Removes an event listener.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/removeEventListener
 * `EventTarget.removeEventListener` on MDN
 * }
 * @param {String} type - The event type.
 * @param {Function} listener - The callback.
 */
EventTarget.prototype.removeEventListener = function (type, listener) {
  this._removeListener(type, listener);
};

/**
 * Dispatches an event.
 *
 * @see {@link
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/dispatchEvent
 * `EventTarget.dispatchEvent` on MDN
 * }
 * @param {Object} event - The event to dispatch.
 */
EventTarget.prototype.dispatchEvent = function (event) {
  event.target = this;
  this._emit(event.type, event);
};

