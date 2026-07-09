import { html } from "@spirobel/mininext";
import { checkAdminAndRedirect } from "./login";
import { getTheme } from "../theme/theme";
import {
  readScanSettings,
  type ScanSettingsOpened,
} from "@spirobel/monero-wallet-api";
import {
  getAllPaymentLinks,
  type CombinedPaymentLinkRow,
  getAllSuccessfulCheckoutSessions,
  type CheckoutSessionRow,
} from "../db";
import { SCAN_SETTINGS_PATH, getWallets } from "./backend/wallets";

export const dashboardSkeleton = await html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Admin Dashboard Monero Payment Links</title>
    </head>
    <body data-hydrate="${null}">
      ${null}
      <script type="module" src="./frontend_main.ts"></script>
      <div id="container"></div>
    </body>
  </html> `.build();
export async function dashBoardRoute(req: Request) {
  const theme = getTheme(req)
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  const scan_settings = await readScanSettings(SCAN_SETTINGS_PATH);
  const payment_links = await getAllPaymentLinks();
  const checkout_sessions = await getAllSuccessfulCheckoutSessions();
  const wallets = getWallets();
  const wallet_balances = wallets?.wallets.map((w) => ({
    primary_address: w.primary_address,
    spendable: w.amount.toString(),
    pending: w.pending_amount.toString(),
  })) || [];

  const hydrate = btoa(
    JSON.stringify({
      scan_settings,
      payment_links,
      checkout_sessions,
      wallet_balances,
    }),
  );
  return new Response(dashboardSkeleton.fill(hydrate, theme.dashBoardStyles));
}
export type WalletBalance = {
  primary_address: string;
  spendable: string;
  pending: string;
};

export type DashboadData = {
  scan_settings?: ScanSettingsOpened;
  payment_links: CombinedPaymentLinkRow[];
  checkout_sessions?: CheckoutSessionRow[];
  wallet_balances: WalletBalance[];
};
