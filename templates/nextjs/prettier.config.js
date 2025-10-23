// @ts-check
/**
 * @type {import('prettier').Config}
 */
const config = {
  trailingComma: "es5",
  tabWidth: 2,
  semi: true,
  singleQuote: false,
  endOfLine: "lf",
  plugins: ["prettier-plugin-tailwindcss"],
  tailwindFunctions: ["clsx", "cva"],
  tailwindStylesheet: "./src/styles/globals.css",
};

module.exports = config;
