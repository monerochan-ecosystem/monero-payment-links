import { html, url, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { db } from "../../db/db";
import { wallets } from "../../db/schema";
import { emptyWalletCard, filledWalletCard } from "./components/walletCard";
import { sidebar } from "./components/sidebar";

const frontend = url.frontend("dashboardIndex.ts");

export function dashBoardIndex(mini: Mini<Loggedin>) {
  const walletList = db.select().from(wallets).all();
  return mini.html`
  ${frontend} 
  ${mainStyles}
  ${indexStyles}
  <div class="layout-container">
  ${sidebar}
  <main class="main-content">
    ${() => {
      if (walletList.length < 1) {
        return emptyWalletCard(mini);
      }
      const walletElementList = [];
      for (const wallet of walletList) {
        walletElementList.push(filledWalletCard(mini, wallet));
      }
      return mini.html`
      <div class="wallets-grid">${walletElementList}</div>`;
    }}

    <button class="add-wallet-btn" onclick="editWallet()">+ Add Wallet</button>

      <div class="dialog-overlay edit-dialog-overlay" onclick="clickOutsideClose(event)">
      <script>
          function clickOutsideClose (e) {
            if (e.target === document.querySelector(".edit-dialog-overlay")) {
              document.querySelector(".edit-dialog-overlay").style.display = "none";
            }
          }
      </script>

      <div class="dialog">
        <div class="dialog-header">
          <h2 class="dialog-title"></h2>
          <button class="close-btn" onclick="document.querySelector('.edit-dialog-overlay').style.display = 'none'">&times;</button>
        </div>
        
        <form id="edit-wallet-form">
          <div class="form-group">
            <label class="form-label">Wallet Name</label>
            <input type="text" class="form-input" name="walletName" required placeholder="My XMR Wallet">
            <div class="error-message" id="walletName-error"></div>
          </div>
          
          <div class="form-group">
            <label class="form-label">Primary Address</label>
            <input type="text" class="form-input" name="primaryAddress" required placeholder="Enter the Primary Address ...">
            <div class="error-message" id="primaryAddress-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Private View Key</label>
            <input type="text" class="form-input" name="secretViewKey" required placeholder="Enter the Private View Key ...">
            <div class="error-message" id="secretViewKey-error"></div>
          </div>

          <div class="advanced-toggle">
            <span class="show-more" onclick="showMore()">Show Advanced Options
            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-down" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
            </span>
            <span class="show-less" onclick="showLess()" style="display: none;">Hide Advanced Options
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="currentColor" class="bi bi-chevron-up" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708z"/>
              </svg>
            </span>
            <script>
              function showMore(){
                document.querySelector(".show-more").style.display = "none"
                document.querySelector(".show-less").style.display = "flex"
                document.querySelector(".advanced-fields").style.display = "block"
              }
              function showLess(){
                document.querySelector(".show-more").style.display = "flex"
                document.querySelector(".show-less").style.display = "none"
                document.querySelector(".advanced-fields").style.display = "none"
              }
              </script>
          </div>
          
          <div class="advanced-fields" style="display: none;">
            <div class="form-group">
              <label class="form-label">Start Sync Height</label>
              <input type="number" class="form-input" name="start_height" placeholder="Enter block height to sync from">
               <div class="error-message" id="start_height-error"></div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Daemon URL</label>
              <input type="url" class="form-input" name="daemonUrl" placeholder="https://...">
              <div class="error-message" id="daemonUrl-error"></div>
            </div>
          </div>
          
          <button type="submit" class="submit-btn">
            <span class="spinner"></span>
            <span class="button-text"></span>
          </button>

          <button type="button" class="delete-btn" onclick="showDeleteDialog()">Delete Wallet</button>
          <script>
            function showDeleteDialog () {
            const deleteWarning = document.querySelector(".delete-warning");
            const deleteBtn = document.querySelector(".delete-btn");

              deleteWarning.classList.add("show");
              deleteBtn.style.display = "none";
            }

            function hideDeleteDialog () {
            const deleteWarning = document.querySelector(".delete-warning");
            const deleteBtn = document.querySelector(".delete-btn");

              deleteWarning.classList.remove("show");
              deleteBtn.style.display = "block";
            }
            </script>

          <div class="delete-warning">
            <p><strong>Warning:</strong> This action cannot be undone. Deleting this wallet will also remove all associated payment links and transaction history.</p>
            <div class="warning-actions">
              <button type="button" class="cancel-delete" onClick="hideDeleteDialog()">Cancel</button>
              <button type="button" class="confirm-delete" onClick="confirmDeletion()">Delete Permanently</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </main>
</div>

`;
}
export const mainStyles = html`<style>
  :root {
    --primary: #5b21b6;
    --secondary: #4c1d95;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #18181b;
  }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
  }
  input {
    box-sizing: border-box;
  }
  textarea {
    box-sizing: border-box;
  }
  select {
    background-color: #231c30 !important;
    color: #fff !important;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.1);
    color: var(--text);
    font-size: 1rem;
  }

  select option {
    color: #fff !important;
    padding: 0.75rem !important;
    border-radius: 8px !important;
    border: 1px solid rgba(124, 58, 237, 0.3) !important;
    background: rgba(124, 58, 237, 0.1) !important;
    font-size: 1rem;
  }

  .layout-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  .main-content {
    flex: 1;
    padding: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media (max-width: 768px) {
    .main-content {
      padding-bottom: 80px; /* Increase padding to prevent overlap */
    }
  }
</style>`;
const indexStyles = html`<style>
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
      grid-template-columns: 1fr; /* Single column on mobile */
      padding: 1rem;
      padding-bottom: 80px; /* Account for bottom menu */
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
    width: 380px;
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
    bottom: 1rem; /* Change from top to bottom */
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

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    backdrop-filter: blur(4px);
    overflow-y: auto;
    z-index: 101;
    padding-top: 20px;
  }

  .dialog {
    max-height: fit-content;
    background: var(--bg);
    padding: 2rem;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    border: 1px solid var(--accent);
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .dialog-title {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    font-size: 1.5rem;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.8;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.1);
    color: var(--text);
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
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

  /* Add these styles to the existing CSS */
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

  /* Add styles for edit dialog */
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
