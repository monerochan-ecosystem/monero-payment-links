import type { Wallet } from "../../../db/schema";

function editWallet(walletId: number | null) {
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
    ".delete-btn"
  ) as HTMLButtonElement;
  deleteBtnElement.style.display = "none";
  // open the edit dialog
  const editDialog = document.querySelector(
    ".edit-dialog-overlay"
  ) as HTMLDivElement;
  editDialog.style.display = "flex";

  const form = document.querySelector("#edit-wallet-form") as HTMLFormElement;
  const walletNameInput = form.querySelector(
    '[name="walletName"]'
  ) as HTMLInputElement;
  const primaryAddressInput = form.querySelector(
    '[name="primaryAddress"]'
  ) as HTMLInputElement;
  const secretViewKeyInput = form.querySelector(
    '[name="secretViewKey"]'
  ) as HTMLInputElement;
  const startHeightInput = form.querySelector(
    '[name="start_height"]'
  ) as HTMLInputElement;
  const daemonUrlInput = form.querySelector(
    '[name="daemonUrl"]'
  ) as HTMLInputElement;
  let wallet = {} as Wallet;
  if (walletId) {
    submitButtonText = "Update Wallet";
    dialogTitle = "Edit Wallet";
    deleteBtnElement.style.display = "block";

    //@ts-ignore
    wallet = window["wallet-" + walletId] as Wallet;
    function confirmDeletion() {
      fetch("deleteWallet", {
        method: "POST",
        body: JSON.stringify({ walletId }),
      }).then(() => window.location.reload());
    }
    //@ts-ignore
    window.confirmDeletion = confirmDeletion;
  }
  // Pre-fill form data
  walletNameInput.value = wallet.walletName || "";
  primaryAddressInput.value = wallet.primaryAddress || "";
  secretViewKeyInput.value = wallet.secretViewKey || "";
  startHeightInput.value = String(wallet.start_height) || "";
  daemonUrlInput.value = wallet.daemonURL || "";
  const dialogTitleElement = document.querySelector(
    ".dialog-title"
  ) as HTMLHeadingElement;
  const submitButtonTextElement = document.querySelector(
    ".submit-btn .button-text"
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
    if (walletId) input.id = walletId;
    if (input["start_height"] === "") delete input["start_height"];
    else {
      input["start_height"] = Number(input["start_height"]);
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
          }
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

//@ts-ignore
window.editWallet = editWallet;
