import { BasedHtml, html, HtmlString, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../../users/loginLogout";
import type { Wallet } from "../../../db/schema";

export function createPaymentLinkForm(mini: Mini<Loggedin>, wallets: Wallet[]) {
  return mini.html`
   <button class="create-link-btn" onclick="createPaymentLink()">+ Create Payment Link</button>
    ${createPaymentLinkFormStyles}
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
          <h2 class="dialog-title">Create Payment Link</h2>
          <button class="close-btn" onclick="document.querySelector('.edit-dialog-overlay').style.display = 'none'">&times;</button>
        </div>
        
        <form id="edit-wallet-form">
            <div class="form-group">
            <label class="form-label">Title</label>
            <input type="text" class="form-input" name="title" required placeholder="e.g. Product Launch Package">
            <div class="error-message" id="title-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Amount (XMR)</label>
            <input type="number" step="0.0001" class="form-input" name="amount" required placeholder="0.00">
            <div class="error-message" id="amount-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Description</label>
            <textarea class="form-input" name="description" rows="3" placeholder="Describe what this payment is for..."></textarea>
            <div class="error-message" id="description-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Receiving Wallet</label>
            <select class="form-input" name="wallet" required>
            ${() => {
              const options: BasedHtml[] = [];

              for (const wallet of wallets) {
                options.push(
                  html`<option value="${wallet.id}">
                    ${wallet.walletName || ""} (TODO:VALUE XMR)
                  </option>`
                );
              }
              return mini.html`${options}`;
            }}
            </select>
            <div class="error-message" id="wallet-error"></div>
          </div>

          <div class="form-group">
            <label class="form-label">Payment Type</label>
            <select class="form-input" name="paymentType" required>
              <option value="multi-use">Multi-use Payment Link (Product)</option>
              <option value="one-time">One-time Payment (Invoice)</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Status</label>
            <select class="form-input" name="status" required>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          <div class="form-group invoice-fields" style="display: none;">
            <label class="form-label">Due Date (optional)</label>
            <input type="date" class="form-input" name="dueDate">
            <div class="error-message" id="dueDate-error"></div>
          </div>

          <div class="advanced-fields" style="display: none;">
            <div class="form-group">
              <label class="form-label">Maximum Uses (Product Quantity)</label>
              <input type="number" class="form-input" name="maxUses" placeholder="Leave blank for unlimited">
            </div>

            <div class="form-group">
              <label class="form-label">Success URL</label>
              <input type="url" class="form-input" name="successUrl" placeholder="https://...">
            </div>
          </div>
          
          <button type="submit" class="submit-btn">
            <span class="spinner"></span>
            <span class="button-text">Create Payment Link</span>
          </button>
        </form>
      </div>
    </div>`;
}

const createPaymentLinkFormStyles = html`<style>
  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    align-items: center;
    backdrop-filter: blur(4px);
  }

  .dialog {
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
</style> `;
