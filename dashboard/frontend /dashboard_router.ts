import { createRouter, html, type MiniHtmlString } from "@spirobel/mininext";
import { sidebar } from "./sidebar";
import { walletGrid } from "./wallets";

export function dashboardFrontendRoute(): MiniHtmlString {
  const current_path = router.getCurrentPath();

  const mainContent = current_path.startsWith("/wallets") ? walletGrid() : "";
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content">${mainContent}</main>
  </div>`;
}

const routes = {
  "/wallets": dashboardFrontendRoute,
  "/transactions": dashboardFrontendRoute,
  "/payment-links": dashboardFrontendRoute,
} as const;
export const router = createRouter(routes);
router.navigate("/wallets");
