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
      const isInvoice = link?.linkType === "invoice";
      const typeBadgeClass = isInvoice ? "invoice-badge" : "product-badge";
      const typeBadgeText = isInvoice ? "Invoice" : "Product";
      const amountClass = isInvoice ? "invoice-amount" : "product-amount";

      return html`<a class="transaction-item" href="${detailUrl}">
        <div class="transaction-info">
          <div class="transaction-primary">
            <span class="transaction-type">${linkTitle}</span>
            <span class="transaction-amount ${amountClass}"
              >+${tx.amount} XMR</span
            >
          </div>
          <div class="transaction-secondary">
            <span class="transaction-date">${timeAgo(tx.timestamp)}</span>
            <span class="transaction-address">tx ${txHashShort}</span>
            <span class="transaction-status ${typeBadgeClass}"
              >${typeBadgeText}</span
            >
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
      <h3>No transactions yet</h3>
      <p>Successful payments will appear here once received.</p>
    </div>`;
  }

  return html`<div>
    <div class="transactions-section">
      ${checkoutSessions.length > 0
        ? html`<div class="transactions-header">
            <h1>Transactions</h1>
          </div>`
        : ""}
      ${transactionsListHtml}
    </div>
  </div>`;
}

