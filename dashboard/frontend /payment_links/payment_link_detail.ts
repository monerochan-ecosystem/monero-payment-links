import { html, type MiniHtmlString, type Params } from "@spirobel/mininext";
import { paymentLinksStyles } from "./payment_links_list";
import { router } from "../dashboard_router";

export function paymentLinkDetailRoute(
  params: Params<"/payment-links/:id">,
): MiniHtmlString {
  const paymentLinkId = params.id;

  if (!paymentLinkId) {
    return html`<div class="detail-container">
      <h1>Payment Link not found</h1>
    </div>`;
  }

  // Find the payment link in dashboardData
  const paymentLinks = window.dashboardData?.payment_links || [];
  const paymentLink = paymentLinks.find(
    (link: any) => link.payment_link_id === paymentLinkId,
  );

  if (!paymentLink) {
    return html`<div class="detail-container">
      <h1>Payment Link not found</h1>
    </div>`;
  }

  const isProduct = paymentLink.linkType === "product";
  const title = paymentLink.title || "Untitled";
  const description = paymentLink.description || "";
  const amount = paymentLink.amount ? `${paymentLink.amount} XMR` : "0 XMR";
  const paymentType = isProduct ? "Product" : "Invoice";
  const currentUses = paymentLink.currentUses || 0;
  const maxUses = paymentLink.maxUses || "Unlimited";
  const dueDate = paymentLink.dueDate || "N/A";

  const detailContent = html`<div>
    ${paymentLinkDetailStyles} ${paymentLinksStyles}
    <div class="detail-container">
      <div class="detail-header">
        <a href="${router.link("/payment-links")}" class="back-btn">
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to Payment Links
        </a>
        <div class="detail-actions">
          <button
            class="edit-payment-link-btn"
            title="Edit payment link"
            onclick="openPaymentLinkForm('${paymentLinkId}')"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <path
                d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
              />
              <path
                d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
              />
            </svg>
          </button>
        </div>
      </div>

      <div class="detail-card">
        <h2>${title}</h2>
        <p class="detail-description">${description}</p>
        <a
          class="payment-link-url"
          href="https://pay.example.com/${paymentLinkId}"
        >
          https://pay.example.com/${paymentLinkId}
        </a>

        <div class="detail-stats">
          <div class="stat-card">
            <div class="stat-label">Amount</div>
            <div class="stat-value">${amount}</div>
          </div>
          <div class="stat-card">
            <div class="stat-label">Payment Type</div>
            <div class="stat-value">${paymentType}</div>
          </div>
          ${isProduct
            ? html`<div class="stat-card">
                <div class="stat-label">Uses</div>
                <div class="stat-value">
                  ${currentUses}${maxUses !== "Unlimited" ? `/${maxUses}` : ""}
                </div>
              </div>`
            : html`<div class="stat-card">
                <div class="stat-label">Due Date</div>
                <div class="stat-value">${dueDate}</div>
              </div>`}
          <div class="stat-card">
            <div class="stat-label">Receiving Wallet</div>
            <div class="stat-value wallet-address">
              ${paymentLink.wallet_primary_address?.slice(
                0,
                6,
              )}...${paymentLink.wallet_primary_address?.slice(-6)}
            </div>
          </div>
        </div>
      </div>

      <div class="payment-history">
        <h3>Payment History</h3>
        <div class="transactions-list">
          <div class="transaction-item">
            <div class="transaction-icon incoming">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path
                  d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                />
              </svg>
            </div>
            <div class="transaction-info">
              <div class="transaction-primary">
                <span class="transaction-type">No payments yet</span>
              </div>
              <div class="transaction-secondary">
                <span class="transaction-status">Waiting for payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>`;

  return detailContent;
}

const paymentLinkDetailStyles = html`<style>
  .detail-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .detail-actions {
    display: flex;
    gap: 0.5rem;
  }

  .detail-card {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .detail-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
  }

  .detail-description {
    color: rgba(248, 250, 252, 0.8);
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  .payment-link-url {
    color: var(--accent);
    margin: 1rem 0 1.5rem 0;
    display: block;
    font-size: 0.875rem;
    word-break: break-all;
  }

  .detail-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
    gap: 1rem;
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
    font-size: 1.25rem;
    font-weight: 600;
    word-break: break-word;
  }

  .stat-value.wallet-address {
    font-size: 0.875rem;
    font-family: monospace;
  }

  .payment-history {
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
    border-radius: 12px;
    padding: 2rem;
  }

  .payment-history h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
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
  }

  .transaction-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .transaction-icon.incoming {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
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
    .detail-container {
      padding: 1rem;
    }

    .detail-header {
      gap: 1rem;
      align-items: flex-start;
    }

    .detail-stats {
      grid-template-columns: 1fr;
    }

    .transaction-secondary {
      flex-direction: column;
      gap: 0.25rem;
    }
  }
</style>`;
