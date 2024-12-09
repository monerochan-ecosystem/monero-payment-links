import { url, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../../users/loginLogout";
import { walletSvg } from "../svgs";
import type { Wallet } from "../../../db/schema";

export function emptyWalletCard(mini: Mini<Loggedin>) {
  return mini.html`
        <div class="empty-wallet-card">
            <img class="empty-state-icon floating" src="${walletSvg}" width="38" height="38" />
            <div class="empty-state-text">No Wallets Connected</div>
            <div class="empty-state-subtext">Click the button below to add your first wallet</div>
        </div>`;
}

export function filledWalletCard(mini: Mini<Loggedin>, wallet: Wallet) {
  return mini.html`
      <div class="wallet-card">
      ${url.deliver("wallet-" + wallet.id, wallet)}
      <div class="wallet-actions">
        <button class="edit-wallet-btn" onclick="editWallet('${wallet.id}')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </button>
      </div>

      <div class="wallet-header">
        <img src="${walletSvg}" width="38" height="38" />
        <div class="wallet-balance">2.4389 XMR</div>
      </div>
      
      <div class="wallet-address">${wallet.primaryAddress!}</div>
      
        <div class="wallet-name">${wallet.walletName || " "}</div>
    </div>`;
}
