import type { Config } from "@react-router/dev/config";

export default {
  ssr: true,
  appDirectory: "src/app",
  prerender: () => {
    return ["/"];
  },
} satisfies Config;
