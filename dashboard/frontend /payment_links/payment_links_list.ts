import { html, flatten, type MiniHtmlString } from "@spirobel/mininext";

export function paymentLinksList() {
  const paymentLinks = window.dashboardData.payment_links || [];

  const renderPaymentLink = (link: any) => {
    const isProduct = link.linkType === "product";
    const statusClass = isProduct ? "active" : "invoice";
    const badgeClass = isProduct ? "product-badge" : "invoice-badge";
    const badgeText = isProduct ? "Product" : "Invoice";
    const amount = link.amount ? `${link.amount} XMR` : "0 XMR";
    const title = link.title || "Untitled";

    // Generate payment link URL
    const linkUrl = `/payment-link?id=${link.payment_link_id}`;

    // Determine details based on type
    let detailsHtml: MiniHtmlString;
    if (isProduct) {
      const paymentCount = link.currentUses || 0;
      detailsHtml = html`<div class="payment-link-details">
        <span>${amount}</span>
        <span>•</span>
        <span
          >${paymentCount} payment${paymentCount !== 1 ? "s" : ""}
          received</span
        >
      </div>`;
    } else {
      // Invoice with due date
      const dueDate = link.dueDate
        ? new Date(link.dueDate).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        : "No due date";
      detailsHtml = html`<div class="payment-link-details">
        <span>${amount}</span>
        <span>•</span>
        <span>Due on ${dueDate}</span>
      </div>`;
    }

    return html`<a class="payment-link-card" href="${linkUrl}">
      <div class="payment-link-status ${statusClass}"></div>
      <div class="payment-link-info">
        <h3>${title} <span class="${badgeClass}">${badgeText}</span></h3>
        <p class="payment-link-url">
          https://pay.example.com/${link.payment_link_id}
        </p>
        ${detailsHtml}
      </div>
      <button
        class="copy-link-btn"
        onclick="event.preventDefault(); navigator.clipboard.writeText('https://pay.example.com/${link.payment_link_id}'); this.textContent='Copied!'; setTimeout(() => this.textContent='', 2000);"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
          <path
            d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"
          ></path>
        </svg>
      </button>
    </a>`;
  };

  return html`<div>
    ${() => {
      const linkElementList: MiniHtmlString[] = [];
      for (const link of paymentLinks) {
        linkElementList.push(renderPaymentLink(link));
      }
      return flatten(
        linkElementList,
        (l) => html`<div class="payment-links-list">${l}</div>`,
      );
    }}
    ${paymentLinksStyles}
  </div>`;
}

export const paymentLinksStyles = html`<style>
  .payment-links-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 20 auto;
  }
  .payment-links-header {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  .payment-links-header h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }
  .create-link-btn {
    z-index: 100;
    background: var(--accent);
    border: none;
    color: var(--text);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
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
  .payment-links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
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

  .payment-link-dialog .dialog {
    max-width: 600px;
  }

  @media (max-width: 768px) {
    .payment-links-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
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
