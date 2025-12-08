// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],

    // Language settings
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,     // allow process, __dirname, etc.
        ...globals.browser,  // if you also run client-side code
      },
    },

    // Extend recommended JS rules correctly
    extends: [js.configs.recommended],

    rules: {
      // optional: remove 'process is not defined' errors completely
      "no-undef": "off",
    },
  },
]);
