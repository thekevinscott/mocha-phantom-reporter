var assert = require("assert")
describe('something', function() {
    it('runs a success', function(done) {
        setTimeout(function() {
            assert.equal(1, 1);
            done();
        }, 100);
    });
    it('runs a second success', function(done) {
        setTimeout(function() {
            assert.equal(2, 2);
            done();
        }, 100);
    });
    it('runs a failure', function(done) {
        setTimeout(function() {
            assert.equal(1, 2);
            done();
        }, 100);
    });
    it('runs a second failure', function(done) {
        setTimeout(function() {
            assert.equal(2, 3);
            done();
        }, 100);
    });
});
