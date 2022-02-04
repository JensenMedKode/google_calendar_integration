const unusedImports = {
  plugin: "unused-imports",
  rules: {
    "no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-imports-ts": "error",
    "unused-imports/no-unused-vars": [
      "warn",
      { vars: "all", varsIgnorePattern: "^_", args: "after-used", argsIgnorePattern: "^_" }
    ]
  }
};

const simpelSort = {
  plugin: "simple-import-sort",
  rules: {
    "simple-import-sort/imports": "error"
  }
};

const prettier = {
  plugin: "prettier",
  rules: {
    "prettier/prettier": ["error", {}]
  }
};

const activeImports = [simpelSort, unusedImports, prettier];

const final = {
  plugins: activeImports.map(x => x.plugin),
  extends: ["next/core-web-vitals"],
  rules: {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "off",

    ...activeImports.map(x => x.rules).reduce((x, acc) => ({ ...acc, ...x }), {})
  }
};

module.exports = final;
