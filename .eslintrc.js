module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: [
    'react',
    '@typescript-eslint',
  ],
  rules: {
    'no-console': 0,
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'no-restricted-syntax': 0,
    'class-methods-use-this': 0,
    'react/jsx-filename-extension': 0,
  },
};
