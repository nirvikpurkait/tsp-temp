import { defineConfig } from "drizzle-kit";
import { env } from "@/utils/env";

export default defineConfig({
  out: "./migration",
  schema: "./src/database/schema.ts",
  dialect: "mysql",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
  verbose: true,
  strict: true,
});
