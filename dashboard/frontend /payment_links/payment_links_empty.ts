import { html, type MiniHtmlString } from "@spirobel/mininext";
import { paymentLinksStyles } from "./payment_links_list";

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
