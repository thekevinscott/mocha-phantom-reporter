mocha-phantom-reporter
==============================

Forked from https://github.com/scottlabs/mocha-spec-output-reporter

This is a third party Mocha reporter written on top of PhantomJS. Behavior is basically identical to Mocha's built-in spec reporter, but it also writes the output to a JSON file.

To call:

mocha  test/spec/successes_and_failures.js --reporter mocha-phantom-reporter/ --output=tmp.txt

