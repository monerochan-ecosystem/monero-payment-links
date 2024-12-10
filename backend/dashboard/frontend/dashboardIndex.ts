import type { Wallet } from "../../../db/schema";

function installButtonHandlers() {
  const dialogOverlay = document.querySelector(
    ".dialog-overlay"
  ) as HTMLDivElement;
  if (!dialogOverlay) return;
  const emptyWalletCard = document.querySelector(".empty-wallet-card");
  if (emptyWalletCard)
    // Make the wallet card clickable to open dialog
    emptyWalletCard.addEventListener("click", () => {
      dialogOverlay.style.display = "flex";
    });

  const addWalletBtn = document.querySelector(".add-wallet-btn");
  if (addWalletBtn)
    // Dialog controls
    addWalletBtn.addEventListener("click", () => {
      dialogOverlay.style.display = "flex";
    });
  const closeBtn = document.querySelector(".close-btn");
  if (closeBtn)
    closeBtn.addEventListener("click", () => {
      dialogOverlay.style.display = "none";
    });

  dialogOverlay.addEventListener("click", (e) => {
    if (e.target === dialogOverlay) {
      dialogOverlay.style.display = "none";
    }
  });
  const addWalletForm = document.querySelector(
    "#add-wallet-form"
  ) as HTMLFormElement;
  if (addWalletForm)
    // Form submission
    addWalletForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const submitBtn = addWalletForm.querySelector(
        ".submit-btn"
      ) as HTMLButtonElement;

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

      const formData = new FormData(addWalletForm);
      const input: any = Object.fromEntries(formData);
      if (input["start_height"] === "") delete input["start_height"];
      else {
        input["start_height"] = Number(input["start_height"]);
      }
      if (input["primaryAddress"])
        input["primaryAddress"] = input["primaryAddress"].trim();
      if (input["secretViewKey"])
        input["secretViewKey"] = input["secretViewKey"].trim();
      fetch("addWallet", {
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
              const errorElement = document.getElementById(
                `${fieldName}-error`
              );

              if (input && errorElement) {
                input.classList.add("error");
                errorElement.textContent = issue.message;
                errorElement.style.display = "block";
              }
            }
          );
        } else {
          // Handle success case
          dialogOverlay.style.display = "none";
          addWalletForm.reset();
        }
      });
    });
}
installButtonHandlers();

// Advanced options toggle
document.addEventListener("DOMContentLoaded", () => {
  const advancedToggle = document.querySelector(".advanced-toggle");
  const showMore = document.querySelector(".show-more") as HTMLElement;
  const showLess = document.querySelector(".show-less") as HTMLElement;
  const advancedFields = document.querySelector(
    ".advanced-fields"
  ) as HTMLElement;
  if (!advancedToggle) return;
  const dialogOverlay = document.querySelector(
    ".dialog-overlay"
  ) as HTMLDivElement;
  if (!dialogOverlay) return;
  advancedToggle.addEventListener("click", () => {
    advancedToggle.classList.toggle("active");
    advancedFields.classList.toggle("active");

    if (advancedFields.classList.contains("active")) {
      advancedFields.style.display = "block";
      showLess.style.display = "block";
      showMore.style.display = "none";
    } else {
      setTimeout(() => {
        advancedFields.style.display = "none";
      }, 300); // Match the transition duration
      showLess.style.display = "none";
      showMore.style.display = "block";
    }
  });
});

function installSyncProgressBar() {
  const syncBar = document.querySelector(".sync-bar") as HTMLElement;
  const syncStatus = document.querySelector(".sync-status") as HTMLElement;
  const totalBlocks = 20;

  function blockAnimation() {
    const blocksContainer = document.querySelector(".blocks-container");
    if (!blocksContainer) return;
    // Create blocks and animate them sequentially
    for (let i = 0; i < totalBlocks; i++) {
      const block = document.createElement("div");
      block.className = "block";
      blocksContainer.appendChild(block);

      setTimeout(() => {
        block.classList.add("synced");
        syncStatus.textContent = `Syncing block ${i + 1} of ${totalBlocks}...`;
        syncBar.style.width = `${((i + 1) / totalBlocks) * 100}%`;

        if (i === totalBlocks - 1) {
          setTimeout(() => {
            syncStatus.textContent = "Sync complete!";
          }, 1000);
        }
      }, i * 300);
    }
  }
  blockAnimation();
  // Add hover effect for blocks
  setTimeout(() => {
    const blocks = document.querySelectorAll(".block");
    blocks.forEach((block, index) => {
      block.addEventListener("mouseover", () => {
        syncStatus.textContent = `Block ${index + 1}: Verified ✓`;
      });

      block.addEventListener("mouseout", () => {
        syncStatus.textContent = "Sync complete!";
      });
    });
  }, totalBlocks * 300 + 1000);
  const walletAddress = document.querySelector(".wallet-address");
  if (walletAddress)
    // Add click handler for wallet address
    walletAddress.addEventListener("click", () => {
      navigator.clipboard
        .writeText(
          "5B5ieVKGSyfAyh68X6AFB48Gnx9diT8jPbWN6UcZHJUZVQSLRhaaHuHQz3dGuxxZDXPYgCXzrkerK3m6Q1tHoougR7VYyd9"
        )
        .then(() => {
          const originalText = syncStatus.textContent;
          syncStatus.textContent = "Address copied to clipboard!";
          setTimeout(() => {
            syncStatus.textContent = originalText;
          }, 2000);
        });
    });
}
installSyncProgressBar();
const dialogOverlay = document.querySelector(".dialog-overlay");
const closeBtn = document.querySelector(".close-btn");
// Delete wallet functionality
const deleteBtn = document.querySelector(".delete-btn");
const deleteWarning = document.querySelector(".delete-warning");
const cancelDeleteBtn = document.querySelector(".cancel-delete");
const confirmDeleteBtn = document.querySelector(".confirm-delete");

deleteBtn.addEventListener("click", () => {
  deleteWarning.classList.add("show");
  deleteBtn.style.display = "none";
});

cancelDeleteBtn.addEventListener("click", () => {
  deleteWarning.classList.remove("show");
  deleteBtn.style.display = "block";
});

confirmDeleteBtn.addEventListener("click", async () => {
  confirmDeleteBtn.disabled = true;
  cancelDeleteBtn.disabled = true;

  try {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Close dialog and reset state
    dialogOverlay.style.display = "none";
    deleteWarning.classList.remove("show");
    deleteBtn.style.display = "block";
    addWalletForm.reset();

    // Could add a toast notification here
    syncStatus.textContent = "Wallet deleted successfully";
    setTimeout(() => {
      syncStatus.textContent = "Sync complete!";
    }, 2000);
  } catch (error) {
    console.error("Error deleting wallet:", error);
  } finally {
    confirmDeleteBtn.disabled = false;
    cancelDeleteBtn.disabled = false;
  }
});

// Reset delete warning state when dialog is closed
[closeBtn, dialogOverlay].forEach((element) => {
  element.addEventListener("click", (e) => {
    if (e.target === element) {
      deleteWarning.classList.remove("show");
      deleteBtn.style.display = "block";
    }
  });
});

function editWallet(walletId: number | null) {
  console.log("EDIT WALLT ", walletId);
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
}

//@ts-ignore
window.editWallet = editWallet;

// Add close handler for edit dialog
//@ts-ignore
document
  .querySelector(".edit-dialog-overlay .close-btn")
  .addEventListener("click", () => {
    //@ts-ignore
    document.querySelector(".edit-dialog-overlay").style.display = "none";
  });

// Add click outside handler for edit dialog
//@ts-ignore
document
  .querySelector(".edit-dialog-overlay")
  .addEventListener("click", (e) => {
    if (e.target === document.querySelector(".edit-dialog-overlay")) {
      //@ts-ignore
      document.querySelector(".edit-dialog-overlay").style.display = "none";
    }
  });

// Handle edit form submission
document
  .querySelector("#edit-wallet-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();
    const submitBtn = e.target.querySelector(".submit-btn");

    // Reset previous errors
    e.target.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("error");
    });
    e.target.querySelectorAll(".error-message").forEach((msg) => {
      msg.style.display = "none";
    });

    // Disable button and show loading state
    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Close dialog on success
      document.querySelector(".edit-dialog-overlay").style.display = "none";
      e.target.reset();
    } catch (error) {
      console.error("Error:", error);
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
    }
  });
