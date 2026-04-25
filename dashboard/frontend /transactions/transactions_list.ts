import { html, flatten, type MiniHtmlString } from "@spirobel/mininext";
import { router } from "../dashboard_router";

export function transactionsList() {
  const checkoutSessions = window.dashboardData?.checkout_sessions || [];
  const paymentLinks = window.dashboardData?.payment_links || [];

  function timeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    const months = Math.floor(days / 30);
    if (months < 12) return `${months}mo ago`;
    const years = Math.floor(months / 12);
    return `${years}y ago`;
  }

  let transactionsListHtml: MiniHtmlString;
  if (checkoutSessions.length > 0) {
    const items: MiniHtmlString[] = checkoutSessions.map((tx: any) => {
      const txHashShort = tx.tx_hash
        ? `${tx.tx_hash.slice(0, 6)}...${tx.tx_hash.slice(-3)}`
        : "unknown";
      const link = paymentLinks.find(
        (l: any) => l.payment_link_id === tx.payment_link_id,
      );
      const linkTitle = link?.title || "Untitled";
      const detailUrl = link
        ? router.link("/payment-links/:id", { id: link.payment_link_id })
        : "#";

      return html`<a class="transaction-item" href="${detailUrl}">
        <div class="transaction-icon incoming">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
          </svg>
        </div>
        <div class="transaction-info">
          <div class="transaction-primary">
            <span class="transaction-type">${linkTitle}</span>
            <span class="transaction-amount received">+${tx.amount} XMR</span>
          </div>
          <div class="transaction-secondary">
            <span class="transaction-date">${timeAgo(tx.timestamp)}</span>
            <span class="transaction-address">tx ${txHashShort}</span>
            <span class="transaction-status confirmed">Confirmed</span>
          </div>
        </div>
      </a>`;
    });
    transactionsListHtml = flatten(
      items,
      (list) => html`<div class="transactions-list">${list}</div>`,
    );
  } else {
    transactionsListHtml = html`<div class="transactions-empty">
      <div class="transaction-icon incoming">
        <svg
          width="40"
          height="40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
        </svg>
      </div>
      <h3>No transactions yet</h3>
      <p>Successful payments will appear here once received.</p>
    </div>`;
  }

  return html`<div>
    ${transactionsListStyles}
    <div class="transactions-section">
      <div class="transactions-header">
        <h1>Transactions</h1>
      </div>
      ${transactionsListHtml}
    </div>
  </div>`;
}

const transactionsListStyles = html`<style>
  .transactions-section {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
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
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .transaction-item:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
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

  .transaction-amount.received {
    color: #10b981;
    font-weight: 600;
  }

  .transaction-secondary {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: rgba(248, 250, 252, 0.8);
  }

  .transaction-status.confirmed {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    padding: 0.125rem 0.5rem;
    border-radius: 9999px;
    font-size: 0.75rem;
    font-weight: 500;
  }

  .transaction-date {
    color: rgba(248, 250, 252, 0.6);
  }

  .transaction-address {
    font-family: monospace;
    color: rgba(248, 250, 252, 0.6);
  }

  .transactions-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 1rem;
    text-align: center;
    color: rgba(248, 250, 252, 0.6);
  }

  .transactions-empty h3 {
    margin: 0;
    color: var(--text);
  }

  .transactions-empty p {
    margin: 0;
    font-size: 0.875rem;
  }
</style>`;
