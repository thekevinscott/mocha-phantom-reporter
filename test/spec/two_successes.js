var assert = require("assert")
describe('something', function() {
    it('runs a test', function(done) {
        setTimeout(function() {
            assert.equal(1, 1);
            done();
        }, 100);
    });
    it('runs a second test', function(done) {
        setTimeout(function() {
            assert.equal(2, 2);
            done();
        }, 100);
    });
});
