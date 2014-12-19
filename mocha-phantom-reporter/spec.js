/**
 * Module dependencies.
 */

var payload = {};
var Base = Mocha.reporters.Base
  , cursor = Base.cursor
  , color = Base.color
  , ms = require('../node_modules/mocha/lib/ms');

/**
 * Expose `Spec`.
 */

exports = module.exports = Spec;

/**
 * Initialize a new `Spec` test reporter.
 *
 * @param {Runner} runner
 * @api public
 */

function Spec(runner) {
  Base.call(this, runner);

  var self = this
    , stats = this.stats
    , indents = 0
    , n = 0;

  function indent() {
    return Array(indents).join('  ')
  }

  runner.on('start', function(){
    console.log();
  });

  runner.on('suite', function(suite){
    ++indents;
    console.log(color('suite', '%s%s'), indent(), suite.title);
  });

  runner.on('suite end', function(suite){
    --indents;
    if (1 == indents) console.log();
  });

  runner.on('pending', function(test){
    var fmt = indent() + color('pending', '  - %s');
    console.log(fmt, test.title);
  });

  runner.on('pass', function(test){
    if ('fast' == test.speed) {
      var fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s ');
      cursor.CR();
      console.log(fmt, test.title);
    } else {
      var fmt = indent()
        + color('checkmark', '  ' + Base.symbols.ok)
        + color('pass', ' %s ')
        + color(test.speed, '(%dms)');
      cursor.CR();
      console.log(fmt, test.title, test.duration);
    }
  });

  runner.on('fail', function(test, err){
    cursor.CR();
    console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
  });

  runner.on('end', function(){
      var stats = this.stats;
      var tests;
      var fmt;

      console.log();

      // passes
      fmt = color('bright pass', ' ')
        + color('green', ' %d passing')
        + color('light', ' (%s)');

      console.log(fmt,
        stats.passes || 0,
        ms(stats.duration));

      // pending
      if (stats.pending) {
        fmt = color('pending', ' ')
          + color('pending', ' %d pending');

        console.log(fmt, stats.pending);
      }

      // failures
      if (stats.failures) {
        fmt = color('fail', '  %d failing');

        console.error(fmt,
          stats.failures);

        Base.list(self.failures);
        console.error();
      }

      console.log();
  });
}

/**
 * Inherit from `Base.prototype`.
 */

Spec.prototype.__proto__ = Base.prototype;
