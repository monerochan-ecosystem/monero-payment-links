import {
  createRouter,
  html,
  type MiniHtmlString,
  type Params,
} from "@spirobel/mininext";
import { sidebar } from "./sidebar";
import { walletGrid } from "./wallets";
import { paymentLinksList } from "./payment_links/payment_links_list";
import { createPaymentLinkForm } from "./payment_links/payment_link_form";
//import { getAllActivePaymentLinks } from "../../db";
import {
  noWalletsGuidance,
  paymentLinksEmpty,
} from "./payment_links/payment_links_empty";

export function dashboardFrontendRoute(
  params?: Params<"/wallets/new/:wallet_creation_tool">,
): MiniHtmlString {
  const current_path = router.getCurrentPath();

  const mainContent = current_path.startsWith("/wallets") ? walletGrid() : "";
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content">${mainContent}</main>
  </div>`;
}
export function paymentLinksRoute(): MiniHtmlString {
  //const paymentLinks = getAllActivePaymentLinks();
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content payment-links-section">${noWalletsGuidance}</main>
  </div>`;
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content payment-links-section">
      ${createPaymentLinkForm} ${paymentLinksEmpty}
    </main>
  </div>`;
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content payment-links-section">
      <div class="payment-links-header">
        <h1>Payment Links</h1>
      </div>

      ${createPaymentLinkForm} ${paymentLinksList}
    </main>
  </div>`;
}

const routes = {
  "/wallets/new/:wallet_creation_tool": (
    params: Params<"/wallets/new/:wallet_creation_tool">,
  ) => dashboardFrontendRoute(params),
  "/wallets": dashboardFrontendRoute,
  "/transactions": dashboardFrontendRoute,
  "/payment-links": paymentLinksRoute,
} as const;
export const router = createRouter(routes);
router.navigate("/wallets");
