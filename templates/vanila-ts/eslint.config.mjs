import parserTs from "@typescript-eslint/parser";
import pluginTs from "@typescript-eslint/eslint-plugin";
import tseslint from "typescript-eslint";


/** @type {import("eslint").Linter.Config[]} */

const eslintConfig = [
  {
    ignores: ["node_modules/**", "out/**", "build/**"],
  },
  ...tseslint.config({
    files: ["**/*.ts", "**/*.tsx"],
  }),

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
    files: ["./src/**/*.ts", "./src/**/*.tsx"],
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
        },
      ],
    },
  },
];

export default eslintConfig;
