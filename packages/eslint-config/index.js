const prettierConfig = require("@spoddify-mopped/prettier-config");

module.exports = {
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
    "plugin:import/typescript",
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: "module",
  },
  rules: {
    "@typescript-eslint/no-unused-vars": "error",
    "prefer-const": "error",
    "no-unused-expressions": "error",
    "no-unused-labels": "error",
    camelcase: "warn",
    eqeqeq: "error",
    "no-duplicate-imports": "error",
    "prefer-template": "error",
    "sort-imports": "error",
    "sort-keys": "error",
    "prettier/prettier": ["error", prettierConfig],
  },
};
