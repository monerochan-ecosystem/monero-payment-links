import { html, flatten, type MiniHtmlString } from "@spirobel/mininext";
import { make002ToolLink } from "@spirobel/monero-wallet-api";
import { router } from "../dashboard_router";

function makeWalletCreationLink() {
  const makeWalletLink = make002ToolLink(0);
  return router.link("/wallets/new/") + makeWalletLink;
}
export function walletGrid() {
  const makeWalletHref = makeWalletCreationLink();

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
    <button class="set-nodeurl-btn">Set Node URL</button>

    <a class="add-wallet-btn" href="${makeWalletHref}">+ Add Wallet</a>
    ${walletStyles}
  </div>`;
}
export function emptyWalletCard() {
  const makeWalletHref = makeWalletCreationLink();

  return html` <a class="empty-wallet-card" href="${makeWalletHref}">
    <svg
      class="empty-state-icon floating"
      width="38"
      height="38"
      stroke-width="2"
      fill="white"
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
  return html` <div class="wallet-card">
    <div class="wallet-actions">
      <button
        class="edit-wallet-btn"
        onclick="editWallet($.{wallet.primary_address})"
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
        fill="white"
        class="bi bi-wallet"
        viewBox="0 0 16 16"
      >
        <path
          d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
        />
      </svg>
      <div class="wallet-balance">2.4389 XMR</div>
    </div>

    <div class="wallet-address">${wallet.primary_address}</div>
    <div class="wallet-name">${wallet.wallet_name || " "}</div>
    <div class="sync-progress">
      <div class="sync-bar"></div>
    </div>
  </div>`;
}

export const walletStyles = html`<style>
  .wallets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  @media (max-width: 1300px) {
    .wallets-grid {
      grid-template-columns: 1fr;
      padding: 1rem;
      padding-bottom: 80px;
    }
  }
  .wallet-card {
    max-width: 380px;
    height: 220px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    animation: pulse 2s infinite;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  .empty-wallet-card {
    text-decoration: none;
    max-width: 380px;
    height: 220px;
    background: rgba(91, 33, 182, 0.1);
    border: 2px dashed var(--accent);
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .empty-state-icon {
    width: 48px;
    height: 48px;
    opacity: 0.5;
    margin-bottom: 1rem;
  }

  .empty-state-text {
    font-size: 1.1rem;
    color: var(--text);
    opacity: 0.7;
    text-align: center;
  }

  .empty-state-subtext {
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.5;
    text-align: center;
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }
  .wallet-actions {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }

  .edit-wallet-btn {
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

  .edit-wallet-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

  .add-wallet-btn {
    text-decoration: none;
    outline: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--accent);
    border: none;
    color: var(--text);
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .add-wallet-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
  }
  .set-nodeurl-btn {
    text-decoration: none;
    outline: none;
    position: fixed;
    bottom: 2rem;
    left: 360px;
    background: var(--accent);
    border: none;
    color: var(--text);
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .set-nodeurl-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
  }

  .show-more {
    width: 100%;
    border: none;
    color: var(--text);
    padding: 1rem;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    opacity: 0.8;
  }
  .show-less {
    width: 100%;
    border: none;
    color: var(--text);
    padding: 1rem;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .advanced-toggle:hover {
    opacity: 1;
  }

  .advanced-fields {
    overflow: hidden;
    opacity: 1;
    max-height: 300px;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: none;
  }

  .form-input.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  }

  .delete-btn {
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 8px;
    color: #fecaca;
  }

  .delete-btn:hover {
    background: #b91c1c;
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 8px;
    color: #fecaca;
  }

  .delete-warning.show {
    display: block;
  }

  .warning-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .warning-actions button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .cancel-delete {
    background: #374151;
    color: var(--text);
  }

  .cancel-delete:hover {
    background: #4b5563;
  }

  .confirm-delete {
    background: #dc2626;
    color: var(--text);
  }

  .confirm-delete:hover {
    background: #b91c1c;
  }

  .edit-dialog-overlay {
    display: none;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:disabled {
    background: #4c4c4c;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn .button-text {
    display: inline;
  }

  .submit-btn.loading .button-text {
    display: none;
  }

  .submit-btn.loading .spinner {
    display: inline-block;
  }

  .spinner {
    display: none;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .submit-btn:hover {
    background: var(--primary);
    transform: translateY(-2px);
  }

  @keyframes pulse {
    0% {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
    50% {
      box-shadow: 0 15px 40px rgba(124, 58, 237, 0.4);
    }
    100% {
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    }
  }

  .wallet-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
  }

  .wallet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .wallet-balance {
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .wallet-name {
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .wallet-address {
    width: 100%;
    word-wrap: break-word;
    display: inline-block;
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: 20px;
    transition: all 0.3s ease;
  }

  .wallet-address:hover {
    opacity: 1;
    cursor: pointer;
    color: var(--accent);
  }

  .sync-progress {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    overflow: hidden;
  }

  .sync-bar {
    height: 100%;
    width: 100%;
    background: var(--accent);
    position: relative;
    transition: width 0.5s ease;
    animation: shimmer 1.5s infinite linear;
  }

  @keyframes shimmer {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  .blocks-container {
    display: flex;
    gap: 4px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .block {
    width: 12px;
    height: 12px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .block.synced {
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
    animation: blockPulse 2s infinite;
  }

  @keyframes blockPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .sync-status {
    font-size: 0.875rem;
    margin-top: 10px;
    animation: fadeInOut 2s infinite;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }
</style>`;
