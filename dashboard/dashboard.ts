import { html } from "@spirobel/mininext";
import { checkAdminAndRedirect } from "./login";
import { mainStyles } from "./styles/common";
import {
  readScanSettings,
  type ScanSettingsOpened,
} from "@spirobel/monero-wallet-api";
import {
  getAllActivePaymentLinks,
  type CombinedPaymentLinkRow,
  getAllSuccessfulCheckoutSessions,
  type CheckoutSessionRow,
} from "../db";

export const dashboardSkeleton = await html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Admin Dashboard - Monero Payment Links</title>
    </head>
    <body data-hydrate="${null}">
      ${mainStyles}
      <script type="module" src="./frontend_main.ts"></script>
      <div id="container"></div>
    </body>
  </html> `.build();
export async function dashBoardRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  const scan_settings = await readScanSettings();
  const payment_links = await getAllActivePaymentLinks();
  const checkout_sessions = await getAllSuccessfulCheckoutSessions();
  const hydrate = btoa(
    JSON.stringify({ scan_settings, payment_links, checkout_sessions }),
  );
  return new Response(dashboardSkeleton.fill(hydrate));
}
export type DashboadData = {
  scan_settings?: ScanSettingsOpened;
  payment_links: CombinedPaymentLinkRow[];
  checkout_sessions?: CheckoutSessionRow[];
};
