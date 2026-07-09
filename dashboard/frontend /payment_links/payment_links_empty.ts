import { html, type MiniHtmlString } from "@spirobel/mininext";
import { router } from "../dashboard_router";

export function paymentLinksEmpty(): MiniHtmlString {
  return html` <div class="empty-payment-links-card">
    <div class="empty-payment-links-icon">
      <svg
        width="40"
        height="40"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
      </svg>
    </div>
    <h3 class="empty-payment-links-title">Create Your First Payment Link!</h3>
    <p class="empty-payment-links-description">
      Start accepting payments in minutes. Create a payment link for your
      product, service, or invoice and share it with your customers.
    </p>
    <button
      class="empty-payment-links-button"
      onclick="document.querySelector('.create-link-btn').click()"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
      Create Payment Link
    </button>
  </div>`;
}
export function noWalletsGuidance() {
  return html`<div class="guidance-card" id="no-wallets-guidance">
    <div class="guidance-icon">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="38"
        height="38"
        stroke-width="2"
        fill="white"
        class="bi bi-wallet"
        viewBox="0 0 16 16"
      >
        <path
          d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
        />
      </svg>
    </div>
    <h2 class="guidance-title">Connect a Wallet First</h2>
    <p class="guidance-text">
      To create and manage payment links, you'll need to connect a wallet. Head
      over to the Wallets section to get started.
    </p>
    <a href="${router.link("/wallets")}" class="guidance-cta">
      Go to Wallets
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
      >
        <path d="M5 12h14M12 5l7 7-7 7" />
      </svg>
    </a>
  </div>`;
}

