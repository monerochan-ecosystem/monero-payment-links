import { html, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../../users/loginLogout";
import type { PaymentLink } from "../../../db/schema";

export function paymentLinkCardInList(
  mini: Mini<Loggedin>,
  paymentLink: PaymentLink
) {
  if (paymentLink.linkType === "invoice") {
    return mini.html`
      <a class="payment-link-card" href="/payment-link?id=${paymentLink.id}">
        <div class="payment-link-status invoice"></div>
        <div class="payment-link-info">
          <h3>${
            paymentLink.invoiceTitle || "Unnamed Invoice"
          } <span class="invoice-badge">Invoice</span></h3>
          <p class="payment-link-url">https://pay.example.com/launch-package</p>
          <div class="payment-link-details">
            <span>2.5 XMR</span>
            <span>•</span>
            <span>Due in 5 days</span>
          </div>
          <div class="due-date">Due on Sep 30, 2023</div>
        </div>
        <button class="copy-link-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </a>`;
  }
  return mini.html`
  <a class="payment-link-card" href="/payment-link?id=${paymentLink.id}">
        <div class="payment-link-status active"></div>
        <div class="payment-link-info">
          <h3>${
            paymentLink.productTitle || "Unnamed Product"
          } <span class="product-badge">Product</span></h3>
          <p class="payment-link-url">https://pay.example.com/monthly-sub</p>
          <div class="payment-link-details">
            <span>0.5 XMR</span>
            <span>•</span>
            <span>24 payments received</span>
          </div>
        </div>
        <button class="copy-link-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </a>`;
}

export const paymentLinksCardStyles = html`<style>
  .payment-link-card {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  .payment-link-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
  }
  .payment-link-status {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #6b7280; /* Default grey for inactive */
  }

  .payment-link-status.active {
    background: #10b981;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  }

  .payment-link-status.invoice {
    background: #8b5cf6;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
  }

  .payment-link-info {
    flex: 1;
  }

  .payment-link-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
  }

  .payment-link-url {
    color: var(--accent);
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
  }

  .payment-link-details {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: rgba(248, 250, 252, 0.8);
  }

  .copy-link-btn {
    background: rgba(124, 58, 237, 0.2);
    border: none;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-link-btn:hover {
    background: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }
  .payment-link-status.invoice {
    background: #8b5cf6;
    box-shadow: 0 0 12px rgba(139, 92, 246, 0.4);
  }

  .payment-link-status.paid {
    background: #10b981;
    box-shadow: 0 0 12px rgba(16, 185, 129, 0.4);
  }

  .payment-link-status.overdue {
    background: #ef4444;
    box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
  }

  .invoice-badge,
  .product-badge {
    font-size: 0.75rem;
    padding: 0.25rem 0.5rem;
    border-radius: 9999px;
    margin-left: 0.5rem;
    font-weight: 500;
  }

  .invoice-badge {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
  }

  .product-badge {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }
</style>`;
