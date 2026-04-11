import { html, type MiniHtmlString } from "@spirobel/mininext";
import { paymentLinksStyles } from "./payment_links_list";
import { router } from "../dashboard_router";

export function paymentLinksEmpty(): MiniHtmlString {
  return html` <div class="empty-payment-links-card">
    ${emptyPaymentLinksStyles} ${paymentLinksStyles}
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
    ${noWalletsPaymentsCardStyles}${paymentLinksStyles}
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

const emptyPaymentLinksStyles = html`<style>
  .empty-payment-links-card {
    background: rgba(124, 58, 237, 0.1);
    border: 2px dashed rgba(124, 58, 237, 0.3);
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    margin: 2rem auto;
    max-width: 500px;
    transition: all 0.3s ease;
  }

  .empty-payment-links-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .empty-payment-links-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    padding: 1rem;
    background: rgba(124, 58, 237, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    animation: float 3s ease-in-out infinite;
  }

  .empty-payment-links-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--accent), #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .empty-payment-links-description {
    color: var(--text);
    opacity: 0.8;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .empty-payment-links-button {
    background: var(--accent);
    color: var(--text);
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-payment-links-button:hover {
    background: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
</style>`;
const noWalletsPaymentsCardStyles = html`<style>
  .guidance-card {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: fadeInUp 0.5s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .guidance-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }
  .guidance-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }
  .guidance-text {
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }
  .guidance-cta {
    background: rgba(255, 255, 255, 0.15);
    color: var(--text);
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .guidance-cta:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>`;
