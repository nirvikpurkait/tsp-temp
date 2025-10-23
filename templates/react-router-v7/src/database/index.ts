import { drizzle } from "drizzle-orm/mysql2";
import { env } from "@/utils/env";

const db = drizzle({ connection: { uri: env.DATABASE_URL }, logger: true });

export { db };
