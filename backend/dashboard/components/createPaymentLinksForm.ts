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
        ${formTabStyles}
          <div class="form-tabs">
            <button type="button" class="form-tab active" data-step="1">Basic Info</button>
            <button type="button" class="form-tab" data-step="2">Amount &amp; Settings</button>
          </div>

          <div class="form-step active" data-step="1">
          ${paymentTypeSelectionStyles}
            <div class="payment-type-selector">
            <script>
              function changePaymentType(e){
                const typeButtons = document.querySelectorAll('.payment-type-btn');
                const typeForms = document.querySelectorAll('.payment-type-form');

                for (const btn of typeButtons) {
                  btn.classList.toggle('selected')
                }

                for (const typeSelectionForm of typeForms){
                  typeSelectionForm.classList.toggle('active');
                }
              }
            </script>
              <button type="button" class="payment-type-btn selected" data-type="multi-use" onclick="changePaymentType(event)">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"></path>
                  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
                  <path d="M18 12a2 2 0 100-4 2 2 0 000 4z"></path>
                </svg>
                <h3>Product Payment</h3>
                <p>Create a reusable payment link for products, memberships, or services</p>
              </button>
              
              <button type="button" class="payment-type-btn" data-type="one-time" onclick="changePaymentType(event)">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3>Invoice</h3>
                <p>Create a one-time payment link for invoices and single purchases</p>
              </button>
            </div>

            <div class="payment-type-form active product-form" data-type="multi-use">
              <div style="border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem;">
                <div class="form-group" style="margin-bottom: 1rem; position: relative;">
                <label class="form-label" style="
                  font-size: 0.875rem;
                  opacity: 0.9;
                  font-weight: 500;
                  color: var(--accent);
                  display: inline-flex;
                  align-items: center;
                  position: relative;
                  margin-bottom: 1rem;
                  gap: 0.75rem;
                  flex-direction: row;
                  justify-content: flex-start;
                  width: 100%;
              ">Product Title
                  <div style="
                    position: relative;
                    display: flex;
                    align-items: center;
                    flex: 1;
                    max-width: 200px;
                  ">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" style="
                      width: 100%;
                      height: 40px;
                      position: absolute;
                      top: -10px;
                      left: 0;
                    ">
                      <!-- Curved dotted line with rightward curve -->
                      <path d="M0,20 L140,20 Q160,20 170,30" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 4" fill="none"></path>
                    </svg>
                  </div>
              </label>
          <input type="text" class="form-input product-title" name="title" required="" placeholder="title of your product" style="

            
          ">
        </div>
          <div class="form-group" style="margin-bottom: 0; position: relative;">
        <label class="form-label" style="
          font-size: 0.875rem;
          color: var(--accent);
          font-weight: 500;
          display: inline-flex;
          align-items: center;
          position: relative;
          margin-bottom: 1rem;
          gap: 0.75rem;
          flex-direction: row-reverse;
          justify-content: flex-end;
          width: 100%;
        ">Product Description <div style="
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 200px;
        ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 40" style="
            width: 100%;
            height: 40px;
            position: absolute;
            top: -10px;
            left: 0;
          ">
            <!-- Curved dotted line with downward curve at left -->
            <path d="M200,20 L60,20 Q40,20 30,30" stroke="var(--accent)" stroke-width="2" stroke-dasharray="4 4" fill="none"></path>
        </svg>
        </div>
        </label>
        <textarea class="form-input product-details" name="description" rows="3" placeholder="Describe your product's value proposition..."></textarea>
        </div>
        </div>
            </div>

            <div class="payment-type-form invoice-form" data-type="one-time">
              <div style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(124,58,237,0.1);">
                <div class="form-group" style="margin-bottom: 1rem;">
                  <label class="form-label" style="font-size: 0.875rem; opacity: 0.8;">Invoice Title</label>
                  <input type="text" class="form-input" name="invoice_title" required="" placeholder="e.g. Consulting Services - September 2023" style="border-color: rgba(124,58,237,0.2);">
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label class="form-label" style="font-size: 0.875rem; opacity: 0.8;">Invoice Details</label>
                  <textarea class="form-input" name="invoice_description" rows="3" placeholder="Enter invoice details and terms..." style="border-color: rgba(124,58,237,0.2);"></textarea>
                </div>
              </div>
            </div>
          </div>
<div class="form-step" data-step="2">
          <div class="form-group">
            <label class="form-label">Amount (XMR)</label>
            <input type="number" step="0.0001" class="form-input" name="amount" required placeholder="0.00">
            <div class="error-message" id="amount-error"></div>
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

          <div class=" form-group product-fields" style="display: none;">
            <div class="form-group">
              <label class="form-label">Maximum Uses (Product Quantity)</label>
              <input type="number" class="form-input" name="maxUses" placeholder="Leave blank for unlimited">
            </div>
          </div>

            <div class="form-group">
              <label class="form-label">Success URL</label>
              <input type="url" class="form-input" name="successUrl" placeholder="https://...">
            </div>

          <button type="submit" class="submit-btn">
            <span class="spinner"></span>
            <span class="button-text">Create Payment Link</span>
          </button>
        </div>
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
  .form-step {
    display: none;
  }

  .form-step.active {
    display: block;
  }
</style> `;

const paymentTypeSelectionStyles = html`<style>
  .payment-type-card {
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .payment-type-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }

  .payment-type-card.selected {
    border-color: var(--accent);
    background: rgba(124, 58, 237, 0.1);
  }

  .payment-type-card h3 {
    margin: 0 0 1rem 0;
    line-height: 1.2;
  }

  .payment-type-selector {
    display: flex;
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .payment-type-btn {
    flex: 1;
    padding: 1.5rem;
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    color: var(--text);
  }

  .payment-type-btn:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }

  .payment-type-btn.selected {
    background: rgba(124, 58, 237, 0.2);
    border-color: var(--accent);
  }

  .payment-type-btn h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  .payment-type-btn p {
    margin: 0;
    font-size: 0.875rem;
    opacity: 0.8;
    text-align: center;
  }

  .payment-type-form {
    display: none;
  }

  .payment-type-form.active {
    display: block;
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .payment-type-form.product-form h3 {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
  }

  .payment-type-form.product-form {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    margin-top: 1rem;
  }

  .payment-type-form.product-form .form-input:hover,
  .payment-type-form.product-form .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
  }

  .payment-type-form.product-form .form-input {
    transition: all 0.3s ease;
  }

  .payment-type-form.product-form {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 1.5rem;
    margin-top: 1rem;
  }

  .payment-type-form.product-form .form-label {
    position: relative;
    font-size: 0.875rem;
    color: var(--accent);
    font-weight: 500;
    display: inline-block;
    margin-bottom: 0.75rem;
    padding-right: 1rem;
  }

  .payment-type-form.product-form .form-label::after {
    content: "";
    position: absolute;
    top: 50%;
    right: -50px;
    width: 40px;
    height: 1px;
    background-image: linear-gradient(
      to right,
      var(--accent) 50%,
      transparent 50%
    );
    background-size: 6px 1px;
    background-repeat: repeat-x;
    opacity: 0.6;
  }

  .product-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
    width: 100%;
    border: none;
    background: linear-gradient(
      135deg,
      rgba(124, 58, 237, 0.05),
      rgba(124, 58, 237, 0.1)
    );
    padding: 0.75rem;
    border-radius: 16px;
    text-align: center;
    letter-spacing: -0.02em;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    margin-bottom: 1rem;
  }

  .product-details {
    text-align: center;
    margin-bottom: 3rem;
    line-height: 1.8;
    font-size: 1.1rem;
    color: rgba(248, 250, 252, 0.9);
    padding: 2rem;
    background: rgba(124, 58, 237, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(124, 58, 237, 0.1);
    resize: none;
  }

  .payment-type-form.product-form .form-group {
    margin-bottom: 2rem;
    position: relative;
  }

  .payment-type-form.product-form .form-input:hover,
  .payment-type-form.product-form .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
  }

  .payment-type-form.product-form > div {
    border-radius: 12px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    position: relative;
    overflow: hidden;
  }
</style>`;
const formTabStyles = html`<style>
  .form-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(124, 58, 237, 0.2);
    padding-bottom: 1rem;
  }

  .form-tab {
    background: none;
    border: none;
    color: var(--text);
    opacity: 0.7;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
  }

  .form-tab:after {
    content: "";
    position: absolute;
    bottom: -1rem;
    left: 0;
    width: 100%;
    height: 2px;
    background: var(--accent);
    transform: scaleX(0);
    transition: transform 0.3s ease;
  }

  .form-tab.active {
    opacity: 1;
  }

  .form-tab.active:after {
    transform: scaleX(1);
  }

  .form-step {
    display: none;
  }

  .form-step.active {
    display: block;
  }

  .form-navigation {
    display: flex;
    justify-content: space-between;
    margin-top: 2rem;
  }

  .nav-btn {
    background: var(--accent);
    border: none;
    color: var(--text);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-btn:hover:not(:disabled) {
    background: var(--primary);
  }
</style>`;
