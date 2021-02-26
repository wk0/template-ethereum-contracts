// Note on mocha and ESM
// could not have "type": "module" in package.json
// see https://stackoverflow.com/questions/64261239/mocha-tests-with-esm-support-for-native-es6-modules
// else it works : see https://alxgbsn.co.uk/2019/02/22/testing-native-es-modules-mocha-esm/
'use strict';
module.exports = {
  'allow-uncaught': true,
  diff: true,
  extension: ['js'],
  recursive: true,
  reporter: 'spec',
  slow: 300,
  spec: 'test/**/*.test.js',
  timeout: 20000,
  ui: 'bdd',
  watch: false,
  'watch-files': ['src/**/*.sol', 'test/**/*.js'],
};
