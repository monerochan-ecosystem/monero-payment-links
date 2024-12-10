import { sql } from "drizzle-orm";
import {
  text,
  integer,
  sqliteTable,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";
import { z } from "zod";

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

export const WalletSchema = z.object({
  id: z.number().int().optional(),
  walletName: z.string().max(20).nullish(),
  primaryAddress: z.string().min(95).max(95).optional(),
  secretViewKey: z.string().min(20).max(100).optional(),
  daemonURL: z.string().max(500).nullish(),
  start_height: z.number().int().nullish(),
});
export type NewWallet = typeof wallets.$inferInsert;
export type Wallet = typeof wallets.$inferSelect;
