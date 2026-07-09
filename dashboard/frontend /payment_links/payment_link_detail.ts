import {
  html,
  flatten,
  type MiniHtmlString,
  type Params,
} from "@spirobel/mininext";
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
          ? html`<div>
              <h2>${title}</h2>
              <p class="detail-description">${description}</p>
            </div>`
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
              <div class="info-payment-type">
                <span class="info-payment-type-label">Payment Type</span>
                <span class="info-payment-type-value">${paymentType}</span>
              </div>
              <div class="info-payment-status">
                <span class="info-payment-status-label">Payment Status</span>
                <span
                  class="info-payment-status-value ${isPaid
                    ? "paid"
                    : "unpaid"}"
                  >${isPaid ? "Paid" : "Unpaid"}</span
                >
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

