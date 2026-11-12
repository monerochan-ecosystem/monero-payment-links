import type { DashboadData as DashboardData } from "./dashboard";
import { router } from "./frontend /dashboard_router";
import { html, renderRoot } from "@spirobel/mininext";
export function getHydratedData(): DashboardData {
  const b64 = document.body.dataset.hydrate;
  if (!b64) throw new Error("No DashboardData to hydrate");
  const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes)) as DashboardData;
}

window.dashboardData = getHydratedData();

const container = document.getElementById("container");
if (!container) throw new Error("Could not find container element");
renderRoot({
  component: () =>
    html`<div style="height: 100%; width: 100%;">${router.component}</div>`,
  container,
});

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
  }
}
