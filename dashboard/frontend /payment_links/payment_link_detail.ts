import {
  html,
  flatten,
  type MiniHtmlString,
  type Params,
} from "@spirobel/mininext";
import { paymentLinksStyles } from "./payment_links_list";
import { router } from "../dashboard_router";

declare global {
  interface Window {
    showDeletePaymentLinkDialog: (
      paymentLinkId: string,
      linkType: string,
    ) => void;
    hideDeletePaymentLinkDialog: () => void;
    confirmDeletePaymentLink: () => void;
  }
}

let pendingDeletePaymentLinkId: string | null = null;
let pendingDeleteLinkType: string | null = null;

function showDeletePaymentLinkDialogCB(
  paymentLinkId: string,
  linkType: string,
) {
  pendingDeletePaymentLinkId = paymentLinkId;
  pendingDeleteLinkType = linkType;
  const overlay = document.getElementById(
    "delete-dialog-overlay",
  ) as HTMLDivElement;
  if (overlay) {
    overlay.style.display = "flex";
  }
}

function hideDeletePaymentLinkDialogCB() {
  const overlay = document.getElementById(
    "delete-dialog-overlay",
  ) as HTMLDivElement;
  if (overlay) {
    overlay.style.display = "none";
  }
  pendingDeletePaymentLinkId = null;
  pendingDeleteLinkType = null;
}

function confirmDeletePaymentLinkCB() {
  if (!pendingDeletePaymentLinkId || !pendingDeleteLinkType) return;

  fetch("deletePaymentLink", {
    method: "POST",
    body: JSON.stringify({
      paymentLinkId: pendingDeletePaymentLinkId,
      linkType: pendingDeleteLinkType,
    }),
  }).then(async (result) => {
    const response = await result.json();
    if (response.success) {
      router.navigate("/payment-links");
      window.location.reload();
    } else {
      console.error("Error deleting payment link:", response.error);
      hideDeletePaymentLinkDialogCB();
    }
  });
}

window.showDeletePaymentLinkDialog = showDeletePaymentLinkDialogCB;
window.hideDeletePaymentLinkDialog = hideDeletePaymentLinkDialogCB;
window.confirmDeletePaymentLink = confirmDeletePaymentLinkCB;

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
  const wallets = window.dashboardData?.scan_settings?.wallets || [];
  const matchedWallet = wallets.find(
    (w: any) => w.primary_address === paymentLink.wallet_primary_address,
  );
  const walletName = matchedWallet?.wallet_name || "Unnamed Wallet";
  const walletShort = paymentLink.wallet_primary_address
    ? `${paymentLink.wallet_primary_address.slice(0, 6)}...${paymentLink.wallet_primary_address.slice(-6)} (${walletName})`
    : "N/A";

  const checkoutSessions = window.dashboardData?.checkout_sessions || [];
  const transactions = checkoutSessions.filter(
    (session: any) =>
      session.payment_link_id === paymentLink.payment_link_id &&
      session.paid_status === 1,
  );
  const isPaid = transactions.length > 0;

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
  if (transactions.length > 0) {
    const items: MiniHtmlString[] = transactions.map((tx: any) => {
      const txHash = tx.tx_hash || null;
      const txHashShort = txHash
        ? `${txHash.slice(0, 6)}...${txHash.slice(-3)}`
        : "unknown";
      const txHashLink = txHash
        ? html`<a
            class="transaction-hash-link"
            href="https://xmrchain.net/tx/${txHash}"
            target="_blank"
            rel="noopener noreferrer"
            >tx ${txHashShort}</a
          >`
        : html`<span class="transaction-hash">tx ${txHashShort}</span>`;
      return html`<div class="transaction-item">
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
            <span class="transaction-type">Payment Received</span>
            <span class="transaction-amount received">+${tx.amount} XMR</span>
          </div>
          <div class="transaction-secondary">
            <span class="transaction-date">${timeAgo(tx.timestamp)}</span>
            ${txHashLink}
            <span class="transaction-status confirmed">Confirmed</span>
          </div>
        </div>
      </div>`;
    });
    transactionsListHtml = flatten(
      items,
      (list) => html`<div class="transactions-list">${list}</div>`,
    );
  } else {
    transactionsListHtml = html`<div class="transactions-list">
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
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
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
    </div>`;
  }

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
          <button
            class="delete-payment-link-btn"
            title="Delete payment link"
            onclick="showDeletePaymentLinkDialog('${paymentLinkId}', '${paymentLink.linkType}')"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <polyline points="3 6 5 6 21 6"></polyline>
              <path
                d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"
              ></path>
              <line x1="10" y1="11" x2="10" y2="17"></line>
              <line x1="14" y1="11" x2="14" y2="17"></line>
            </svg>
          </button>
        </div>
      </div>

      <div class="detail-card${isProduct ? "" : " invoice"}">
        ${isProduct
          ? html`<div><h2>${title}</h2>
                 <p class="detail-description">${description}</p></div>`
           : html`<div class="info-box">
                   <div class="info-title">${title}</div>
                   <div class="info-amount">${amount}</div>
                   ${dueDate !== "N/A"
                     ? html`<div class="info-due-date">Due on ${dueDate}</div>`
                     : ""}
                   ${description
                     ? html`<div class="info-description">${description}</div>`
                     : ""}
                   <div class="info-wallet">
                     <span class="info-wallet-label">Receiving Wallet</span>
                     <span class="info-wallet-address">${walletShort}</span>
                   </div>
                   <div class="info-payment-status">
                     <span class="info-payment-status-label">Payment Status</span>
                     <span class="info-payment-status-value ${isPaid ? "paid" : "unpaid"}">${isPaid ? "Paid" : "Unpaid"}</span>
                   </div>
                 </div>`}
        <div class="payment-link-url-row">
          <a
            class="payment-link-url"
            href="${location.origin}/pay/${paymentLinkId}"
          >
            ${location.origin}/pay/${paymentLinkId}
          </a>
          <button
            class="copy-link-btn"
            onclick="event.preventDefault(); const btn=this; const original=btn.innerHTML; navigator.clipboard.writeText('${location.origin}/pay/${paymentLinkId}'); btn.textContent='Copied!'; setTimeout(() => { btn.innerHTML=original; }, 2000);"
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
        </div>
        ${isProduct
          ? html`<div class="detail-stats">
              <div class="stat-card">
                <div class="stat-label">Amount</div>
                <div class="stat-value">${amount}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Payment Type</div>
                <div class="stat-value">${paymentType}</div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Uses</div>
                <div class="stat-value">
                  ${currentUses}${maxUses !== "Unlimited" ? `/${maxUses}` : ""}
                </div>
              </div>
              <div class="stat-card">
                <div class="stat-label">Receiving Wallet</div>
                <div class="stat-value wallet-address">${walletShort}</div>
              </div>
            </div>`
          : ""}
      </div>

      <div class="payment-history">
        <h3>Payment History</h3>
        ${transactionsListHtml}
      </div>

      <div class="delete-dialog-overlay" id="delete-dialog-overlay">
        <div class="delete-dialog">
          <div class="delete-dialog-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
          </div>
          <h3>Delete Payment Link</h3>
          <p>
            <strong>Warning:</strong> This action cannot be undone. Deleting
            this payment link will permanently remove it and all associated
            data.
          </p>
          <div class="delete-dialog-actions">
            <button
              type="button"
              class="cancel-delete-btn"
              onclick="hideDeletePaymentLinkDialog()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="confirm-delete-btn"
              onclick="confirmDeletePaymentLink()"
            >
              Delete Permanently
            </button>
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

  .detail-card.invoice {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .detail-card .info-box {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .detail-card .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .detail-card .info-amount {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    background: linear-gradient(135deg, #fff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .detail-card .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: rgba(248, 250, 252, 0.8);
    white-space: pre-wrap;
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

  .payment-link-url-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0 1.5rem 0;
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

  .info-payment-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    font-size: 0.875rem;
  }

  .info-payment-status-label {
    color: rgba(248, 250, 252, 0.6);
  }

  .info-payment-status-value {
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-payment-status-value::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .info-payment-status-value.paid {
    color: #10b981;
  }

  .info-payment-status-value.paid::before {
    background: #10b981;
  }

  .info-payment-status-value.unpaid {
    color: rgba(248, 250, 252, 0.6);
  }

  .info-payment-status-value.unpaid::before {
    background: rgba(248, 250, 252, 0.4);
  }

  .info-due-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(248, 250, 252, 0.6);
    margin-bottom: 0.75rem;
  }

  .info-wallet {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    font-size: 0.875rem;
  }

  .info-wallet-label {
    color: rgba(248, 250, 252, 0.6);
  }

  .info-wallet-address {
    font-family: monospace;
    color: var(--accent);
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

  .transaction-amount.received {
    color: #10b981;
    font-weight: 600;
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

  .transaction-hash {
    font-family: monospace;
    color: rgba(248, 250, 252, 0.6);
  }

  .transaction-hash-link {
    font-family: monospace;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .transaction-hash-link:hover {
    color: #a78bfa;
    text-decoration: underline;
  }

  .edit-payment-link-btn {
    background: rgba(124, 58, 237, 0.2);
    border: 1px solid rgba(124, 58, 237, 0.3);
    color: var(--text);
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-payment-link-btn:hover {
    background: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }

  .delete-payment-link-btn {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-payment-link-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: translateY(-2px);
  }

  .delete-dialog-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(4px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }

  .delete-dialog {
    background: #1a1a2e;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 16px;
    padding: 2rem;
    max-width: 420px;
    width: 90%;
    text-align: center;
  }

  .delete-dialog-icon {
    color: #ef4444;
    margin-bottom: 1rem;
  }

  .delete-dialog h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }

  .delete-dialog p {
    color: rgba(248, 250, 252, 0.8);
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .delete-dialog-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .cancel-delete-btn {
    padding: 0.75rem 1.5rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }

  .cancel-delete-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .confirm-delete-btn {
    padding: 0.75rem 1.5rem;
    background: #ef4444;
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .confirm-delete-btn:hover {
    background: #dc2626;
    transform: translateY(-1px);
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
