import { html } from "@spirobel/mininext";
import { router } from "../dashboard_router";
import {
  applyDashboard,
  bind,
  closeOnOverlay,
  errorMessage,
  inputClass,
  newFormState,
  openForm,
  postJson,
  setIssues,
  submitButton,
} from "../form_kit";

type LinkType = "product" | "invoice";

type PaymentLinkDraft = {
  paymentLinkId: string;
  linkType: LinkType;
  title: string;
  description: string;
  currency: string;
  amount: string;
  walletId: string;
  dueDate: string;
  maxUses: string;
  successUrl: string;
};

function emptyDraft(): PaymentLinkDraft {
  return {
    paymentLinkId: "",
    linkType: "product",
    title: "",
    description: "",
    currency: "XMR",
    amount: "",
    walletId: "",
    dueDate: "",
    maxUses: "",
    successUrl: "",
  };
}

const form = newFormState(emptyDraft());
let step: 1 | 2 = 1;
let walletMenuOpen = false;

export function openPaymentLinkForm(paymentLinkId?: string) {
  const links = window.dashboardData?.payment_links || [];
  const link = paymentLinkId
    ? links.find((l: any) => l.payment_link_id === paymentLinkId)
    : undefined;
  const draft = emptyDraft();
  if (link) {
    draft.paymentLinkId = link.payment_link_id;
    draft.linkType = link.linkType === "invoice" ? "invoice" : "product";
    draft.title = link.title || "";
    draft.description = link.description || "";
    draft.currency = link.currency === "USD" ? "USD" : "XMR";
    draft.amount = link.amount || "";
    draft.walletId = link.wallet_primary_address || "";
    draft.dueDate = link.dueDate || "";
    draft.maxUses = link.maxUses ? String(link.maxUses) : "";
    draft.successUrl = link.successUrl || "";
  }
  step = 1;
  walletMenuOpen = false;
  openForm(form, draft);
}

const step1Fields = [
  "productTitle",
  "productDescription",
  "invoiceTitle",
  "invoiceDescription",
];

async function submit(e: Event) {
  e.preventDefault();
  const d = form.draft;
  const input: Record<string, string | number> = {
    linkType: d.linkType,
    [`${d.linkType}Title`]: d.title,
    [`${d.linkType}Description`]: d.description,
    currency: d.currency,
    amount: d.amount,
    walletId: d.walletId,
    successUrl: d.successUrl,
  };
  if (d.paymentLinkId) input.paymentLinkId = d.paymentLinkId;
  if (d.linkType === "product") input.maxUses = d.maxUses;
  else input.dueDate = d.dueDate;
  for (const key in input) {
    const v = String(input[key]).trim();
    if (v === "") delete input[key];
    else input[key] = v;
  }
  if (input.maxUses) input.maxUses = Number(input.maxUses);

  form.errors = {};
  form.saving = true;
  try {
    const response = await postJson("/editPaymentLink", input);
    if (!response.success) {
      setIssues(form, response.error?.issues);
      if (Object.keys(form.errors).some((n) => step1Fields.includes(n))) {
        form.errors._form =
          "Please go back to the Basic Info tab to fix the highlighted errors";
        step = 1;
      }
      return;
    }
    applyDashboard(response.dashboard);
    form.open = false;
    router.navigate("/payment-links/:id", { id: response.paymentLinkId });
  } catch (err) {
    console.error("Error saving payment link:", err);
    form.errors._form = "An error occurred while saving";
  } finally {
    form.saving = false;
  }
}

async function confirmDelete() {
  const { paymentLinkId, linkType } = form.draft;
  if (!paymentLinkId) return;
  const response = await postJson("/deletePaymentLink", {
    paymentLinkId,
    linkType,
  });
  if (!response.success) {
    console.error("Error deleting payment link:", response.error);
    form.confirmDelete = false;
    return;
  }
  applyDashboard(response.dashboard);
  form.open = false;
  router.navigate("/payment-links");
}

function setLinkType(type: LinkType) {
  if (!form.draft.paymentLinkId) form.draft.linkType = type;
}

function walletLabel(wallet: { wallet_name?: string; primary_address?: string }) {
  const name = wallet.wallet_name || "Unnamed Wallet";
  const address = wallet.primary_address || "";
  const short =
    address.length > 6 ? `${address.slice(0, 3)}...${address.slice(-3)}` : address;
  return `${name} (${short})`;
}

function walletDropdown() {
  const wallets = (window.dashboardData?.scan_settings?.wallets || []).filter(
    (w) => !!w?.primary_address,
  );
  const selected = wallets.find((w) => w.primary_address === form.draft.walletId);
  const items =
    wallets.length === 0
      ? html`<li class="dropdown-item disabled">No wallets available</li>`
      : wallets.map(
          (w) =>
            html`<li
              class="dropdown-item"
              onclick=${(e: Event) => {
                e.stopPropagation();
                form.draft.walletId = w.primary_address;
                walletMenuOpen = false;
              }}
            >
              ${walletLabel(w)}
            </li>`,
        );
  return html`<div class="custom-dropdown-menu">
    <div
      class="dropdown-display"
      onclick=${(e: Event) => {
        e.stopPropagation();
        walletMenuOpen = !walletMenuOpen;
      }}
    >
      ${selected ? walletLabel(selected) : "Select a wallet"}
    </div>
    <ul class="dropdown-list ${walletMenuOpen ? "open" : ""}">
      ${items}
    </ul>
  </div>`;
}

const productIcon = html`<svg
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
>
  <path d="M20 12V8H6a2 2 0 01-2-2c0-1.1.9-2 2-2h12v4"></path>
  <path d="M4 6v12c0 1.1.9 2 2 2h14v-4"></path>
  <path d="M18 12a2 2 0 100-4 2 2 0 000 4z"></path>
</svg>`;

const invoiceIcon = html`<svg
  width="32"
  height="32"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
>
  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"></path>
  <polyline points="14 2 14 8 20 8"></polyline>
  <line x1="16" y1="13" x2="8" y2="13"></line>
  <line x1="16" y1="17" x2="8" y2="17"></line>
  <polyline points="10 9 9 9 8 9"></polyline>
</svg>`;

function productFields() {
  return html`<div>
    <div class="form-group" style="margin-bottom: 1rem; position: relative;">
      <label
        class="form-label"
        style="display: inline-flex; margin-bottom: 1rem; gap: 5px; width: 100%;"
        ><span>Product Title</span>
        <div
          style="position: relative; display: flex; align-items: center; flex: 1; max-width: 200px;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 40"
            style="width: 100%; height: 40px; position: absolute; top: -10px; left: 0;"
          >
            <path
              d="M0,20 L140,20 Q160,20 170,30"
              stroke="var(--accent)"
              stroke-width="2"
              stroke-dasharray="4 4"
              fill="none"
            ></path>
          </svg>
        </div>
      </label>
      <input
        type="text"
        class="${inputClass(form, "productTitle", "product-title")}"
        name="productTitle"
        placeholder="title of your product"
        value=${form.draft.title}
        oninput=${bind(form, "title")}
      />
      ${errorMessage(form, "productTitle")}
    </div>
    <div class="form-group" style="margin-bottom: 0; position: relative;">
      <label
        class="form-label"
        style="display: inline-flex; position: relative; margin-bottom: 1rem; gap: 5px; flex-direction: row-reverse; width: 100%;"
        ><span>Product Description</span>
        <div
          style="position: relative; display: flex; align-items: center; flex: 1; max-width: 200px;"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 200 40"
            style="width: 100%; height: 40px; position: absolute; top: -10px; left: 0;"
          >
            <path
              d="M200,20 L60,20 Q40,20 30,30"
              stroke="var(--accent)"
              stroke-width="2"
              stroke-dasharray="4 4"
              fill="none"
            ></path>
          </svg>
        </div>
      </label>
      <textarea
        class="${inputClass(form, "productDescription", "product-details")}"
        name="productDescription"
        rows="6"
        placeholder="Describe your product's value proposition..."
        value=${form.draft.description}
        oninput=${bind(form, "description")}
      ></textarea>
      ${errorMessage(form, "productDescription")}
    </div>
  </div>`;
}

function invoiceFields() {
  return html`<div
    style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(124,58,237,0.1);"
  >
    <div class="form-group" style="margin-bottom: 1rem;">
      <label class="form-label" style="font-size: 0.875rem; opacity: 0.8;"
        >Invoice Title</label
      >
      <input
        type="text"
        class="${inputClass(form, "invoiceTitle")}"
        name="invoiceTitle"
        placeholder="e.g. Consulting Services - September 2023"
        style="border-color: rgba(124,58,237,0.2);"
        value=${form.draft.title}
        oninput=${bind(form, "title")}
      />
      ${errorMessage(form, "invoiceTitle")}
    </div>
    <div class="form-group" style="margin-bottom: 0;">
      <label class="form-label" style="font-size: 0.875rem; opacity: 0.8;"
        >Invoice Details</label
      >
      <textarea
        class="${inputClass(form, "invoiceDescription")}"
        name="invoiceDescription"
        rows="10"
        placeholder="Enter invoice details and terms..."
        style="border-color: rgba(124,58,237,0.2);"
        value=${form.draft.description}
        oninput=${bind(form, "description")}
      ></textarea>
      ${errorMessage(form, "invoiceDescription")}
    </div>
  </div>`;
}

function deleteControls() {
  if (!form.draft.paymentLinkId) return null;
  if (!form.confirmDelete) {
    return html`<button
      type="button"
      class="delete-btn"
      style="display: block"
      onclick=${() => { form.confirmDelete = true; }}
    >
      Delete Payment Link
    </button>`;
  }
  return html`<div class="delete-warning show">
    <p>
      <strong>Warning:</strong> This action cannot be undone. Deleting this
      payment link will permanently remove it and all associated data.
    </p>
    <div class="warning-actions">
      <button
        type="button"
        class="cancel-delete"
        onclick=${() => { form.confirmDelete = false; }}
      >
        Cancel
      </button>
      <button type="button" class="confirm-delete" onclick=${confirmDelete}>
        Delete Permanently
      </button>
    </div>
  </div>`;
}

function dialog() {
  const d = form.draft;
  const isProduct = d.linkType === "product";
  const editing = !!d.paymentLinkId;
  const title = `${editing ? "Update" : "Create"} ${isProduct ? "Product" : "Invoice"} Payment Link`;
  const toggleStep = () => {
    step = step === 1 ? 2 : 1;
  };

  return html`<div
    class="dialog-overlay edit-dialog-overlay"
    style="display: flex"
    onclick=${closeOnOverlay(form)}
  >
    <div class="dialog" onclick=${() => { walletMenuOpen = false; }}>
      <div class="dialog-header">
        <h2 class="dialog-title">${title}</h2>
        <button class="close-btn" onclick=${() => { form.open = false; }}>
          &times;
        </button>
      </div>

      <form id="payment-link-form" onsubmit=${submit}>
        <div class="form-tabs">
          <button
            type="button"
            class="form-tab ${step === 1 ? "active" : ""}"
            onclick=${() => { step = 1; }}
          >
            Basic Info
          </button>
          <button
            type="button"
            class="form-tab ${step === 2 ? "active" : ""}"
            onclick=${() => { step = 2; }}
          >
            Amount &amp; Settings
          </button>
          <button
            type="button"
            class="nav-btn next-btn"
            style="margin-left:auto; margin-right: 20px"
            onclick=${toggleStep}
          >
            ${step === 1 ? "Next" : "Back"}
          </button>
        </div>

        <div class="form-step ${step === 1 ? "active" : ""}">
          <div
            class="payment-type-selector"
            style="${editing ? "display: none" : ""}"
          >
            <button
              type="button"
              class="payment-type-btn ${isProduct ? "selected" : ""}"
              onclick=${() => setLinkType("product")}
            >
              ${productIcon}
              <h3>Product Payment</h3>
              <p>
                Create a reusable payment link for products, memberships, or
                services
              </p>
            </button>

            <button
              type="button"
              class="payment-type-btn ${isProduct ? "" : "selected"}"
              onclick=${() => setLinkType("invoice")}
            >
              ${invoiceIcon}
              <h3>Invoice</h3>
              <p>
                Create a one-time payment link for invoices and single
                purchases
              </p>
            </button>
          </div>

          <div class="payment-type-form active ${d.linkType}-form">
            ${isProduct ? productFields : invoiceFields}
          </div>
        </div>

        <div class="form-step ${step === 2 ? "active" : ""}">
          <div class="form-group">
            <label class="form-label">Currency</label>
            <select
              class="${inputClass(form, "currency")}"
              name="currency"
              value=${d.currency}
              onchange=${bind(form, "currency")}
            >
              <option value="XMR">XMR</option>
              <option value="USD">USD</option>
            </select>
            ${errorMessage(form, "currency")}
          </div>

          <div class="form-group">
            <label class="form-label">Amount</label>
            <input
              type="number"
              step="any"
              class="${inputClass(form, "amount")}"
              name="amount"
              placeholder="0.00"
              value=${d.amount}
              oninput=${bind(form, "amount")}
            />
            ${errorMessage(form, "amount")}
            <div
              class="form-hint"
              style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.35rem;"
            >
              usd amount converts to xmr at checkout
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Receiving Wallet</label>
            ${walletDropdown} ${errorMessage(form, "walletId")}
          </div>

          <div class="form-group product-invoice-fields ${isProduct ? "" : "active"}">
            <label class="form-label form-label-optional"
              >Invoice Due Date
            </label>
            <input
              type="date"
              class="${inputClass(form, "dueDate")}"
              name="dueDate"
              value=${d.dueDate}
              oninput=${bind(form, "dueDate")}
            />
            ${errorMessage(form, "dueDate")}
          </div>

          <div class="form-group product-invoice-fields ${isProduct ? "active" : ""}">
            <label class="form-label form-label-optional"
              >Product Quantity</label
            >
            <input
              type="number"
              class="${inputClass(form, "maxUses")}"
              name="maxUses"
              placeholder="Leave blank for unlimited"
              value=${d.maxUses}
              oninput=${bind(form, "maxUses")}
            />
            ${errorMessage(form, "maxUses")}
          </div>

          <div class="form-group">
            <label class="form-label form-label-optional">Success URL</label>
            <input
              type="url"
              class="${inputClass(form, "successUrl")}"
              name="successUrl"
              placeholder="https://..."
              value=${d.successUrl}
              oninput=${bind(form, "successUrl")}
            />
            ${errorMessage(form, "successUrl")}
            <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem;">
              End with <code>checkoutId=</code> to append the actual checkout
              ID on success.
            </div>
          </div>

          ${errorMessage(form, "_form")} ${submitButton(form, title)}
          ${deleteControls}
        </div>
      </form>
    </div>
  </div>`;
}

export function createPaymentLinkForm() {
  return html`<div>${form.open ? dialog : null}</div>`;
}
