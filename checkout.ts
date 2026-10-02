import { html } from "@spirobel/mininext";
import {
  openWallets,
  tools,
  convertAmountBigInt,
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
  updateTxBlockTime,
  getPaidCheckoutSessionByPaymentLinkId,
  getAllSuccessfulCheckoutSessions,
} from "./db";
import type { BunRequest } from "bun";
import { SCAN_SETTINGS_PATH, setWallets, getWallets } from "./dashboard/backend/wallets";
import { broadcast, serializeDashboard } from "./ws";
import { getTheme } from "./theme/theme";
import { amountForCheckout, formatLinkAmountDisplay } from "./rates";

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
      GET: tools["001"].counterparty.validate_route({
        isPayAddressKnown: async (address) => {
          const sessionRow = await getCheckoutSessionByAddress(address);
          return !!sessionRow[0]?.id;
        },
      }),
    },
    "/": { GET: checkoutRoute },
    "/wallet_info": { GET: walletInfoRoute },
  };
}

const wallets = await openWallets({
  scan_settings_path: SCAN_SETTINGS_PATH,
  notifyMasterChanged: async (params) => {
    try {
      await syncPaymentStatus();
    } catch {
    }
    try {
      broadcast(
        serializeDashboard(getWallets(), await getAllSuccessfulCheckoutSessions()),
      );
    } catch {
    }
  },
  // isConnected only flips here (not in notifyMasterChanged), without this
  // dashboards that loaded while disconnected stay on "no connection" until F5
  onConnectionStatusChange: async () => {
    try {
      await syncPaymentStatus();
    } catch {
    }
    try {
      broadcast(
        serializeDashboard(getWallets(), await getAllSuccessfulCheckoutSessions()),
      );
    } catch {
    }
  },
  // logs: "console",
  // logs_include: [
  //   "handleCpuboundScan",
  //   "atomicWrite",
  //   "blocksBufferFetchLoop",
  // ],
  autoRetry: true,
});
if (wallets) setWallets(wallets);
function walletForLink(addr?: string | null) {
  const list = getWallets()?.wallets ?? [];
  if (!addr) return undefined;
  return list.find((w) => w.primary_address === addr);
}
// full sync for background events
// runs when user leaves page, iframe heals open page
async function syncPaymentStatus() {
  try {
    for (const w of getWallets()?.wallets ?? []) {
      let txs: { payment_id: number; confirmations: number; tx_hash: string; amount: bigint; outputs?: { block_timestamp: number }[] }[] = [];
      try {
        txs = w.transactions as typeof txs;
      } catch {
        continue;
      }
      for (const tx of txs) {
        try {
          const row = (await getCheckoutSessionByPrimaryId(tx.payment_id))[0];
          if (!row) continue;
          if (row.tx_hash && row.tx_hash !== tx.tx_hash) continue;
          if (!row.tx_hash) await updateTxHash(tx.payment_id, tx.tx_hash);
          if (row.tx_confirmations !== tx.confirmations) {
            await updateTxConfirmations(tx.payment_id, tx.confirmations);
          }
          if (row.paid_status === 1) continue;
          let need: bigint | null = null;
          try {
            need = convertAmountBigInt(row.amount);
          } catch {
          }
          if (need === null || tx.amount < need) continue;
          if (tx.confirmations < row.required_confirmations) continue;
          await markAsPaid(tx.payment_id);
          const blockTime = tx.outputs?.[0]?.block_timestamp;
          if (blockTime) await updateTxBlockTime(tx.payment_id, blockTime);
          if (row.payment_link_id) await incrementPaymentLinkUses(row.payment_link_id);
        } catch {
        }
      }
    }
  } catch {
  }
}
try {
  await syncPaymentStatus();
} catch {
}

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
  const theme = getTheme("checkout")
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("checkoutId");
  if (!sessionId) {
    return new Response(
      skeleton.fill(html`<h1>checkout session not found</h1>`),
    );
  }

  let sessionRow = (await getCheckoutSessionBySessionId(sessionId))[0];

  if (!sessionRow?.address) {
    return new Response(
      skeleton.fill(html`<h1>checkout session not found</h1>`),
    );
  }

  // client polls each second, push conf forward here
  // paid rows render from sqlite only, no wallet look
  if (!sessionRow.paid_status) {
    const rowId = sessionRow.id;
    try {
      const live = getWallets()?.wallets.flatMap((w) => {
        try {
          return w.transactions;
        } catch {
          return [];
        }
      }).find((t) => t.payment_id === rowId);
      if (live) {
        if (!sessionRow.tx_hash) await updateTxHash(sessionRow.id, live.tx_hash);
        if (sessionRow.tx_confirmations !== live.confirmations) {
          await updateTxConfirmations(sessionRow.id, live.confirmations);
        }
        let need: bigint | null = null;
        try {
          need = convertAmountBigInt(sessionRow.amount);
        } catch {
        }
        if (need !== null && live.amount >= need && live.confirmations >= sessionRow.required_confirmations) {
          await markAsPaid(sessionRow.id);
          const blockTime = live.outputs?.[0]?.block_timestamp;
          if (blockTime) await updateTxBlockTime(sessionRow.id, blockTime);
          if (sessionRow.payment_link_id) await incrementPaymentLinkUses(sessionRow.payment_link_id);
        }
        sessionRow = (await getCheckoutSessionBySessionId(sessionId))[0] ?? sessionRow;
      }
    } catch {
    }
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
  const theme = getTheme("checkout")
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
      const amount = formatLinkAmountDisplay(paymentLinkRow);
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
      const amount = formatLinkAmountDisplay(paymentLinkRow);
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

  let amountXmr: string;
  try {
    // usd priced links convert here with kraken cache; fail closed if no rate
     amountXmr = await amountForCheckout(paymentLinkRow);
  } catch (e) {
    console.error("rate lookup failed for checkout", e);
    const content = html`<div class="info-container">
      <div class="info-card">
        <div class="info-box">
          <div class="info-title">Checkout unavailable</div>
          <p class="info-message">
            Could not get a live monero price. try again in a moment.
          </p>
        </div>
      </div>
    </div>`;
    return new Response(skeleton.fill(content), { status: 503 });
  }

  const liveWallet = walletForLink(paymentLinkRow.wallet_primary_address);
  if (isBackendDown()) return backendDownResponse();
  if (!liveWallet) return styledNotice("no merchant wallet found");
  const needConf = liveWallet.merchant_confirmations ?? 10;
  const secret = crypto.randomUUID();
  const insertedRow = (
    await createCheckoutSession(
      amountXmr,
      secret,
      needConf,
      paymentLinkRow.payment_link_id,
    )
  )[0];

  if (!insertedRow) return styledNotice("no merchant db found");

  const address = await liveWallet.makeIntegratedAddress(insertedRow.id);
  await updateCheckoutSessionAddress(insertedRow.session_id, address);

  const redirectUrl = `/?checkoutId=${insertedRow.session_id}`;
  const headers = new Headers();
  headers.set("Location", redirectUrl);
  return new Response(null, { status: 303, headers });
}
function styledNotice(title: string, sub?: string) {
  const theme = getTheme("checkout")
  const content = html`<div class="info-container">
    ${theme.outOfStockStyles}
    <style>
      .mpl { text-align: center; padding: 1rem 0; }
      .mpl-title { font-size: 1rem; font-weight: 600; opacity: 0.9; }
      .mpl-sub { margin-top: 1rem; font-size: 0.85rem; opacity: 0.62; }
      .mpl-source { margin-top: 1rem; font-size: 0.78rem; opacity: 0.48; }
      .mpl-source a { color: inherit; text-decoration: none; border-bottom: 1px solid currentColor; }
    </style>
    <div class="info-card">
      <div class="mpl">
        <div class="mpl-title">${title}</div>
        ${sub ? html`<div class="mpl-sub">${sub}</div>` : ""}
      </div>
    </div>
  </div>`;
  return new Response(skeleton.fill(content));
}


function instanceInfoResponse() {
  const theme = getTheme("checkout")
  const content = html`<div class="info-container">
    ${theme.outOfStockStyles}
    <style>
      .mpl { text-align: center; padding: 1rem 0; }
      .mpl-title { font-size: 1rem; font-weight: 600; opacity: 0.9; }
      .mpl-source { margin-top: 1rem; font-size: 0.78rem; opacity: 0.48; }
      .mpl-source a { color: inherit; text-decoration: none; border-bottom: 1px solid currentColor; }
    </style>
    <div class="info-card">
      <div class="mpl">
        <div class="mpl-title">monero payment links</div>
        <div class="mpl-source"><a href="https://github.com/monerochan-ecosystem/monero-payment-links" target="_blank" rel="noopener noreferrer">[source]</a></div>
      </div>
    </div>
  </div>`;
  return new Response(skeleton.fill(content));
}

// no connection to node or wallet doesnt exist
function isBackendDown() {
  const w = getWallets();
  if (!w?.wallets?.[0]) return false;
  return w.connectionStatusOpened?.isConnected === false;
}


function backendDownResponse() {
  return styledNotice(
    "payment backend lost connection to node",
    "try again in a moment. if this continues, contact the merchant.",
  );
}

async function checkoutRoute(req: Request) {
  const theme = getTheme("checkout")
  const url = new URL(req.url);
  const sessionId = url.searchParams.get("checkoutId");
  if (!sessionId) {
    return instanceInfoResponse();
  }

  const sessionRow = (await getCheckoutSessionBySessionId(sessionId))[0];

  if (!sessionRow?.address) {
    return instanceInfoResponse();
  }

  if (sessionRow.paid_status) {
    const redirectUrl = await getSuccessRedirectUrl(sessionRow);
    if (redirectUrl) {
      const headers = new Headers();
      headers.set("Location", redirectUrl);
      return new Response(null, { status: 303, headers });
    }
  }

  if (isBackendDown()) return backendDownResponse();

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

  const toollink = `/wallet_info?checkoutId=${sessionId}#${tools["001"].counterparty.make({ address, amount: sessionRow.amount, no_check: false })}`;
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
            <a
              href="${toollink}"
              class="pay-button"
              target="_blank"
              rel="noopener noreferrer"
              >pay with browser wallet</a
            >
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
  const theme = getTheme("checkout")
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
