mocha-spec-output-reporter
==============================

A duplicate of Mocha's Spec Reporter, but also writes output to a JSON file, to pass along the results to future Grunt tasks.

To call:

./node_modules/mocha/bin/mocha  test/spec/successes_and_failures.js --reporter mocha-spec-output-reporter/ --output=tmp.txt

