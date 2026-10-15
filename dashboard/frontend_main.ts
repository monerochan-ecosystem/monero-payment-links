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

function connectDashboardSocket() {
  const wsProtocol = location.protocol === "https:" ? "wss:" : "ws:";
  const ws = new WebSocket(`${wsProtocol}//${location.host}/ws`);
  let opened = false;
  ws.addEventListener("open", () => (opened = true));
  ws.addEventListener("message", (e) => {
    Object.assign(window.dashboardData, JSON.parse(e.data as string));
  });
  ws.addEventListener("close", () =>
    setTimeout(opened ? connectDashboardSocket : loginOrRetry, 1000),
  );
}

async function loginOrRetry() {
  try {
    const res = await fetch("/dashboard", { redirect: "manual" });
    const denied = res.type === "opaqueredirect" || res.status === 401 || (res.status >= 300 && res.status < 400);
    if (denied) {
      location.assign("/login");
      return;
    }
  } catch {}
  connectDashboardSocket();
}

connectDashboardSocket();

declare global {
  interface Window {
    dashboardData: DashboardData;
    switchActiveTab: () => void;
    createPaymentLink: () => void;
    clickOutsideClose: (e: Event) => void;
    editWallet(primary_address?: string): void;
    showDeleteDialog: () => void;
    hideDeleteDialog: () => void;
    confirmDeletion: () => void;
  }
}
