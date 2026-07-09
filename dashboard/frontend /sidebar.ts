import { html } from "@spirobel/mininext";
import { router } from "./dashboard_router";

function navigateTo(path: string) {
  router.navigate(path);
}

declare global {
  interface Window {
    navigateTo: (path: string) => void;
  }
}

window.navigateTo = navigateTo;

export function sidebar() {
  const current_path = router.getCurrentPath();
  return html`
    <nav class="sidebar">
      <div
        onclick="navigateTo('/wallets')"
        class="menu-item ${current_path.startsWith("/wallets") ? "active" : ""}"
      >
        <svg
          width="24"
          height="24"
          stroke-width="2"
          fill="white"
          class="bi bi-wallet"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
          />
        </svg>
        Wallets
      </div>

      <div
        onclick="navigateTo('/transactions')"
        class="menu-item ${current_path.startsWith("/transactions")
          ? "active"
          : ""}"
      >
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M7 16V4M7 4L3 8M7 4L11 8" />
          <path d="M17 8v12M17 20l4-4M17 20l-4-4" />
        </svg>
        Transactions
      </div>

      <div
        onclick="navigateTo('/payment-links')"
        class="menu-item ${current_path.startsWith("/payment-links")
          ? "active"
          : ""}"
      >
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
        Payment Links
      </div>
    </nav>
  `;
}
