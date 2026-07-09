import { html } from "@spirobel/mininext";
import {
  openWallets,
  make001ToolLink,
  ADDRESS_VALID_RESPONSE,
  ADDRESS_INVALID_RESPONSE,
  convertAmountBigInt,
  readMerchantConfirmationsFromScanSettings,
} from "@spirobel/monero-wallet-api";
import QRCode from "qrcode";
import {
  createCheckoutSession,
  updateCheckoutSessionAddress,
  getCheckoutSessionBySessionId,
  getCheckoutSessionByAddress,
  getCheckoutSessionByPrimaryId,
  markAsPaid,
  updateTxConfirmations,
  updateTxHash,
  getPaymentLinkByPaymentLinkId,
  incrementPaymentLinkUses,
  getPaidCheckoutSessionByPaymentLinkId,
} from "./db";
import type { BunRequest } from "bun";
import { SCAN_SETTINGS_PATH, setWallets } from "./dashboard/backend/wallets";
import { getTheme } from "./theme/theme";

let ACCEPT_AFTER_CONFIRMATIONS = 10;

const storedConfirmations =
  await readMerchantConfirmationsFromScanSettings(SCAN_SETTINGS_PATH);
if (storedConfirmations !== undefined && storedConfirmations !== null) {
  ACCEPT_AFTER_CONFIRMATIONS = storedConfirmations;
}

const skeleton = await html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>checkout</title>
    </head>
    <body>
      ${null}
    </body>
  </html> `.build();

export function makeCheckoutRoutes() {
  return {
    ...skeleton.static_routes,
    "/pay/:paymentLinkId": { GET: payRoute },
    "/paymentstatus": { GET: paymentStatusRoute },
    "/monerochan001/:address": {
      GET: async (req: BunRequest<"/monerochan001/:address">) => {
        const sessionRow = await getCheckoutSessionByAddress(
          req.params.address,
        );
        if (!sessionRow[0]?.id) return Response.json(ADDRESS_INVALID_RESPONSE);
        return Response.json(ADDRESS_VALID_RESPONSE);
      },
    },
    "/": { GET: checkoutRoute },
    "/wallet_info": { GET: walletInfoRoute },
  };
}

const wallets = await openWallets({
  scan_settings_path: SCAN_SETTINGS_PATH,
  notifyMasterChanged: async (params) => {
    // sync payments on cache change
    // sync in any case to update confirmations
    await syncPaymentStatus();
  },
  autoRetry: true,

});
if (wallets) setWallets(wallets);
const mainwallet = wallets?.wallets[0];
async function syncPaymentStatus() {
  if (!mainwallet) return;
  for (const tx of mainwallet.transactions) {
    const txConfirmations = tx.confirmations;
    const checkout_session_row = await getCheckoutSessionByPrimaryId(
      tx.payment_id,
    );
    if (
      !checkout_session_row[0] || // no cechkout session for this tx
      checkout_session_row[0].paid_status === 1 || // already marked as paid
      (checkout_session_row[0].tx_hash && // tx_hash already set and different
        checkout_session_row[0].tx_hash !== tx.tx_hash) // tx_hash changed (only support 1 tx per session)
    )
      continue;

    if (!checkout_session_row[0].tx_hash) {
      await updateTxHash(tx.payment_id, tx.tx_hash);
    }

    // update current confirmation count
    await updateTxConfirmations(tx.payment_id, txConfirmations);

    if (!checkout_session_row[0].paid_status) {
      if (
        txConfirmations >= checkout_session_row[0].required_confirmations &&
        tx.amount >= convertAmountBigInt(checkout_session_row[0].amount)
      ) {
        await markAsPaid(tx.payment_id);

        if (checkout_session_row[0].payment_link_id) {
          await incrementPaymentLinkUses(
            checkout_session_row[0].payment_link_id,
          );
        }
      }
    }
  }
}
// sync payments on startup
await syncPaymentStatus();

async function getSuccessRedirectUrl(sessionRow: {
  session_id: string;
  paid_status: number;
  payment_link_id: string | null;
}): Promise<string | null> {
  if (!sessionRow.paid_status || !sessionRow.payment_link_id) return null;

  const paymentLink = (
    await getPaymentLinkByPaymentLinkId(sessionRow.payment_link_id)
  )[0];

  if (!paymentLink?.successUrl) return null;

  let successUrl = paymentLink.successUrl;
  if (successUrl.endsWith("checkoutId=")) {
    successUrl = successUrl + sessionRow.session_id;
  }
  return successUrl;
}

// this route is rendered as an iframe on the checkout page
// the refresh header means it will be reloaded every 1 second
// the result is a live experience without javascript in the frontend.
async function paymentStatusRoute(req: Request) {
  const theme = getTheme(req)
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("checkoutId");
  if (!sessionId) {
    return new Response(
      skeleton.fill(html`<h1>checkout session not found</h1>`),
    );
  }

  const sessionRow = (await getCheckoutSessionBySessionId(sessionId))[0];

  if (!sessionRow?.address) {
    return new Response(
      skeleton.fill(html`<h1>checkout session not found</h1>`),
    );
  }

  if (sessionRow.paid_status) {
    const redirectUrl = await getSuccessRedirectUrl(sessionRow);
    if (redirectUrl) {
      const content = html`
        <script>
          window.top.location.href = "${redirectUrl}";
        </script>
        <div class="payment-status success">
          <span>Payment received! Redirecting...</span>
          ${theme.paymentStatusStyles}
        </div>
      `;
      const headers = new Headers();
      headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
      headers.set("Pragma", "no-cache");
      headers.set("Expires", "0");
      return new Response(skeleton.fill(content), { headers });
    }
  }

  const statusClass = sessionRow.paid_status ? "success" : "pending";
  const statusText = sessionRow.paid_status
    ? html`<svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="margin-right: 8px;"
        >
          <path d="M20 6L9 17l-5-5" />
        </svg>
        <span>Payment received!</span>`
    : html`<svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          style="margin-right: 8px;"
        >
          <circle cx="12" cy="12" r="10" stroke-dasharray="4 4" />
        </svg>
        <span>
          Waiting for payment...
          (${sessionRow.tx_confirmations}/${sessionRow.required_confirmations}
          confirmations)
        </span>`;

  const content = html`
    <div class="payment-status ${statusClass}">
      ${statusText}${theme.paymentStatusStyles}
    </div>
  `;

  const headers = new Headers();
  headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
  headers.set("Pragma", "no-cache");
  headers.set("Expires", "0");
  headers.set("Refresh", "1");

  return new Response(skeleton.fill(content), { headers });
}

async function payRoute(req: BunRequest<"/pay/:paymentLinkId">) {
  const theme = getTheme(req)
  const paymentLinkId = req.params.paymentLinkId;

  if (!paymentLinkId) {
    return new Response(skeleton.fill(html`<h1>Invalid payment link</h1>`));
  }

  const paymentLinkRow = (
    await getPaymentLinkByPaymentLinkId(paymentLinkId)
  )[0];

  if (!paymentLinkRow) {
    return new Response(skeleton.fill(html`<h1>Payment link not found</h1>`));
  }

  const isExhausted =
    paymentLinkRow.linkType === "invoice"
      ? paymentLinkRow.currentUses >= 1
      : paymentLinkRow.maxUses !== null &&
        paymentLinkRow.currentUses >= paymentLinkRow.maxUses;

  if (isExhausted) {
    if (paymentLinkRow.linkType === "product") {
      const title = paymentLinkRow.title || "Product";
      const description = paymentLinkRow.description || "";
      const amount = paymentLinkRow.amount
        ? `${paymentLinkRow.amount} XMR`
        : "";
      const content = html`<div class="info-container">
        ${theme.outOfStockStyles}
        <div class="info-card">
          <div class="info-box">
            <div class="info-title">${title}</div>
            ${amount ? html`<div class="info-amount">${amount}</div>` : ""}
            ${description
              ? html`<div class="info-description">${description}</div>`
              : ""}
          </div>
          <p class="info-message">
            This product is currently out of stock. All available units have
            been purchased.
          </p>
        </div>
      </div>`;
      return new Response(skeleton.fill(content));
    } else {
      const title = paymentLinkRow.title || "Invoice";
      const description = paymentLinkRow.description || "";
      const amount = paymentLinkRow.amount
        ? `${paymentLinkRow.amount} XMR`
        : "";
      const paidSession = (
        await getPaidCheckoutSessionByPaymentLinkId(paymentLinkId)
      )[0];
      const txHash = paidSession?.tx_hash || null;
      const txHashShort = txHash
        ? `${txHash.slice(0, 6)}...${txHash.slice(-6)}`
        : null;
      const content = html`<div class="info-container">
        ${theme.invoicePaidStyles}
        <div class="info-card">
          <div class="info-box">
            <div class="info-title">${title}</div>
            ${amount ? html`<div class="info-amount">${amount}</div>` : ""}
            ${description
              ? html`<div class="info-description">${description}</div>`
              : ""}
            ${txHashShort
              ? html`<div class="info-tx">
                  <span class="info-tx-label">Transaction</span>
                  <a
                    class="info-tx-hash"
                    href="https://xmrchain.net/tx/${txHash}"
                    target="_blank"
                    rel="noopener noreferrer"
                    >${txHashShort}</a
                  >
                </div>`
              : ""}
          </div>
          <p class="info-message">This invoice has been paid.</p>
        </div>
      </div>`;
      return new Response(skeleton.fill(content));
    }
  }

  const secret = crypto.randomUUID();
  const insertedRow = (
    await createCheckoutSession(
      paymentLinkRow.amount,
      secret,
      ACCEPT_AFTER_CONFIRMATIONS,
      paymentLinkRow.payment_link_id,
    )
  )[0];

  if (!insertedRow)
    return new Response(skeleton.fill(html`<h1>no merchant db found</h1>`));
  if (!mainwallet)
    return new Response(skeleton.fill(html`<h1>no merchant wallet found</h1>`));

  const address = await mainwallet.makeIntegratedAddress(insertedRow.id);
  await updateCheckoutSessionAddress(insertedRow.session_id, address);

  const redirectUrl = `/?checkoutId=${insertedRow.session_id}`;
  const headers = new Headers();
  headers.set("Location", redirectUrl);
  return new Response(null, { status: 303, headers });
}

async function checkoutRoute(req: Request) {
  const theme = getTheme(req)
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("checkoutId");
  if (!sessionId) {
    return new Response(
      skeleton.fill(html`<h1>checkout session not found</h1>`),
    );
  }

  const sessionRow = (await getCheckoutSessionBySessionId(sessionId))[0];

  if (!sessionRow?.address) {
    return new Response(
      skeleton.fill(html`<h1>checkout session not found</h1>`),
    );
  }

  if (sessionRow.paid_status) {
    const redirectUrl = await getSuccessRedirectUrl(sessionRow);
    if (redirectUrl) {
      const headers = new Headers();
      headers.set("Location", redirectUrl);
      return new Response(null, { status: 303, headers });
    }
  }

  const displayAmount = sessionRow.amount;
  const address = sessionRow.address;

  let title = "";
  let description = "";
  let dueDate: string | null = null;
  let isInvoice = false;
  if (sessionRow.payment_link_id) {
    const paymentLink = (
      await getPaymentLinkByPaymentLinkId(sessionRow.payment_link_id)
    )[0];
    if (paymentLink) {
      title = paymentLink.title || title;
      description = paymentLink.description || "";
      dueDate = paymentLink.dueDate;
      isInvoice = paymentLink.linkType === "invoice";
    }
  }

  const dueDateText =
    isInvoice && dueDate
      ? new Date(dueDate).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        })
      : null;

  const toollink = `/wallet_info?checkoutId=${sessionId}#${make001ToolLink(address, sessionRow.amount)}`;
  const addressQrCode = await QRCode.toDataURL(address);
  const paymentUri = `monero:${address}?tx_amount=${displayAmount}`;
  const paymentUriQrCode = await QRCode.toDataURL(paymentUri);

  const content = html`<div class="checkout-container">
    ${theme.checkoutStyles}
    <div class="payment-info">
      <div class="info-box">
        <div class="info-title">${title}</div>
        <div class="info-amount">${displayAmount} XMR</div>
        ${dueDateText
          ? html`<div class="info-due-date">Due on ${dueDateText}</div>`
          : ""}
        ${description
          ? html`<div class="info-description">${description}</div>`
          : ""}
      </div>

      <div class="payment-steps">
        <div class="step">
          <div class="step-content">
            <h3>Copy Wallet Address</h3>
            <p>Send exactly ${displayAmount} XMR to this address:</p>
            <div class="wallet-address">${address}</div>
          </div>
        </div>
        <div class="step">
          <div class="step-content" style="text-align: center;">
            <a href="${toollink}" class="pay-button">pay with browser wallet</a>
          </div>
        </div>

        <div class="step">
          <div class="step-content">
            <h3>Scan QR Code</h3>
            <p>Or scan this QR code with your wallet app:</p>
            <div class="qr-code">
              <img src="${paymentUriQrCode}" width="100%" height="100%" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <iframe
      src="/paymentstatus?checkoutId=${sessionRow.session_id}"
      scrolling="no"
      frameborder="0"
    ></iframe>
  </div>`;

  return new Response(skeleton.fill(content));
}





async function walletInfoRoute(req: Request) {
  const theme = getTheme(req)
  const url = new URL(req.url);
  const checkoutId = url.searchParams.get("checkoutId");
  const backUrl = checkoutId ? `/?checkoutId=${checkoutId}` : "/";
  const content = html`
    <div class="wallet-not-detected">
      <h1>Monero Browser Wallet Not Installed</h1>
      <p>
        You clicked a Monero payment link, but no browser wallet was found to
        handle it. Please install a Monero browser wallet to pay with your
        browser.
      </p>
      <a
        href="https://monerochan.cash/wallet"
        class="install-btn"
        target="_blank"
        rel="noopener noreferrer"
      >
        Install Monero Browser Wallet
      </a>
      <a href="${backUrl}" class="back-btn" id="back-btn">
        ← Back to Checkout
      </a>
      ${theme.walletNotDetectedStyles}
    </div>
  `;
  return new Response(skeleton.fill(content));
}
