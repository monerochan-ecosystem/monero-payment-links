import { html, Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { sidebar } from "./components/sidebar";
import { mainStyles } from ".";
import { db } from "../../db/db";
import { paymentLinks } from "../../db/schema";
import { eq } from "drizzle-orm";

export function paymentLinkDetailEndpoint(mini: Mini<Loggedin>) {
  const paymentLinkId = Number(mini.params.get("id"));
  if (!paymentLinkId) return mini.html`<h1>batch id not found</h1>`;
  const paymentLink = db
    .select()
    .from(paymentLinks)
    .where(eq(paymentLinks.id, paymentLinkId))
    .get();
  return mini.html`
    <div class="layout-container">
     ${sidebar}
      ${mainStyles} ${paymentLinkDetailStyles}
      <div class="payment-link-detail">
        <div class="detail-header">
          <a href="/payment-links" class="back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Payment Links
          </a>
          <div class="detail-actions">
            <button class="edit-payment-link-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="detail-card">
          <h2>Product Launch Package</h2>
          <a class="payment-link-url" href="https://${mini.requrl.host}/launch-package">https://${mini.requrl.host}/launch-package</a>
          
          <div class="detail-stats">
            <div class="stat-card">
              <div class="stat-label">Total Received</div>
              <div class="stat-value">25.0 XMR</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Number of Payments</div>
              <div class="stat-value">10</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Payment Type</div>
              <div class="stat-value">One-time Invoice</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Due Date</div>
              <div class="stat-value">Sep 30, 2023</div>
            </div>
            <div class="stat-card">
              <div class="stat-label">Status</div>
              <div class="stat-value">
                <select class="form-input" name="status">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div class="payment-history">
          <h3>Payment History</h3>
          <div class="transactions-list">
            <div class="transaction-item">
              <div class="transaction-icon incoming">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="transaction-info">
                <div class="transaction-primary">
                  <span class="transaction-type">Payment Received!</span>
                  <span class="transaction-amount received">+2.5 XMR</span>
                </div>
                <div class="transaction-secondary">
                  <span class="transaction-date">2 hours ago</span>
                  <span class="transaction-address">from 742d...44e</span>
                  <span class="transaction-status confirmed">Confirmed</span>
                </div>
              </div>
            </div>

            <div class="transaction-item">
              <div class="transaction-icon incoming">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>
              <div class="transaction-info">
                <div class="transaction-primary">
                  <span class="transaction-type">Payment Received!</span>
                  <span class="transaction-amount received">+1.2 XMR</span>
                </div>
                <div class="transaction-secondary">
                  <span class="transaction-date">1 day ago</span>
                  <span class="transaction-address">from 123a...89b</span>
                  <span class="transaction-status confirmed">Confirmed</span>
                </div>
              </div>
            </div>

            <div class="transaction-item">
              <div class="transaction-icon incoming">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
              </div>

              <div class="transaction-info">
                <div class="transaction-primary">
                  <span class="transaction-type">Payment Received!</span>
                  <span class="transaction-amount received">+0.5 XMR</span>
                </div>
                <div class="transaction-secondary">
                  <span class="transaction-date">2 days ago</span>
                  <span class="transaction-address">from 456b...12c</span>
                  <span class="transaction-status confirmed">Confirmed</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>`;
}

const paymentLinkDetailStyles = html`<style>
  .payment-link-detail {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .transaction-item {
    position: relative;
    overflow: hidden;
  }

  .transaction-item:hover {
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }

  .transaction-icon.incoming {
    background: rgba(16, 185, 129, 0.15);
    color: #10b981;
    animation: pulseGlow 2s infinite;
  }

  .transaction-amount.received {
    color: #10b981;
    font-weight: 700;
    font-size: 1.25rem;
    text-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
  }

  .transaction-status.confirmed {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    padding: 0.25rem 0.75rem;
    border-radius: 999px;
    font-weight: 600;
  }

  @keyframes pulseGlow {
    0% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4);
    }
    70% {
      box-shadow: 0 0 0 10px rgba(16, 185, 129, 0);
    }
    100% {
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
    }
  }
  .transaction-sparkle {
    position: absolute;
    pointer-events: none;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    opacity: 0.5;
    background: linear-gradient(
      45deg,
      transparent 0%,
      rgba(16, 185, 129, 0.1) 45%,
      rgba(16, 185, 129, 0.2) 50%,
      rgba(16, 185, 129, 0.1) 55%,
      transparent 100%
    );
    background-size: 200% 100%;
    animation: shimmerEffect 2s infinite;
  }

  @keyframes shimmerEffect {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }

  @media (max-width: 768px) {
    .create-link-btn {
      bottom: 5rem;
    }
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    margin-bottom: 0.5rem;
    display: block;
    font-size: 0.875rem;
    color: var(--text);
    opacity: 0.8;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.1);
    color: var(--text);
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-input::placeholder {
    color: rgba(248, 250, 252, 0.5);
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  }

  .delete-btn {
    background: #dc2626;
    color: var(--text);
    border: none;
    padding: 1rem;
    border-radius: 8px;
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
  }

  .delete-btn:hover {
    background: #b91c1c;
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 8px;
    color: #fecaca;
  }

  .delete-warning.show {
    display: block;
  }

  .warning-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .warning-actions button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .cancel-delete {
    background: #374151;
    color: var(--text);
  }

  .cancel-delete:hover {
    background: #4b5563;
  }

  .confirm-delete {
    background: #dc2626;
    color: var(--text);
  }

  .confirm-delete:hover {
    background: #b91c1c;
  }

  .edit-dialog-overlay {
    display: none;
  }

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
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .create-link-btn:hover {
    background: var(--primary);
    transform: translateY(-2px);
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
    margin: 0 0 0.8rem 0;
    font-size: 0.875rem;
    text-decoration: none;
    display: block;
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

  .payment-link-dialog .dialog {
    max-width: 600px;
  }

  @media (max-width: 768px) {
    .payment-links-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }

    .payment-link-card {
      flex-direction: column;
      align-items: flex-start;
    }

    .copy-link-btn {
      align-self: flex-end;
    }
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .back-btn {
    padding: 30px 0 30px 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text);
    text-decoration: none;
    font-size: 0.875rem;
    opacity: 0.8;
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    opacity: 1;
  }

  .detail-card {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .detail-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
    border-radius: 8px;
    padding: 1rem;
  }

  .stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .payment-history {
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
    border-radius: 12px;
    padding: 1rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(124, 58, 237, 0.1);
  }

  .history-item:last-child {
    border-bottom: none;
  }

  .transactions-section {
    display: none;
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
    width: 100%;
  }

  .transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .transactions-header h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  .transactions-filter {
    width: 200px;
  }

  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .transaction-item {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
  }

  .transaction-item:hover {
    transform: translateY(-2px);
    transition: all 0.3s ease;
  }

  .transaction-icon.incoming {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
  }

  .transaction-icon.outgoing {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(239, 68, 68, 0.1);
    color: #ef4444;
  }

  .transaction-info {
    flex: 1;
  }

  .transaction-primary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .transaction-type {
    font-weight: 600;
  }

  .transaction-amount {
    font-weight: 600;
  }

  .transaction-secondary {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: rgba(248, 250, 252, 0.8);
  }

  .transaction-status {
    color: #10b981;
  }

  @media (max-width: 768px) {
    .transactions-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .transactions-filter {
      width: 100%;
    }

    .transaction-secondary {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
  .edit-payment-link-btn {
    background: rgba(255, 255, 255, 0.2);
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

  .edit-payment-link-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }
</style>`;
