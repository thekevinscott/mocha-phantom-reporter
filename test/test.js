// INCEPTION!!!# ZOMG
// Use mocha to run mocha
var exec = require('child_process').exec;
var fs = require('fs');
var child;
var Q = require('q');
require('chai').should();

var cmd = function(command) {
    var dfd = Q.defer();

    exec(command, function(error, stdout, stderr) {
        if ( error ) {
            dfd.resolve(stdout);
        } else if ( stderr ) {
            console.log('stderr', stderr);
            dfd.resolve(stderr);
        }
        dfd.resolve(stdout);
    });

    return dfd.promise;
};

describe('Test Mocha Reporter output', function() {
    it('should match for one success', function(done) {
        var files = [
            'test/spec/users/create.js',
            'test/spec/users/edit.js',
            'test/spec/users/list.js',
            'test/spec/debug.js',
            'test/spec/groups/create.js',

        ];
        runTest(files.join(' '), 'test/fixtures/bigTest.js', done);
    });
    //it('should match for multiple successes', function(done) {
        //runTest('two_successes', done);
    //});
    //it('should match for one failure', function(done) {
        //runTest('one_failure', done);
    //});
    //it('should match for multiple failures', function(done) {
        //runTest('two_failures', done);
    //});
    //it('should match for successes and failures', function(done) {
        //runTest('successes_and_failures', done);
    //});
});

function runTest(file, fixture, done) {
    //process.env.MOCHA_COLORS = false;
    var fs = require('fs');

    var command = 'mocha-casperjs '+file+' --no-color --reporter=./mocha-phantom-reporter/spec --spec-dir=test/spec/';

    Q.all([
        cmd(command), 
    ]).spread(function(specOutput) {
        specOutput = specOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'').replace(/\[2K\u001b\[0G/g,'').replace(/\u001b/g,'');

        var content = fs.readFileSync(fixture, {encoding: 'utf8'});
        //var fixturePath = 'test/fixtures/'+file+'.js';
        //console.log(fixturePath);
        //logOutputs(specOutput, content);
        var min = 0;
        var max = specOutput.length;

        content = content.substring(min, max);
        specOutput = specOutput.substring(min, max);
        content.should.equal(specOutput);
        done();
    }).fail(function(err) {
        done(err);
    });
};

/*
function oldRunTest(file, done) {
    //var command = 'mocha-casperjs test/spec/'+file+'.js';

    Q.all([
        cmd(command), 
        cmd(command + ' --reporter=./mocha-phantom-reporter/spec')
    ]).spread(function(specOutput, customOutput) {
        // times might be different by a millisecond
        specOutput = specOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'');
        customOutput = customOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'');
        //logOutputs(specOutput, customOutput);
        specOutput.should.equal();
        done();
    }).fail(function(err) {
        done(err);
    });
};
*/

function logOutputs(specOutput, fixtureOutput) {
    console.log('*********** Spec Output ************');
    console.log(specOutput);
    console.log('*********** Spec Output ************');
    console.log('*********** Fixture Output ************');
    console.log(fixtureOutput);
    console.log('*********** Fixture Output ************');
};
