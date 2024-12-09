import type { Mini } from "@spirobel/mininext";
import type { Loggedin } from "../../users/loginLogout";
import { walletSvg } from "../svgs";

export function emptyWalletCard(mini: Mini<Loggedin>) {
  return mini.html`
        <div class="empty-wallet-card">
            <img class="empty-state-icon floating" src="${walletSvg}" width="38" height="38" />
            <div class="empty-state-text">No Wallets Connected</div>
            <div class="empty-state-subtext">Click the button below to add your first wallet</div>
        </div>`;
}

export function filledWalletCard(mini: Mini<Loggedin>) {}
