import type { MiniHtmlString } from "@spirobel/mininext";
import * as stripe from "./stripe";
import * as monero from "./monero";
import * as document from "./document";

export type Theme = {
  // checkout
  checkoutStyles: MiniHtmlString;
  paymentStatusStyles: MiniHtmlString;
  outOfStockStyles: MiniHtmlString;
  invoicePaidStyles: MiniHtmlString;
  walletNotDetectedStyles: MiniHtmlString;

  // login
  loginStyles: MiniHtmlString;

  // dashboard
  dashBoardStyles: MiniHtmlString;
};

// theme registry
const themes: Record<string, Theme> = {
  stripe: stripe as Theme,
  monero: monero as Theme,
  document: document as Theme,
} as const;

export type ThemeName = keyof typeof themes;

export const themeNames = Object.keys(themes);

export function getTheme(section: "checkout" | "dashboard" = "dashboard"): Theme {
  const key = section === "checkout" ? "THEME_CHECKOUT" : "THEME_DASHBOARD";
  const name = Bun.env[key] || "document";
  return themes[name] as Theme;
}