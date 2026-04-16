import type { DashboadData as DashboardData } from "./dashboard";
import { router } from "./frontend /dashboard_router";
import { html, renderRoot } from "@spirobel/mininext";
const container = document.getElementById("container");
if (!container) throw new Error("Could not find container element");
renderRoot({
  component: () =>
    html`<div style="height: 100%; width: 100%;">${router.component}</div>`,
  container,
});
export function getHydratedData(): DashboardData {
  const b64 = document.body.dataset.hydrate;
  if (!b64) throw new Error("No DashboadData to hydrate");
  return JSON.parse(atob(b64)) as DashboardData;
}

window.dashboardData = getHydratedData();

declare global {
  interface Window {
    dashboardData: DashboardData;
    switchActiveTab: () => void;
    createPaymentLink: () => void;
    clickOutsideClose: (e: Event) => void;
    editWallet(walletId: number | null): void;
  }
}
