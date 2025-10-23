import { generateId } from "@/utils/id";
import {
  int,
  mysqlTable,
  mysqlEnum,
  varchar,
  char,
} from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: char({ length: 8 })
    .notNull()
    .unique()
    .primaryKey()
    .$default(() => generateId()),
  name: varchar({ length: 255 }).notNull(),
  age: int().notNull(),
  email: varchar({ length: 255 }).notNull(),
  role: mysqlEnum(["basic", "admin"]),
});
