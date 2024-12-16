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
  secretViewKey: text("secretViewKey"),
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

export const paymentLinks = sqliteTable("payment_links", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  productTitle: text("productTitle"),
  productDescription: text("productDescription"),
  invoiceTitle: text("invoiceTitle"),
  invoiceDescription: text("invoiceDescription"),
  amount: text("amount"),
  walletId: integer("walletId").references(() => wallets.id),
  dueDate: text("dueDate"),
  maxUses: integer("maxUses"),
  currentUses: integer("currentUses"),
  successUrl: text("successUrl"),
  status: text("status", {
    enum: ["active", "inactive"],
  }).default("active"),
  linkType: text("linkType", {
    enum: ["product", "invoice"],
  }).default("product"),
  timestamp: text("timestamp").default(sql`(CURRENT_TIMESTAMP)`),
});
export const PaymentLinkSchema = z.object({
  id: z.number().int().optional(),
  productTitle: z.string().max(100).optional(),
  productDescription: z.string().max(500).optional(),
  invoiceTitle: z.string().max(100).optional(),
  invoiceDescription: z.string().max(500).optional(),
  amount: z.string(),
  walletId: z.number().int(),
  dueDate: z.string().nullish(),
  maxUses: z.number().int().nullish(),
  successUrl: z.string().url().nullish(),
  status: z.enum(["active", "inactive"]).optional(),
  linkType: z.enum(["product", "invoice"]).optional(),
});

export type NewPaymentLink = typeof paymentLinks.$inferInsert;

export type PaymentLink = typeof paymentLinks.$inferSelect;
