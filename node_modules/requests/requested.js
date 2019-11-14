'use strict';

var EventEmitter = require('eventemitter3');

function Requested(url, options) {
  EventEmitter.call(this);

  //
  // All properties/options that should be introduced on the prototype.
  //
  this.merge(this, Requested.defaults, options || {});

  //
  // Private properties that should not be overridden by developers.
  //
  this.id = ++Requested.requested;

  //
  // We want to implement a stream like interface on top of this module so it
  // can be used to read streaming data in node as well as through browserify.
  //
  this.readable = true;
  this.writable = false;

  if (this.initialize) this.initialize(url);
  if (!this.manual && this.open) this.open(url);
}

Requested.extend = require('extendible');
Requested.prototype = new EventEmitter();
Requested.prototype.constructor = Requested;


/**
 * Accurate type discovery.
 *
 * @param {Mixed} what What ever needs to be figured out.
 * @returns {String} Name of the type.
 * @api private
 */
Requested.prototype.typeof = function type(what) {
  return Object.prototype.toString.call(what).slice(8, -1).toLowerCase();
};

/**
 * Deeply assign and merge objects together.
 *
 * @param {Object} target The target object that should receive the merged data.
 * @returns {Object} The merged target object.
 * @api private
 */
Requested.prototype.merge = function merge(target) {
  var i = 1
    , arg, key;

  for (; i < arguments.length; i++) {
    arg = arguments[i];

    for (key in arg) {
      if (!Object.prototype.hasOwnProperty.call(arg, key)) continue;

      if ('object' === this.typeof(arg[key])) {
        target[key] = this.merge('object' === this.typeof(target[key]) ? target[key] : {}, arg[key]);
      } else {
        target[key] = arg[key];
      }
    }
  }

  return target;
};

/**
 * The defaults for the Requests. These values will be used if no options object
 * or matching key is provided. It can be override globally if needed but this
 * is not advised as it can have some potential side affects for other libraries
 * that use this module.
 *
 * @type {Object}
 * @public
 */
Requested.defaults = {
  streaming: false,
  manual: false,
  method: 'GET',
  mode: 'cors',
  headers: {
    //
    // We're forcing text/plain mode by default to ensure that regular
    // requests can benefit from CORS requests without an OPTIONS request. It's
    // shared between server and client implementations to ensure that requests
    // are handled in exactly the same way.
    //
    'Content-Type': 'text/plain'
  }
};

/**
 * Unique id and also an indication on how many XHR requests we've made using
 * this library.
 *
 * @type {Number}
 * @private
 */
Requested.requested = 0;

//
// Expose the module interface.
//
module.exports = Requested;
