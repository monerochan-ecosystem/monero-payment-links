import {
  createRouter,
  html,
  type MiniHtmlString,
  type Params,
} from "@spirobel/mininext";
import { sidebar } from "./sidebar";
import { walletGrid } from "./wallets/wallets_list";
import { paymentLinksList } from "./payment_links/payment_links_list";
import { createPaymentLinkForm } from "./payment_links/payment_link_form";
import { paymentLinkDetailRoute as paymentLinkDetailRouteContent } from "./payment_links/payment_link_detail";
import {
  noWalletsGuidance,
  paymentLinksEmpty,
} from "./payment_links/payment_links_empty";
import { createWalletForm, createWalletSlotForm } from "./wallets/wallets_form";
import { createNodeUrlForm } from "./wallets/nodeurl_form";
import { transactionsList } from "./transactions/transactions_list";

export function dashboardFrontendRoute(
  params?: Params<"/wallets/new/:wallet_creation_tool">,
): MiniHtmlString {
  if (params?.wallet_creation_tool) {
    // if there is no browser extension we open the manual dialog
    router.navigate("/wallets");
    window.editWallet();
  }
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content">
      ${walletGrid} ${createWalletForm} ${createWalletSlotForm}
      ${createNodeUrlForm}
    </main>
  </div>`;
}
export function paymentLinksRoute(): MiniHtmlString {
  const scanSettings = window.dashboardData.scan_settings;
  const walletList = scanSettings?.wallets || [];
  const paymentLinks = window.dashboardData.payment_links || [];
  const hasWallets = walletList.length > 0;
  const hasPaymentLinks = paymentLinks.length > 0;

  const paymentLinksContent = html`<div>
    <button class="create-link-btn" onclick="openPaymentLinkForm()">
      + Create Payment Link
    </button>
    ${createPaymentLinkForm}
    ${hasPaymentLinks ? paymentLinksList : paymentLinksEmpty}
  </div> `;

  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content payment-links-section">
      ${!hasWallets ? noWalletsGuidance : paymentLinksContent}
    </main>
  </div>`;
}

export function transactionsRoute(): MiniHtmlString {
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content">
      ${transactionsList}
    </main>
  </div>`;
}

const routes = {
  "/wallets/new/:wallet_creation_tool": (
    params: Params<"/wallets/new/:wallet_creation_tool">,
  ) => dashboardFrontendRoute(params),
  "/wallets": dashboardFrontendRoute,
  "/transactions": transactionsRoute,
  "/payment-links": paymentLinksRoute,
  "/payment-links/:id": (
    params: Params<"/payment-links/:id">,
  ): MiniHtmlString => {
    const detailContent = paymentLinkDetailRouteContent(params);
    return html`<div class="layout-container">
      ${sidebar}
      <main class="main-content">
        ${createPaymentLinkForm} ${detailContent}
      </main>
    </div>`;
  },
} as const;
export const router = createRouter(routes);

// only navigate to default route if we're at the root hash
if (
  !window.location.hash ||
  window.location.hash === "#" ||
  window.location.hash === ""
) {
  router.navigate("/payment-links");
}
