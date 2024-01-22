module.exports = {
  root: true,
  extends: [
    "eslint:recommended",
    "airbnb",
    "airbnb-typescript/base",
    "prettier",
  ],
  parserOptions: {
    ecmaVersion: "latest",
    project: "./tsconfig.estlint.json",
    tsconfigRootDir: __dirname,
  },
  rules: {
    "import/extentions": "off",
  },
};
