module.exports = {
  env: {
    browser: false,
    commonjs: true,
    es2021: true,
    node: true,
  },
  extends: ['standard', 'eslint-config-prettier'],
  overrides: [],
  parserOptions: {
    ecmaVersion: 'latest',
  },
  rules: {
    'no-unused-vars': 'warn',
  },
};
