import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

const isStorybook = process.env.STORYBOOK === "true";
const isTesting = process.env.NODE_ENV === "test";

export default defineConfig({
  plugins: [
    tsconfigPaths(),
    tailwindcss(),
    // use react router only if the process is not storybook and testing
    !isStorybook && !isTesting && reactRouter(),
  ],
});
