module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ["plugin:react/recommended", "airbnb", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["react", "@typescript-eslint"],
  rules: {
    "no-console": 0,
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "no-restricted-syntax": [
      "error",
      {
        selector: "ForInStatement",
        message: "for..in loops iterate over the entire prototype chain, use Object.keys().forEach() or for..of instead."
      }
    ],
    "class-methods-use-this": 0,
    "react/jsx-filename-extension": 0,
    "react/require-default-props": 0,
    "no-nested-ternary": 0,
    "no-restricted-globals": 0,
    "no-multi-assign": 0,
    "no-continue": 0,
    "no-unused-vars": 0,
    "import/prefer-default-export": 0,
    "import/no-extraneous-dependencies": 0,
    "no-undef": 0,
    "no-empty": 0,
    "no-plusplus": 0,
    "no-loop-func": 0,
    "no-promise-executor-return": 0,
    "react/no-unused-prop-types": 0,
    "react/jsx-no-bind": 0,
    "react/destructuring-assignment": 0,
  },
};
