mocha-standalone-spec-reporter
==============================

A duplicate of Mocha's Spec Reporter, but standalone (without spec's dependencies).

We really like the basic spec reporter but wanted to extend it as a custom third party
reporter for our app. Spec pulls in a number of required files, so this lumps them all
together into one stand alone reporter ready to be extended.
