import { html, type MiniHtmlString } from "@spirobel/mininext";
import type { ScanSettingOpened } from "@spirobel/monero-wallet-api";
import { makeWalletCreationLink } from "./wallets_list";
import {
  bind,
  closeOnOverlay,
  errorMessage,
  inputClass,
  newFormState,
  openForm,
  postJson,
  setIssues,
  submitButton,
  type FormState,
} from "../form_kit";

type WalletDraft = {
  originalPrimaryAddress: string;
  walletName: string;
  primaryAddress: string;
  secretViewKey: string;
  walletSlot: number | null;
};

const form = newFormState<WalletDraft>({
  originalPrimaryAddress: "",
  walletName: "",
  primaryAddress: "",
  secretViewKey: "",
  walletSlot: null,
});

export function editWallet(primary_address?: string) {
  const wallet = findExistingWallet(primary_address);
  openForm(form, {
    originalPrimaryAddress: wallet?.primary_address || "",
    walletName: wallet?.wallet_name || "",
    primaryAddress: wallet?.primary_address || "",
    secretViewKey: wallet?.secret_view_key || "",
    walletSlot: typeof wallet?.wallet_slot === "number" ? wallet.wallet_slot : null,
  });
}

async function submit(e: Event) {
  e.preventDefault();
  const d = form.draft;
  const input: Record<string, string | number> = {
    walletName: d.walletName.trim(),
    primaryAddress: d.primaryAddress.trim(),
    secretViewKey: d.secretViewKey.trim(),
  };
  if (d.walletSlot !== null) input.walletSlot = d.walletSlot;
  else if (
    d.originalPrimaryAddress &&
    d.originalPrimaryAddress !== input.primaryAddress
  )
    input.originalPrimaryAddress = d.originalPrimaryAddress;

  form.errors = {};
  form.saving = true;
  try {
    const response = await postJson("/editWallet", input);
    if (!response.success) {
      setIssues(form, response.error?.issues);
      return;
    }
    form.open = false;
    window.location.reload();
  } finally {
    form.saving = false;
  }
}

async function confirmDeletion() {
  await postJson("/deleteWallet", {
    primaryAddress: form.draft.originalPrimaryAddress,
  });
  window.location.reload();
}

function deleteControls(state: FormState<WalletDraft>) {
  if (!state.draft.originalPrimaryAddress) return null;
  if (!state.confirmDelete) {
    return html`<button
      type="button"
      class="delete-btn"
      style="display: block"
      onclick=${() => { state.confirmDelete = true; }}
    >
      Delete Wallet
    </button>`;
  }
  return html`<div class="delete-warning show">
    <p>
      <strong>Warning:</strong> This action cannot be undone. Deleting this
      wallet will also remove all associated payment links and transaction
      history.
    </p>
    <div class="warning-actions">
      <button
        type="button"
        class="cancel-delete"
        onclick=${() => { state.confirmDelete = false; }}
      >
        Cancel
      </button>
      <button type="button" class="confirm-delete" onclick=${confirmDeletion}>
        Delete Permanently
      </button>
    </div>
  </div>`;
}

function dialogFrame(title: string, body: () => MiniHtmlString) {
  return html`<div
    class="dialog-overlay edit-dialog-overlay"
    style="display: flex"
    onclick=${closeOnOverlay(form)}
  >
    <div class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">${title}</h2>
        <button class="close-btn" onclick=${() => { form.open = false; }}>
          &times;
        </button>
      </div>
      ${body}
    </div>
  </div>`;
}

function manualWalletForm() {
  const d = form.draft;
  const editing = !!d.originalPrimaryAddress;
  return html`<form id="edit-wallet-form" onsubmit=${submit}>
    <div class="form-group">
      <label class="form-label">Wallet Name</label>
      <input
        type="text"
        class="${inputClass(form, "walletName")}"
        name="walletName"
        required
        placeholder="My XMR Wallet"
        value=${d.walletName}
        oninput=${bind(form, "walletName")}
      />
      ${errorMessage(form, "walletName")}
    </div>

    <div class="form-group">
      <label class="form-label">Primary Address</label>
      <input
        type="text"
        class="${inputClass(form, "primaryAddress")}"
        name="primaryAddress"
        required
        placeholder="Enter the Primary Address ..."
        value=${d.primaryAddress}
        oninput=${bind(form, "primaryAddress")}
      />
      ${errorMessage(form, "primaryAddress")}
    </div>

    <div class="form-group">
      <label class="form-label">Private View Key</label>
      <input
        type="text"
        class="${inputClass(form, "secretViewKey")}"
        name="secretViewKey"
        required
        placeholder="Enter the Private View Key ..."
        value=${d.secretViewKey}
        oninput=${bind(form, "secretViewKey")}
      />
      ${errorMessage(form, "secretViewKey")}
    </div>

    ${errorMessage(form, "_form")}
    ${submitButton(form, editing ? "Update Wallet" : "Add Wallet")}
    ${deleteControls(form)}
  </form>`;
}

function walletSlotForm() {
  const d = form.draft;
  return html`<form id="edit-wallet-slot-form" onsubmit=${submit}>
    <div class="form-group">
      <label class="form-label">Wallet Name</label>
      <input
        type="text"
        class="${inputClass(form, "walletName")}"
        name="walletName"
        required
        placeholder="My XMR Wallet"
        value=${d.walletName}
        oninput=${bind(form, "walletName")}
      />
      ${errorMessage(form, "walletName")}
    </div>
    ${errorMessage(form, "_form")}
    ${submitButton(form, "Update Wallet Name", "margin-bottom: 20px;")}
    <div
      class="form-group"
      style="background: rgba(255,255,255,0.05);border-radius: 12px;padding: 1.5rem;margin-bottom: 1.5rem;border: 1px solid rgba(124,58,237,0.1);"
    >
      <label class="form-label">Primary Address (readonly) </label>
      <input
        type="text"
        class="form-input"
        name="primaryAddress"
        readonly
        style="margin-bottom: 20px;"
        value=${d.primaryAddress}
      />
      <label class="form-label">Private View Key (readonly) </label>
      <input
        type="text"
        class="form-input"
        name="secretViewKey"
        readonly
        style="margin-bottom: 20px;"
        value=${d.secretViewKey}
      />
      <label class="form-label">Wallet Slot (readonly) </label>
      <input
        type="text"
        class="form-input"
        name="walletSlot"
        readonly
        style="margin-bottom: 20px;"
        value=${String(d.walletSlot)}
      />
      <a
        class="restore-wallet-link"
        href="${makeWalletCreationLink(d.walletSlot ?? 0)}"
      >
        Restore Wallet in Extension</a
      >
    </div>
    ${deleteControls(form)}
  </form>`;
}

function dialog() {
  if (form.draft.walletSlot !== null)
    return dialogFrame("Wallet Slot", walletSlotForm);
  const title = form.draft.originalPrimaryAddress
    ? "Edit Wallet"
    : "Add New Wallet";
  return dialogFrame(title, manualWalletForm);
}

export function createWalletForm() {
  return html`<div>${form.open ? dialog : null}</div>`;
}

export function findExistingWallet(
  primary_address?: string,
): ScanSettingOpened | undefined {
  if (!primary_address) return;
  const wallets = window.dashboardData?.scan_settings?.wallets || [];
  return wallets.find((w) => w.primary_address === primary_address) as
    | ScanSettingOpened
    | undefined;
}
