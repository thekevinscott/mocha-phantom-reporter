// INCEPTION!!!# ZOMG
// Use mocha to run mocha
var exec = require('child_process').exec;
var child;
var assert = require("assert");
var Q = require('q');

var cmd = function(command) {
    var dfd = Q.defer();

    exec(command, function(error, stdout, stderr) {
        if ( error ) {
            dfd.resolve(error.toString());
        } else if ( stderr ) {
            dfd.resolve(stderr);
        }
        dfd.resolve(stdout);
    });

    return dfd.promise;
};

describe('Test Mocha Reporter output', function() {
    it('should match for one success', function(done) {
        runTest('one_success', done);
    });
    it('should match for multiple successes', function(done) {
        runTest('two_successes', done);
    });
    it('should match for one failure', function(done) {
        runTest('one_failure', done);
    });
    it('should match for multiple failures', function(done) {
        runTest('two_failures', done);
    });
    it('should match for successes and failures', function(done) {
        runTest('successes_and_failures', done);
    });
});

function runTest(file, done) {
    var command = 'mocha test/spec/'+file+'.js';

    Q.all([
        cmd(command), 
        cmd(command + ' --reporter mocha-standalone-spec-reporter')
    ]).spread(function(specOutput, customOutput) {
        // times might be different by a millisecond
        specOutput = specOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'');
        customOutput = customOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'');
        //logOutputs(specOutput, customOutput);
        assert.equal(specOutput, customOutput);
        done();
    }).fail(function(err, err2) {
        console.log('here we are!');
        done(err);
    });
};

function logOutputs(specOutput, customOutput) {
    console.log('*********** Spec Output ************');
    console.log(specOutput);
    console.log('*********** Spec Output ************');
    console.log('*********** Custom Output ************');
    console.log(customOutput);
    console.log('*********** Custom Output ************');
};
