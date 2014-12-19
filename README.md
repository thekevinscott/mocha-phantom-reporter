mocha-phantom-reporter
==============================

This is a third party Mocha reporter written on top of PhantomJS. Behavior is basically identical to Mocha's built-in spec reporter, but it also writes the output to a JSON file.

To call:

./node_modules/mocha-casperjs/bin/mocha-casperjs test/spec/one_failure.js --reporter=./mocha-phantom-reporter/spec --output=results.txt
