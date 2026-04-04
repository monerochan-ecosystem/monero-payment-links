import { createRouter, html, type MiniHtmlString } from "@spirobel/mininext";
import { sidebar } from "./sidebar";

export function dashboardFrontendRoute(): MiniHtmlString {
  return html` <div class="layout-container">
    ${sidebar}
    <main class="main-content"></main>
  </div>`;
}

const routes = {
  "/wallets": dashboardFrontendRoute,
  "/transactions": dashboardFrontendRoute,
  "/payment-links": dashboardFrontendRoute,
} as const;
export const router = createRouter(routes);
router.navigate("/wallets");
