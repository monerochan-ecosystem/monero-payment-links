import type { MiniHtmlString } from "@spirobel/mininext";
import * as stripe from "./stripe";

export type Theme = {
  // checkout
  checkoutStyles: MiniHtmlString;
  paymentStatusStyles: MiniHtmlString;
  outOfStockStyles: MiniHtmlString;
  invoicePaidStyles: MiniHtmlString;
  walletNotDetectedStyles: MiniHtmlString;

  // dashboard
  mainStyles: MiniHtmlString;
  sidebarStyles: MiniHtmlString;
  walletStyles: MiniHtmlString;
  paymentLinksStyles: MiniHtmlString;
  transactionsListStyles: MiniHtmlString;
  paymentLinkDetailStyles: MiniHtmlString;
  emptyPaymentLinksStyles: MiniHtmlString;
  noWalletsPaymentsCardStyles: MiniHtmlString;
  createPaymentLinkFormStyles: MiniHtmlString;
  paymentTypeSelectionStyles: MiniHtmlString;
  formTabStyles: MiniHtmlString;
  walletFormStyles: MiniHtmlString;
  loginStyles: MiniHtmlString;
};

const themes: Record<string, Theme> = {
  stripe: stripe as Theme,
} as const;

export type ThemeName = keyof typeof themes;

const ACTIVE_THEME: ThemeName = "stripe";

export function getTheme(req:Request): Theme {
  return themes[ACTIVE_THEME] as Theme;
}

