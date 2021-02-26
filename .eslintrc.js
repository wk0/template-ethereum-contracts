module.exports = {
  root: true,
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
  },
  env: {
    commonjs: true,
  },
  extends: ['eslint:recommended', 'plugin:node/recommended', 'prettier'],
  rules: {
    'node/no-unsupported-features/es-syntax': 'disabled',
  },
};
