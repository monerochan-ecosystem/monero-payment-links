import { html, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { sidebar } from "./components/sidebar";
import { mainStyles } from ".";

export function paymentLinks(mini: Mini<Loggedin>) {
  return mini.html`${mainStyles} ${paymentLinksStyles}
  <div class="layout-container">
   ${sidebar} 
   <main class="main-content payment-links-section">
       <div class="payment-links-header">
      <h1>Payment Links</h1>
      <button class="create-link-btn">+ Create Payment Link</button>
    </div>

  <div class="payment-links-list">
      <div class="payment-link-card">
        <div class="payment-link-status invoice"></div>
        <div class="payment-link-info">
          <h3>Product Launch Package <span class="invoice-badge">Invoice</span></h3>
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
      </div>

      <div class="payment-link-card">
        <div class="payment-link-status active"></div>
        <div class="payment-link-info">
          <h3>Basic Membership <span class="product-badge">Product</span></h3>
          <p class="payment-link-url">https://pay.example.com/basic-membership</p>
          <div class="payment-link-details">
            <span>0.1 XMR</span>
            <span>•</span>
            <span>12 payments received</span>
          </div>
        </div>
        <button class="copy-link-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>

      <div class="payment-link-card">
        <div class="payment-link-status active"></div>
        <div class="payment-link-info">
          <h3>Monthly Subscription <span class="product-badge">Product</span></h3>
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
      </div>
      
      <div class="payment-link-card">
        <div class="payment-link-status"></div>
        <div class="payment-link-info">
          <h3>Pro Membership <span class="product-badge">Product</span></h3>
          <p class="payment-link-url">https://pay.example.com/pro-membership</p>
          <div class="payment-link-details">
            <span>1.0 XMR</span>
            <span>•</span>
            <span>Inactive</span>
          </div>
        </div>
        <button class="copy-link-btn">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
          </svg>
        </button>
      </div>
    </div>









   </div></div>`;
}

const paymentLinksStyles = html`<style>
  .payment-links-section {
    display: flex;
    flex-direction: column;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }
  .payment-links-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .payment-links-header h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  .create-link-btn {
    background: var(--accent);
    border: none;
    color: var(--text);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    z-index: 50;
    border-radius: 10px;
    padding: 1rem 2rem;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .create-link-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
  }
  @media (max-width: 768px) {
    .create-link-btn {
      bottom: 90px;
    }
  }

  .payment-links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .payment-link-card {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
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