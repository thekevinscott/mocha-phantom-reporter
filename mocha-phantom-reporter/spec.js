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

var suites = [{children: []}];
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
        var title = suite.title;
        ++indents;

        function last(arr) {
            return arr[arr.length-1];
        };

        function getParent(indents, arr) {
            if ( ! arr ) { arr = suites; }

            if ( indents <= 1 ) {
                var a = arr;
                if ( a.length && last(a).children && last(a).children.length) {
                    a = last(last(a).children);
                    if ( a.title ) {
                        return a.title;
                    }
                }
                return undefined;
            } else {
                --indents;
                return getParent(indents, last(arr).children);
            }
        };

        function pushSuite(title, indents, suites) {
            if ( indents <= 0 ) {
                var parentSuitesChildren = suites;
                var suite = {
                    title: title,
                    children: []
                };
                parentSuitesChildren.push(suite);
            } else {
                --indents;
                pushSuite(title, indents, last(suites).children);
            }
        };

        //var theParent = getParent(indents);
        //console.log('parent', theParent, 'title', title);

        if ( getParent(indents) != title) {
        //if ( 1 || last(suites) !== title ) {
            pushSuite(title, indents, suites);
            console.log(color('suite', '%s%s'), indent(), suite.title);
        } else {
            //console.log('dont write');
            //console.log('title has been seen already', title);
        }
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
        //console.log(JSON.stringify(suites, null, 4));
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
                results: passes.length + ' passes / ' + tests.length + ' total'
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
