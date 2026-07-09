import type { MiniHtmlString } from "@spirobel/mininext";
import * as stripe from "./stripe";

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

const themes: Record<string, Theme> = {
  stripe: stripe as Theme,
} as const;

export type ThemeName = keyof typeof themes;

const ACTIVE_THEME: ThemeName = "stripe";

export function getTheme(req:Request): Theme {
  return themes[ACTIVE_THEME] as Theme;
}

