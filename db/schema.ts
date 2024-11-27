import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
export const sessionCookies = sqliteTable("session_cookies", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  cookie: text("cookie"),
  accountType: text("accountType", {
    enum: ["admin", "user"],
  }).default("user"),
  timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
});
