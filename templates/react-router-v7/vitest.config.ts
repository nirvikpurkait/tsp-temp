import { defineConfig, mergeConfig } from "vitest/config";
import viteConfig from "./vite.config";

export default mergeConfig(
  viteConfig,
  defineConfig({
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
  })
);
