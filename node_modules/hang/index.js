'use strict';

/**
 * Delay function calls only if they are not already ran async.
 *
 * @param {Function} fn Function that should be forced in async execution
 * @returns {Function} A wrapped function that will called the supplied callback.
 * @api public
 */
module.exports = function hang(fn) {
  var start = +(new Date());

  /**
   * The wrapped function.
   *
   * @api private
   */
  function bro() {
    var self = this;

    //
    // Time has passed since we've generated this function so we're going to
    // assume that this function is already executed async.
    //
    if (+(new Date()) > start) {
      return fn.apply(self, arguments);
    }

    for (var i = 0, l = arguments.length, args = new Array(l); i < l; i++) {
      args[i] = arguments[i];
    }

    (global.setImmediate || global.setTimeout)(function delay() {
      fn.apply(self, args);
      self = args = null;
    }, 0);
  }

  //
  // To make debugging more easy we want to use the name of the supplied
  // function. So when you look at the functions that are assigned to event
  // listeners you don't see a load of `onetime` functions but actually the
  // names of the functions that this module will call.
  //
  bro.displayName = fn.displayName || fn.name || bro.displayName || bro.name;

  return bro;
};
