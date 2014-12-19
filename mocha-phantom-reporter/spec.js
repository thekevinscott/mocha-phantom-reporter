/**
 * Module dependencies.
 */

var fs = require('fs');
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
        , n = 0
        , tests = []
        , failures = []
        , passes = [];

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

    runner.on('test end', function(test) {
        tests.push(test);
    });

    runner.on('pending', function(test){
        var fmt = indent() + color('pending', '  - %s');
        console.log(fmt, test.title);
    });

    runner.on('pass', function(test){
        passes.push(test);
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
        failures.push(test);
        cursor.CR();
        console.log(indent() + color('fail', '  %d) %s'), ++n, test.title);
    });

    runner.on('end', function(){
        var stats = this.stats;
        var fmt;

        console.log();

        // passes
        fmt = color('bright pass', ' ')
        + color('green', ' %d passing')
        + color('light', ' (%s)');

        console.log(
            fmt,
            stats.passes || 0,
            ms(stats.duration)
        );

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
        var payload = {
            summary: {
                time: stats.duration/1000+'s',
                results: passes.length + ' / ' + tests.length
            },
            stats: self.stats
            , tests: tests.map(clean)
            , failures: failures.map(clean)
            , passes: passes.map(clean)
        };
        var output = 'tmp.txt';
        phantom.args.map(function(arg) {
            if ( arg.indexOf('output') === 2 ) {
                output = arg.split('=').pop();
            }
        });
        var content = JSON.stringify(payload);
        fs.write(output, content, 'w');
    });
}

/**
 * Inherit from `Base.prototype`.
 */

Spec.prototype.__proto__ = Base.prototype;

function clean(test) {
    return {
        title: test.title
    , fullTitle: test.fullTitle()
    , duration: test.duration
    }
}
