import { html } from "@spirobel/mininext";
import { router } from "../dashboard_router";
import type { ScanSettingOpened } from "@spirobel/monero-wallet-api";
import { makeWalletCreationLink } from "./wallets_list";

function showDeleteDialogCB() {
  const deleteWarnings = document.querySelectorAll(
    ".delete-warning",
  ) as NodeListOf<HTMLDivElement>;
  const deleteBtns = document.querySelectorAll(
    ".delete-btn",
  ) as NodeListOf<HTMLButtonElement>;
  for (const deleteWarning of deleteWarnings) {
    deleteWarning.classList.add("show");
  }
  for (const deleteBtn of deleteBtns) {
    deleteBtn.style.display = "none";
  }
}
function clickOutsideCloseCB(e?: Event) {
  const dialogOverlays = document.querySelectorAll(
    ".edit-dialog-overlay",
  ) as NodeListOf<HTMLDivElement>;
  for (const dialogOverlay of dialogOverlays) {
    if (e && e.target === dialogOverlay && dialogOverlay) {
      dialogOverlay.style.display = "none";
    }
    if (!e) {
      dialogOverlay.style.display = "none";
    }
  }
}

function hideDeleteDialogCB() {
  const deleteWarnings = document.querySelectorAll(
    ".delete-warning",
  ) as NodeListOf<HTMLDivElement>;
  const deleteBtns = document.querySelectorAll(
    ".delete-btn",
  ) as NodeListOf<HTMLButtonElement>;
  for (const deleteWarning of deleteWarnings) {
    deleteWarning.classList.remove("show");
  }
  for (const deleteBtn of deleteBtns) {
    deleteBtn.style.display = "block";
  }
}
export type WalletFormFields = {
  timestamp: string | null;
  walletName: string | null;
  primaryAddress: string | null;
  secretViewKey: string | null;
  walletSlot?: number | null;
};
function editWalletSlot(existingWallet: ScanSettingOpened) {
  const editDialog = document.querySelector(
    "#edit-wallet-slot-dialog-overlay",
  ) as HTMLDivElement;
  editDialog.style.display = "flex";
  const form = document.querySelector(
    "#edit-wallet-slot-form",
  ) as HTMLFormElement;
  const walletNameInput = form.querySelector(
    '[name="walletName"]',
  ) as HTMLInputElement;
  const primaryAddressInput = form.querySelector(
    '[name="primaryAddress"]',
  ) as HTMLInputElement;
  const secretViewKeyInput = form.querySelector(
    '[name="secretViewKey"]',
  ) as HTMLInputElement;
  const walletSlotInput = form.querySelector(
    '[name="walletSlot"]',
  ) as HTMLInputElement;

  let wallet = {} as WalletFormFields;
  if (existingWallet) {
    wallet = {
      timestamp: null,
      walletName: existingWallet.wallet_name || null,
      primaryAddress: existingWallet.primary_address || null,
      secretViewKey: existingWallet.secret_view_key || null,
      walletSlot: existingWallet.wallet_slot,
    };

    function confirmDeletion() {
      fetch("deleteWallet", {
        method: "POST",
        body: JSON.stringify({
          primaryAddress: existingWallet.primary_address,
        }),
      }).then(() => window.location.reload());
    }
    //@ts-ignore
    window.confirmDeletion = confirmDeletion;
  }
  // Pre-fill form data
  walletNameInput.value = wallet.walletName || "";
  primaryAddressInput.value = wallet.primaryAddress || "";
  secretViewKeyInput.value = wallet.secretViewKey || "";
  walletSlotInput.value = String(wallet.walletSlot);
  const restoreWalletLink = document.querySelector(
    "#restore-wallet-link",
  ) as HTMLAnchorElement;
  restoreWalletLink.href = makeWalletCreationLink(wallet.walletSlot!);
  form.onsubmit = (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector(".submit-btn") as HTMLButtonElement;

    // Reset previous errors
    document.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("error");
    });
    document.querySelectorAll(".error-message").forEach((msg) => {
      (msg as HTMLDivElement).style.display = "none";
    });

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    const formData = new FormData(form);
    const input: any = Object.fromEntries(formData);

    if (input["primaryAddress"])
      input["primaryAddress"] = input["primaryAddress"].trim();
    if (input["secretViewKey"])
      input["secretViewKey"] = input["secretViewKey"].trim();
    if (input["walletName"]) input["walletName"] = input["walletName"].trim();
    if (input["walletSlot"]) input["walletSlot"] = Number(input["walletSlot"]);
    fetch("editWallet", {
      method: "POST",
      body: JSON.stringify(input),
    }).then(async (result) => {
      const response = await result.json();
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (!response.success && response.error) {
        // Handle validation errors
        response.error.issues.forEach(
          (issue: { path: string[]; message: string }) => {
            const fieldName = issue.path[0];
            const input = document.querySelector(`[name="${fieldName}"]`);
            const errorElement = document.getElementById(`${fieldName}-error`);

            if (input && errorElement) {
              input.classList.add("error");
              errorElement.textContent = issue.message;
              errorElement.style.display = "block";
            }
          },
        );
      } else {
        // Handle success case
        editDialog.style.display = "none";
        form.reset();

        // Navigate to wallets page
        router.navigate("/wallets");

        // Reload the page to refresh data
        window.location.reload();
      }
    });
  };
}
function editWallet(primary_address?: string) {
  //delete warning hidden
  const deleteWarning = document.querySelector(
    ".delete-warning",
  ) as HTMLDivElement;
  deleteWarning.classList.remove("show");

  const existingWallet = findExistingWallet(primary_address);
  if (typeof existingWallet?.wallet_slot === "number") {
    editWalletSlot(existingWallet);
    return;
  }
  // Reset previous errors
  document.querySelectorAll(".form-input").forEach((input) => {
    input.classList.remove("error");
  });
  document.querySelectorAll(".error-message").forEach((msg) => {
    (msg as HTMLDivElement).style.display = "none";
  });
  let submitButtonText = "Add Wallet";
  let dialogTitle = "Add New Wallet";
  const deleteBtnElement = document.querySelector(
    ".delete-btn",
  ) as HTMLButtonElement;
  deleteBtnElement.style.display = "none";
  // open the edit dialog
  const editDialog = document.querySelector(
    "#edit-wallet-dialog-overlay",
  ) as HTMLDivElement;
  editDialog.style.display = "flex";

  const form = document.querySelector("#edit-wallet-form") as HTMLFormElement;
  const walletNameInput = form.querySelector(
    '[name="walletName"]',
  ) as HTMLInputElement;
  const primaryAddressInput = form.querySelector(
    '[name="primaryAddress"]',
  ) as HTMLInputElement;
  const secretViewKeyInput = form.querySelector(
    '[name="secretViewKey"]',
  ) as HTMLInputElement;

  let wallet = {} as WalletFormFields;
  if (existingWallet) {
    submitButtonText = "Update Wallet";
    dialogTitle = "Edit Wallet";
    deleteBtnElement.style.display = "block";

    wallet = {
      timestamp: null,
      walletName: existingWallet.wallet_name || null,
      primaryAddress: existingWallet.primary_address || null,
      secretViewKey: existingWallet.secret_view_key || null,
    };

    function confirmDeletion() {
      fetch("deleteWallet", {
        method: "POST",
        body: JSON.stringify({ primaryAddress: primary_address }),
      }).then(() => window.location.reload());
    }
    //@ts-ignore
    window.confirmDeletion = confirmDeletion;
  }
  // Pre-fill form data
  walletNameInput.value = wallet.walletName || "";
  primaryAddressInput.value = wallet.primaryAddress || "";
  secretViewKeyInput.value = wallet.secretViewKey || "";

  const dialogTitleElement = document.querySelector(
    ".dialog-title",
  ) as HTMLHeadingElement;
  const submitButtonTextElement = document.querySelector(
    ".submit-btn .button-text",
  ) as HTMLSpanElement;
  submitButtonTextElement.innerText = submitButtonText;
  dialogTitleElement.innerText = dialogTitle;

  form.onsubmit = (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector(".submit-btn") as HTMLButtonElement;

    // Reset previous errors
    document.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("error");
    });
    document.querySelectorAll(".error-message").forEach((msg) => {
      (msg as HTMLDivElement).style.display = "none";
    });

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    const formData = new FormData(form);
    const input: any = Object.fromEntries(formData);

    // If editing an existing wallet, include the original primary address
    if (primary_address && wallet.primaryAddress !== input["primaryAddress"]) {
      input.originalPrimaryAddress = primary_address;
    }

    if (input["primaryAddress"])
      input["primaryAddress"] = input["primaryAddress"].trim();
    if (input["secretViewKey"])
      input["secretViewKey"] = input["secretViewKey"].trim();
    if (input["walletName"]) input["walletName"] = input["walletName"].trim();
    fetch("editWallet", {
      method: "POST",
      body: JSON.stringify(input),
    }).then(async (result) => {
      const response = await result.json();
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (!response.success && response.error) {
        // Handle validation errors
        response.error.issues.forEach(
          (issue: { path: string[]; message: string }) => {
            const fieldName = issue.path[0];
            const input = document.querySelector(`[name="${fieldName}"]`);
            const errorElement = document.getElementById(`${fieldName}-error`);

            if (input && errorElement) {
              input.classList.add("error");
              errorElement.textContent = issue.message;
              errorElement.style.display = "block";
            }
          },
        );
      } else {
        // Handle success case
        editDialog.style.display = "none";
        form.reset();

        // Navigate to wallets page
        router.navigate("/wallets");

        // Reload the page to refresh data
        window.location.reload();
      }
    });
  };
}

window.editWallet = editWallet;
window.showDeleteDialog = showDeleteDialogCB;
window.hideDeleteDialog = hideDeleteDialogCB;
window.clickOutsideClose = clickOutsideCloseCB;
export function createWalletForm() {
  return html` <div
    class="dialog-overlay edit-dialog-overlay"
    id="edit-wallet-dialog-overlay"
    onclick="clickOutsideClose(event)"
  >
    <div class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title"></h2>
        <button
          class="close-btn"
          onclick="document.querySelector('.edit-dialog-overlay').style.display = 'none'"
        >
          &times;
        </button>
      </div>

      <form id="edit-wallet-form">
        <div class="form-group">
          <label class="form-label">Wallet Name</label>
          <input
            type="text"
            class="form-input"
            name="walletName"
            required
            placeholder="My XMR Wallet"
          />
          <div class="error-message" id="walletName-error"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Primary Address</label>
          <input
            type="text"
            class="form-input"
            name="primaryAddress"
            required
            placeholder="Enter the Primary Address ..."
          />
          <div class="error-message" id="primaryAddress-error"></div>
        </div>

        <div class="form-group">
          <label class="form-label">Private View Key</label>
          <input
            type="text"
            class="form-input"
            name="secretViewKey"
            required
            placeholder="Enter the Private View Key ..."
          />
          <div class="error-message" id="secretViewKey-error"></div>
        </div>

        <button type="submit" class="submit-btn">
          <span class="spinner"></span>
          <span class="button-text"></span>
        </button>

        <button type="button" class="delete-btn" onclick="showDeleteDialog()">
          Delete Wallet
        </button>

        <div class="delete-warning">
          <p>
            <strong>Warning:</strong> This action cannot be undone. Deleting
            this wallet will also remove all associated payment links and
            transaction history.
          </p>
          <div class="warning-actions">
            <button
              type="button"
              class="cancel-delete"
              onClick="hideDeleteDialog()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="confirm-delete"
              onClick="confirmDeletion()"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>`;
}

export function createWalletSlotForm() {
  return html` <div
    class="dialog-overlay edit-dialog-overlay"
    id="edit-wallet-slot-dialog-overlay"
    onclick="clickOutsideClose(event)"
  >
    <div class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">Wallet Slot</h2>
        <button class="close-btn" onclick="clickOutsideClose()">&times;</button>
      </div>

      <form id="edit-wallet-slot-form">
        <div class="form-group">
          <label class="form-label">Wallet Name</label>
          <input
            type="text"
            class="form-input"
            name="walletName"
            required
            placeholder="My XMR Wallet"
          />
          <div class="error-message" id="walletName-error"></div>
        </div>
        <button type="submit" class="submit-btn" style="margin-bottom: 20px;">
          <span class="spinner"></span>
          <span class="button-text">Update Wallet Name</span>
        </button>
        <div
          class="form-group"
          style="background: rgba(255,255,255,0.05);border-radius: 12px;padding: 1.5rem;margin-bottom: 1.5rem;border: 1px solid rgba(124,58,237,0.1);"
        >
          <label class="form-label">Primary Address (readonly) </label>
          <input
            type="text"
            class="form-input"
            name="primaryAddress"
            required
            placeholder="Enter the Primary Address ..."
            readonly
            style="margin-bottom: 20px;"
          />
          <label class="form-label">Private View Key (readonly) </label>
          <input
            type="text"
            class="form-input"
            name="secretViewKey"
            required
            placeholder="Enter the Private View Key ..."
            readonly
            style="margin-bottom: 20px;"
          />
          <label class="form-label">Wallet Slot (readonly) </label>

          <input
            type="text"
            class="form-input"
            name="walletSlot"
            required
            readonly
            style="margin-bottom: 20px;"
          />
          <a class="restore-wallet-link" id="restore-wallet-link">
            Restore Wallet in Extension</a
          >
        </div>

        <button type="button" class="delete-btn" onclick="showDeleteDialog()">
          Delete Wallet
        </button>

        <div class="delete-warning">
          <p>
            <strong>Warning:</strong> This action cannot be undone. Deleting
            this wallet will also remove all associated payment links and
            transaction history.
          </p>
          <div class="warning-actions">
            <button
              type="button"
              class="cancel-delete"
              onClick="hideDeleteDialog()"
            >
              Cancel
            </button>
            <button
              type="button"
              class="confirm-delete"
              onClick="confirmDeletion()"
            >
              Delete Permanently
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>`;
}

export function findExistingWallet(
  primary_address?: string,
): ScanSettingOpened | undefined {
  if (!primary_address) return;
  const wallets = window.dashboardData?.scan_settings?.wallets || [];
  const existingWallet = wallets.find(
    (w) => w.primary_address === primary_address,
  );
  return existingWallet as ScanSettingOpened;
}
