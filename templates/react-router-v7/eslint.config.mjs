import storybook from "eslint-plugin-storybook";
import parserTs from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";

/** @type {import("eslint").Linter.Config[]} */

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      "storybook-static",
      ".react-router",
      "build/**",
      "prettier.config.js",
    ],
  },
  ...storybook.configs["flat/recommended"],
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: parserTs,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json",
      },
    },
    plugins: {
      "@typescript-eslint": pluginTs,
    },
    rules: {
      ...pluginTs.configs.recommended.rules,
    },
  },
  {
    files: [
      "./src/**/*.ts",
      "./src/**/*.tsx",
      "./src/**/*.js",
      "./src/**/*.jsx",
    ],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "./*", ".", ".."],
              message:
                "\nUse `@/{filepath}` for consistency when importing modules.",
            },
          ],
          paths: [
            {
              name: "react-router",
              importNames: ["Link"],
              message: "🚫 Import `{ Link }` from '@/lib/link' instead.",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
