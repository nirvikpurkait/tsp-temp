import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: "jsdom",
    globals: true,
    coverage: {
      include: ["src/**/*.ts", "src/**/*.tsx"],
      all: false,
    },
    setupFiles: ["./src/config/vitest/index.ts"],
    include: ["./src/**/*.test.*"],
    exclude: ["./src/tests/e2e/**/*.test.*"],
  },
});
