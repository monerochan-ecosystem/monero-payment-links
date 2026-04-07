import {
  createRouter,
  html,
  type MiniHtmlString,
  type Params,
} from "@spirobel/mininext";
import { sidebar } from "./sidebar";
import { walletGrid } from "./wallets";

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

const routes = {
  "/wallets/new/:wallet_creation_tool": (
    params: Params<"/wallets/new/:wallet_creation_tool">,
  ) => dashboardFrontendRoute(params),
  "/wallets": dashboardFrontendRoute,
  "/transactions": dashboardFrontendRoute,
  "/payment-links": dashboardFrontendRoute,
} as const;
export const router = createRouter(routes);
router.navigate("/wallets");
