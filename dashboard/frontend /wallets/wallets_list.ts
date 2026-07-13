import { html, flatten, type MiniHtmlString } from "@spirobel/mininext";
import { convertBigIntAmount, make002ToolLink } from "@spirobel/monero-wallet-api";
import { router } from "../dashboard_router";

export function makeWalletCreationLink(wallet_slot: number = 0) {
  const makeWalletLink = make002ToolLink(wallet_slot);
  return router.link("/wallets/new/") + makeWalletLink;
}
function getHighestWalletSlot() {
  const scanSettings = window.dashboardData.scan_settings;
  const walletList = scanSettings?.wallets || [];
  let highestWalletSlot = 0;
  for (const wallet of walletList) {
    if (wallet?.wallet_slot != null && wallet.wallet_slot > highestWalletSlot)
      highestWalletSlot = wallet.wallet_slot;
  }
  return highestWalletSlot;
}
export function walletGrid() {
  const heighestWalletSlot = getHighestWalletSlot();
  const makeWalletHref = makeWalletCreationLink(heighestWalletSlot + 1);

  const scanSettings = window.dashboardData.scan_settings;
  const walletList = scanSettings?.wallets || [];
  return html`<div>
    ${() => {
      if (walletList.length < 1) {
        return emptyWalletCard();
      }
      const walletElementList: MiniHtmlString[] = [];
      for (const wallet of walletList) {
        walletElementList.push(filledWalletCard(wallet));
      }
      return flatten(
        walletElementList,
        (l) => html` <div class="wallets-grid">${l}</div>`,
      );
    }}
    <div class="wallet-footer-left">
      <button class="set-nodeurl-btn" onclick="openNodeUrlForm()">
        Settings
      </button>
      ${syncProgress()}
    </div>
    <a class="add-wallet-btn" href="${makeWalletHref}">Add Wallet</a>
  </div>`;
}
export function syncProgress() {
  const s = window.dashboardData.sync_status;
  if (!s?.is_connected) {
    return html`
      <div class="connection-progress">
        <div class="no-connection">no</div>
        <div class="no-connection">connection</div>
      </div>
    `;
  }
  return html`
    <div class="connection-progress">
      <div class="heights">${s.current_height ?? "?"}</div>
      <div class="mini-divider"></div>
      <div class="heights">${s.daemon_height || "?"}</div>
    </div>
  `;
}
export function emptyWalletCard() {
  const makeWalletHref = makeWalletCreationLink();

  return html` <a class="empty-wallet-card" href="${makeWalletHref}">
    <svg
      class="empty-state-icon floating"
      width="38"
      height="38"
      stroke-width="2"
      fill="currentColor"
      class="bi bi-wallet"
      viewBox="0 0 16 16"
    >
      <path
        d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
      />
    </svg>
    <div class="empty-state-text">No Wallets Connected</div>
    <div class="empty-state-subtext">
      Click the button below to add your first wallet
    </div>
  </a>`;
}

export function filledWalletCard(wallet: any) {
  const balance = window.dashboardData.wallet_balances.find(
    (b) => b.primary_address === wallet.primary_address,
  );
  const spendable = balance
    ? convertBigIntAmount(BigInt(balance.spendable)) + " XMR"
    : "0 XMR";

  return html` <div class="wallet-card">
    <div class="wallet-actions">
      <button
        class="edit-wallet-btn"
        onclick="editWallet('${wallet.primary_address}')"
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
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
      </button>
    </div>

    <div class="wallet-header">
      <svg
        width="38"
        height="38"
        stroke-width="2"
        fill="currentColor"
        class="bi bi-wallet"
        viewBox="0 0 16 16"
      >
        <path
          d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
        />
      </svg>
      <div class="wallet-balance">${spendable}</div>
    </div>

    <div class="wallet-address">${wallet.primary_address}</div>
    <div class="wallet-name">${wallet.wallet_name || " "}</div>
  </div>`;
}

