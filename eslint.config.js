<<<<<<< HEAD
﻿﻿import js from "@eslint/js";
=======
import js from "@eslint/js";
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
<<<<<<< HEAD
import react from "eslint-plugin-react";
import jsxA11y from "eslint-plugin-jsx-a11y";
import perfectionist from "eslint-plugin-perfectionist";
import security from "eslint-plugin-security";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default [
  { ignores: ["dist", "dev-dist", "node_modules", "eslint.config.js", "*.config.js", "*.config.ts", "*.config.cjs", "supabase/**", "firebase-functions/**", "scripts/**/*.cjs", "scripts/**/*.js", "scripts/combined-audit.ts", "scripts/detect-contract-mismatches.ts"] },
  js.configs.recommended,
  {
    files: ["**/*.{js,jsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      perfectionist,
      security,
      import: importPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": ["warn", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": "warn",
      "react/self-closing-comp": "warn",
      "react/no-array-index-key": "warn",
      "react/no-children-prop": "error",
      "react/no-danger": "error",
      "react/no-deprecated": "error",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/require-default-props": "off",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/html-has-lang": "warn",
      "jsx-a11y/iframe-has-title": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-distracting-elements": "error",
      "jsx-a11y/no-redundant-roles": "warn",
      "perfectionist/sort-imports": ["warn", {
        type: "natural",
        order: "asc",
        groups: [
          "type",
          ["builtin", "external"],
          "internal-type",
          "internal",
          ["parent-type", "sibling-type", "index-type"],
          ["parent", "sibling", "index"],
          "side-effect",
          "style",
          "object",
          "unknown",
        ],
        "newlinesBetween": "always",
      }],
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "error",
      "no-var": "error",
      "prefer-const": "warn",
      "no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
      "import/first": "error",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "error",
    },
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["**/*.{ts,tsx}"],
  })),
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      "jsx-a11y": jsxA11y,
      perfectionist,
      security,
      "@typescript-eslint": tseslint.plugin,
      import: importPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: ["./tsconfig.eslint.json"],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      ...react.configs.flat.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/jsx-boolean-value": ["error", "never"],
      "react/jsx-curly-brace-presence": ["warn", "never"],
      "react/jsx-fragments": ["error", "syntax"],
      "react/jsx-no-useless-fragment": "warn",
      "react/self-closing-comp": "warn",
      "react/no-array-index-key": "warn",
      "react/no-children-prop": "error",
      "react/no-danger": "error",
      "react/no-deprecated": "error",
      "react/no-unescaped-entities": "off",
      "react/no-unknown-property": "error",
      "react/prop-types": "off",
      "react/react-in-jsx-scope": "off",
      "react/require-default-props": "off",
      "jsx-a11y/alt-text": "warn",
      "jsx-a11y/anchor-has-content": "warn",
      "jsx-a11y/anchor-is-valid": "warn",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/heading-has-content": "warn",
      "jsx-a11y/html-has-lang": "warn",
      "jsx-a11y/iframe-has-title": "warn",
      "jsx-a11y/img-redundant-alt": "warn",
      "jsx-a11y/no-access-key": "warn",
      "jsx-a11y/no-distracting-elements": "error",
      "jsx-a11y/no-redundant-roles": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
      }],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-inferrable-types": "warn",
      "@typescript-eslint/no-non-null-assertion": "warn",
      "@typescript-eslint/prefer-as-const": "error",
      "@typescript-eslint/prefer-optional-chain": "warn",
      "@typescript-eslint/prefer-nullish-coalescing": "warn",
      "import/first": "error",
      "import/newline-after-import": "warn",
      "import/no-duplicates": "error",
      "import/no-unresolved": "off",
      // "import/order": ["warn", {
      //   groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
      //   "newlines-between": "always",
      //   alphabetize: { order: "asc", caseInsensitive: true },
      // }],
      "perfectionist/sort-imports": ["warn", {
        type: "natural",
        order: "asc",
        groups: [
          "type",
          ["builtin", "external"],
          "internal-type",
          "internal",
          ["parent-type", "sibling-type", "index-type"],
          ["parent", "sibling", "index"],
          "side-effect",
          "style",
          "object",
          "unknown",
        ],
        "newlinesBetween": "always",
      }],
      "security/detect-object-injection": "warn",
      "security/detect-non-literal-regexp": "warn",
      "security/detect-unsafe-regex": "warn",
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-debugger": "warn",
      "no-var": "error",
      "prefer-const": "warn",
    },
  },
  {
    files: ["**/*.test.{ts,tsx}", "**/*.spec.{ts,tsx}"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "security/detect-object-injection": "off",
    },
  },
  {
    files: ["src/pages/admin/AdminSettings.tsx", "src/pages/admin/ArticlesList.tsx", "src/pages/admin/CategoriesManager.tsx", "src/pages/admin/MediaLibrary.tsx", "src/pages/admin/UsersManager.tsx", "src/pages/AdminDashboard.tsx"],
    rules: {
      "react/no-array-index-key": "off",
    },
  },
  prettier,
];
=======

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
);
>>>>>>> b65705b24288fc0f8b6de278730f2ab0c24fbf46
