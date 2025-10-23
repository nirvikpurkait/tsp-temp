import type { StorybookConfig } from "@storybook/react-vite";
import tailwindcss from "@tailwindcss/postcss";
import autoprefixer from "autoprefixer";
import { join } from "path";

const config: StorybookConfig = {
  stories: ["../../../src/**/*.stories.@(js|jsx|mjs|ts|tsx)"],

  addons: [
    "storybook-addon-remix-react-router",
    "@storybook/addon-docs",
    "@storybook/addon-a11y",
  ],

  framework: {
    name: "@storybook/react-vite",
    options: {},
  },

  staticDirs: ["../../../public"],

  core: {
    disableWhatsNewNotifications: true,
  },

  viteFinal: async (config) => {
    // tailwind config for storybook config location change
    config.css = config.css || {};
    config.css.postcss = {
      plugins: [tailwindcss(), autoprefixer()],
    };

    // typescript alias for storybook config location change
    const projectRootDir = join(__dirname, "../../../");
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      "@": join(projectRootDir, "src"),
      "@/route-types": join(__dirname, ".react-router/types/src/app"),
    };

    return config;
  },
};
export default config;
