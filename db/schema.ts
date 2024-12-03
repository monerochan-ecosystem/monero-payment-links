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

export type NewSessionCookie = typeof sessionCookies.$inferInsert;

export const wallets = sqliteTable("wallets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  walletName: text("walletName"),
  primaryAddress: text("primaryAddress"),
  secretViewKey: text("walletName"),
  daemonURL: text("daemonURL"),
  start_height: integer("start_height"),
  timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
});
export type NewWallet = typeof wallets.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
