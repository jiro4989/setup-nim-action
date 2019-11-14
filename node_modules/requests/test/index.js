'use strict';

var path = require('path')
  , Mocha = require('mocha')
  , argv = require('argh').argv
  , mochify = require('mochify');

argv.reporter = argv.reporter || 'spec';
argv.ui = argv.ui || 'bdd';
argv.wd = argv.wd || false;

/**
 * Poor mans kill switch. Kills all active hooks.
 *
 * @api private
 */
function kill() {
  require('async-each')(kill.hooks, function each(fn, next) {
    fn(next);
  }, function done(err) {
    if (err) return process.exit(1);

    process.exit(0);
  });
}

/**
 * All the hooks that need destruction.
 *
 * @type {Array}
 * @private
 */
kill.hooks = [];

//
// This is the magical test runner that setup's all the things and runs various
// of test suites until something starts failing.
//
(function runner(steps) {
  if (!steps.length) return kill(), runner;

  var step = steps.shift();

  step(function unregister(fn) {
    kill.hooks.push(fn);
  }, function register(err) {
    if (err) throw err;

    runner(steps);
  });

  return runner;
})([
  //
  // Run the normal node tests.
  //
  function creamy(kill, next) {
    var mocha = new Mocha();

    mocha.reporter(argv.reporter);
    mocha.ui(argv.ui);

    //
    // The next bulk of logic is required to correctly glob and lookup all the
    // files required for testing.
    //
    mocha.files = [
      './test/*.test.js'
    ].map(function lookup(glob) {
      return Mocha.utils.lookupFiles(glob, ['js']);
    }).reduce(function flatten(arr, what) {
      Array.prototype.push.apply(arr, what);
      return arr;
    }, []).map(function resolve(file) {
      return path.resolve(file);
    });

    //
    // Run the mocha test suite inside this node process with a custom callback
    // so we don't accidentally exit the process and forget to run the test of the
    // tests.
    //
    mocha.run(function ran(err) {
      if (err) err = new Error('Something failed in the mocha test suite');
      next(err);
    });
  },

  //
  // Start-up a small static file server so we can download files and fixtures
  // inside our PhantomJS test.
  //
  require('./static'),

  //
  // Run the PhantomJS tests now that we have a small static server setup.
  //
  function phantomjs(kill, next) {
    mochify('./test/*.browser.js', {
      reporter: argv.reporter,
      cover: argv.cover,
      wd: argv.wd,
      ui: argv.ui
    })
    .bundle(next);
  }
]);
