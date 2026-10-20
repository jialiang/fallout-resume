import compat from "eslint-plugin-compat";
import globals from "globals";
import importX from "eslint-plugin-import-x";
import js from "@eslint/js";

import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["docs/"]),
  {
    files: ["src/**/*.js"],
    plugins: { compat },
    extends: [importX.flatConfigs.recommended],
    languageOptions: {
      // Baseline: the page must run on any browser with full ES2017 support.
      // The browsers themselves are listed under browserslist in package.json.
      ecmaVersion: 2017,
      sourceType: "module",
      globals: globals.browser,
    },
    rules: {
      "compat/compat": "error",
    },
  },
  {
    files: ["*.js"],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ["**/*.js"],
    plugins: { js },
    extends: ["js/recommended"],
  },
]);
