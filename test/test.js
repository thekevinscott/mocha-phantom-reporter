// INCEPTION!!!# ZOMG
// Use mocha to run mocha
var exec = require('child_process').exec;
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
    var command = 'mocha-casperjs test/spec/'+file+'.js';

    Q.all([
        cmd(command), 
        cmd(command + ' --reporter=./mocha-phantom-reporter/spec')
    ]).spread(function(specOutput, customOutput) {
        // times might be different by a millisecond
        specOutput = specOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'');
        customOutput = customOutput.replace(new RegExp("\\(([^)]+)\\)",'g'),'');
        //logOutputs(specOutput, customOutput);
        specOutput.should.equal(customOutput);
        done();
    }).fail(function(err) {
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
