import { html } from "@spirobel/mininext";
function showDeleteDialogCB() {
  const deleteWarning = document.querySelector(
    ".delete-warning",
  ) as HTMLDivElement;
  const deleteBtn = document.querySelector(".delete-btn") as HTMLButtonElement;

  deleteWarning.classList.add("show");
  deleteBtn.style.display = "none";
}
function clickOutsideCloseCB(e: Event) {
  const dialogOverlay = document.querySelector(
    ".edit-dialog-overlay",
  ) as HTMLDivElement;
  if (e.target === dialogOverlay && dialogOverlay) {
    dialogOverlay.style.display = "none";
  }
}

function hideDeleteDialogCB() {
  const deleteWarning = document.querySelector(
    ".delete-warning",
  ) as HTMLDivElement;
  const deleteBtn = document.querySelector(".delete-btn") as HTMLButtonElement;

  deleteWarning.classList.remove("show");
  deleteBtn.style.display = "block";
}
export type WalletFormFields = {
  timestamp: string | null;
  walletName: string | null;
  primaryAddress: string | null;
  secretViewKey: string | null;
};
function editWallet(primary_address?: string) {
  //delete warning hidden
  const deleteWarning = document.querySelector(
    ".delete-warning",
  ) as HTMLDivElement;
  deleteWarning.classList.remove("show");

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
    ".edit-dialog-overlay",
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
  if (primary_address) {
    submitButtonText = "Update Wallet";
    dialogTitle = "Edit Wallet";
    deleteBtnElement.style.display = "block";

    // Find the wallet in the dashboard data
    const wallets = window.dashboardData?.scan_settings?.wallets || [];
    const existingWallet = wallets.find(
      (w: any) => w.primary_address === primary_address,
    );

    if (existingWallet) {
      wallet = {
        timestamp: null,
        walletName: existingWallet.wallet_name || null,
        primaryAddress: existingWallet.primary_address || null,
        secretViewKey: existingWallet.secret_view_key || null,
      };
    }

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
      console.log(response);
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
