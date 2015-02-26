/**
 * Module dependencies.
 */

var fs = require('fs');
var opts = cli.parse(phantom.args);
var integrationDir = opts.options['spec-dir'] || '';
var files = opts.args.slice(1).map(function(file) {
    if ( file.indexOf('scaffolding') === -1 ) {
        //console.log(integrationDir);
        file = fs.absolute(file).substring(fs.absolute(integrationDir).length);
        //console.log(file);
        return file;
    }
}).filter(function(file) { if (file) { return file; } });
var current = 0;
var Base = Mocha.reporters.Base
  , cursor = Base.cursor
  , color = Base.color
  , ms = require('../node_modules/mocha/lib/ms');

String.prototype.capitalize = function() {
    return this.substring(0,1).toUpperCase()+this.substring(1);
};
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

var suites = {};
var lastParent;
function Spec(runner) {
    Base.call(this, runner);

    var self = this
        , stats = this.stats
        , indents = 0
        , n = 0
        , tests = []
        , failures = []
        , passes = []
        , skipped = [];

    function indent() {
        return Array(indents).join('  ')
    }

    runner.on('start', function(){
        console.log();
    });

    function getParentTitle(file) {
        if ( ! file ) { file = files[current]; }
        var parentTitle = file.split('/').shift().capitalize();
        return parentTitle;
    };
    function writeParent() {
        var file = files[current].split('/');
        if ( file.length > 1 ) {
            lastParent = getParentTitle();
            console.log(color('suite', '%s%s'), indent(), lastParent);
        }
    };

    runner.on('suite', function(suite){
        var title = suite.title;
        var file = files[current].split('/');

        //if ( lastParent && lastParent !== getParentTitle(files[current]) ) {
        //}
        if ( file.length > 1 && indents === 1) {
            // there should be a parent (like 'Users')
            ++indents;
            if ( !suites[getParentTitle()]) {
                writeParent(current);
                suites[getParentTitle()] = true;
            }
            if ( indents===2) {
                current++;
            }
        } else if ( indents === 1 ) {
            // this implies there is no parent.
            current++;
        }
        ++indents;
        console.log(color('suite', '%s%s'), indent(), suite.title);
    });

    runner.on('suite end', function(suite){
        --indents;
        if ( indents === 2 ) {
            --indents;
        }
        if (1 == indents) console.log();
    });

    runner.on('test end', function(test) {
        tests.push(test);
    });

    runner.on('pending', function(test){
        skipped.push(test);
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
            , skipped: skipped.map(clean)
        };
        var output = 'tmp.json';
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
