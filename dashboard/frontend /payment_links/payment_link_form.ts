import { flatten, html, type MiniHtmlString } from "@spirobel/mininext";
import { router } from "../dashboard_router";

declare global {
  interface Window {
    changePaymentType: (event?: Event) => void;
    switchActiveTab: () => void;
    openPaymentLinkForm: (paymentLinkId?: string) => void;
    clickOutsideClose: (e: Event) => void;
    toggleWalletDropdown: (event: Event) => void;
    selectWallet: (event: Event) => void;
    showDeletePaymentLinkFormDialog: () => void;
    hideDeletePaymentLinkFormDialog: () => void;
    confirmDeletePaymentLinkForm: () => void;
  }
}

function openPaymentLinkFormCB(paymentLinkId?: string) {
  // Reset previous errors
  document.querySelectorAll(".form-input").forEach((input) => {
    input.classList.remove("error");
  });
  document.querySelectorAll(".error-message").forEach((msg) => {
    (msg as HTMLDivElement).style.display = "none";
  });

  const form = document.querySelector("#payment-link-form") as HTMLFormElement;
  const paymentLinkIdInput = form.querySelector(
    'input[name="paymentLinkId"]',
  ) as HTMLInputElement;

  if (paymentLinkId) {
    // edit mode, populate form with existing data
    const paymentLinks = window.dashboardData?.payment_links || [];
    const paymentLink = paymentLinks.find(
      (link: any) => link.payment_link_id === paymentLinkId,
    );

    if (paymentLink) {
      paymentLinkIdInput.value = paymentLinkId;

      const isProduct = paymentLink.linkType === "product";
      const currentSelectedButton = document.querySelector(
        ".payment-type-btn.selected",
      ) as HTMLButtonElement;

      // In edit mode, manually apply the payment type
      if (currentSelectedButton?.dataset.type !== paymentLink.linkType) {
        // Toggle payment type buttons' selected state
        const typeButtons = form.querySelectorAll(
          ".payment-type-btn",
        ) as NodeListOf<HTMLButtonElement>;
        typeButtons.forEach((btn) => {
          btn.classList.toggle("selected");
        });

        // Toggle payment type forms to show the correct one
        const typeForms = form.querySelectorAll(
          ".payment-type-form",
        ) as NodeListOf<HTMLDivElement>;
        typeForms.forEach((form) => {
          form.classList.toggle("active");
        });

        // Toggle special fields (invoice due date vs product quantity)
        const specialFields = form.querySelectorAll(
          ".product-invoice-fields",
        ) as NodeListOf<HTMLDivElement>;
        specialFields.forEach((field) => {
          field.classList.toggle("active");
        });
      }

      // Populate title and description
      if (isProduct) {
        const titleInput = form.querySelector(
          'input[name="productTitle"]',
        ) as HTMLInputElement;
        const descInput = form.querySelector(
          'textarea[name="productDescription"]',
        ) as HTMLTextAreaElement;
        if (titleInput) titleInput.value = paymentLink.title || "";
        if (descInput) descInput.value = paymentLink.description || "";

        // Clear invoice fields
        const invoiceTitleInput = form.querySelector(
          'input[name="invoiceTitle"]',
        ) as HTMLInputElement;
        const invoiceDescInput = form.querySelector(
          'textarea[name="invoiceDescription"]',
        ) as HTMLTextAreaElement;
        if (invoiceTitleInput) invoiceTitleInput.value = "";
        if (invoiceDescInput) invoiceDescInput.value = "";
      } else {
        const titleInput = form.querySelector(
          'input[name="invoiceTitle"]',
        ) as HTMLInputElement;
        const descInput = form.querySelector(
          'textarea[name="invoiceDescription"]',
        ) as HTMLTextAreaElement;
        if (titleInput) titleInput.value = paymentLink.title || "";
        if (descInput) descInput.value = paymentLink.description || "";

        // Clear product fields
        const productTitleInput = form.querySelector(
          'input[name="productTitle"]',
        ) as HTMLInputElement;
        const productDescInput = form.querySelector(
          'textarea[name="productDescription"]',
        ) as HTMLTextAreaElement;
        if (productTitleInput) productTitleInput.value = "";
        if (productDescInput) productDescInput.value = "";
      }

      // Populate amount
      const amountInput = form.querySelector(
        'input[name="amount"]',
      ) as HTMLInputElement;
      if (amountInput) amountInput.value = paymentLink.amount || "";

      // Populate maxUses
      const maxUsesInput = form.querySelector(
        'input[name="maxUses"]',
      ) as HTMLInputElement;
      if (maxUsesInput && paymentLink.maxUses) {
        maxUsesInput.value = paymentLink.maxUses.toString();
      } else if (maxUsesInput) {
        maxUsesInput.value = "";
      }

      // Populate dueDate
      const dueDateInput = form.querySelector(
        'input[name="dueDate"]',
      ) as HTMLInputElement;
      if (dueDateInput && paymentLink.dueDate) {
        dueDateInput.value = paymentLink.dueDate;
      } else if (dueDateInput) {
        dueDateInput.value = "";
      }

      // Clear type-specific optional fields
      if (isProduct) {
        // Clear invoice-only field
        const dueDateClear = form.querySelector(
          'input[name="dueDate"]',
        ) as HTMLInputElement;
        if (dueDateClear) dueDateClear.value = "";
      } else {
        // Clear product-only field
        const maxUsesClear = form.querySelector(
          'input[name="maxUses"]',
        ) as HTMLInputElement;
        if (maxUsesClear) maxUsesClear.value = "";
      }

      // Populate successUrl
      const successUrlInput = form.querySelector(
        'input[name="successUrl"]',
      ) as HTMLInputElement;
      if (successUrlInput) {
        successUrlInput.value = paymentLink.successUrl || "";
      }

      // Populate wallet selection
      const walletDropdown = form.querySelector(
        ".custom-dropdown-menu",
      ) as HTMLDivElement;
      const walletDisplay = walletDropdown?.querySelector(
        ".dropdown-display",
      ) as HTMLDivElement;
      const walletHiddenInput = form.querySelector(
        'input[name="walletId"]',
      ) as HTMLInputElement;

      const scanSettings = window.dashboardData?.scan_settings;
      const wallets = scanSettings?.wallets || [];
      const selectedWallet = wallets.find(
        (w: any) => w.primary_address === paymentLink.wallet_primary_address,
      );

      if (selectedWallet && walletDisplay && walletHiddenInput) {
        const walletName = selectedWallet.wallet_name || "Unnamed Wallet";
        const walletAddress = selectedWallet.primary_address || "";
        let truncatedAddress = walletAddress;
        if (walletAddress.length > 6) {
          truncatedAddress = `${walletAddress.slice(0, 3)}...${walletAddress.slice(-3)}`;
        }
        const displayName = `${walletName} (${truncatedAddress})`;
        walletDisplay.textContent = displayName;
        walletDisplay.dataset.selectedWallet = walletAddress;
        walletHiddenInput.value = walletAddress;
        walletHiddenInput.dataset.selected = "true";
      }

      // update ui text for edit mode
      const dialogTitle = document.querySelector(
        ".dialog-title",
      ) as HTMLDivElement;
      const submitButtonText = form.querySelector(
        ".submit-btn .button-text",
      ) as HTMLDivElement;

      if (dialogTitle) {
        const typeText = isProduct ? "Product" : "Invoice";
        dialogTitle.innerText = `Update ${typeText} Payment Link`;
      }

      if (submitButtonText) {
        const typeText = isProduct ? "Product" : "Invoice";
        submitButtonText.innerText = `Update ${typeText} Payment Link`;
      }
      const paymentTypeSelector = form.querySelector(
        ".payment-type-selector",
      ) as HTMLDivElement;
      if (paymentTypeSelector) {
        paymentTypeSelector.style.display = "none";
      }

      // Show delete button in edit mode
      const deleteBtn = form.querySelector(".delete-btn") as HTMLButtonElement;
      if (deleteBtn) {
        deleteBtn.style.display = "block";
      }
      // Reset delete warning state
      const deleteWarning = form.querySelector(
        ".delete-warning",
      ) as HTMLDivElement;
      if (deleteWarning) {
        deleteWarning.classList.remove("show");
      }
    }
  } else {
    // create mode, clear form and reset to defaults
    form.reset();
    paymentLinkIdInput.value = "";

    // Hide delete button in create mode
    const deleteBtn = form.querySelector(".delete-btn") as HTMLButtonElement;
    if (deleteBtn) {
      deleteBtn.style.display = "none";
    }
    // Reset delete warning state
    const deleteWarning = form.querySelector(
      ".delete-warning",
    ) as HTMLDivElement;
    if (deleteWarning) {
      deleteWarning.classList.remove("show");
    }

    // reset to product type
    const selectedButton = document.querySelector(
      ".payment-type-btn.selected",
    ) as HTMLButtonElement;
    if (selectedButton?.dataset.type !== "product") {
      changePaymentTypeCB();
    }

    // reset ui text for create mode
    const dialogTitle = document.querySelector(
      ".dialog-title",
    ) as HTMLDivElement;
    const submitButtonText = form.querySelector(
      ".submit-btn .button-text",
    ) as HTMLDivElement;

    if (dialogTitle) dialogTitle.innerText = "Create Product Payment Link";
    if (submitButtonText)
      submitButtonText.innerText = "Create Product Payment Link";

    // enable payment type buttons in create mode
    const typeButtonsCreate = form.querySelectorAll(
      ".payment-type-btn",
    ) as NodeListOf<HTMLButtonElement>;
    typeButtonsCreate.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    });

    // Show payment type selector in create mode
    const paymentTypeSelectorCreate = form.querySelector(
      ".payment-type-selector",
    ) as HTMLDivElement;
    if (paymentTypeSelectorCreate) {
      paymentTypeSelectorCreate.style.display = "flex";
    }
  }

  // open the dialog
  const editDialog = document.querySelector(
    ".edit-dialog-overlay",
  ) as HTMLDivElement;
  editDialog.style.display = "flex";

  setupFormSubmitHandler(form, editDialog);
}

function setupFormSubmitHandler(
  form: HTMLFormElement,
  editDialog: HTMLDivElement,
) {
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

    // Only include paymentLinkId if it's set (for edit mode)
    const paymentLinkIdInput = form.querySelector(
      'input[name="paymentLinkId"]',
    ) as HTMLInputElement;
    if (!paymentLinkIdInput?.value) {
      delete input["paymentLinkId"];
    }

    // Verify walletId is set before trimming
    if (!input["walletId"]) {
      const hiddenInput = form.querySelector(
        'input[name="walletId"]',
      ) as HTMLInputElement;
      if (hiddenInput && hiddenInput.value) {
        input["walletId"] = hiddenInput.value;
      }
    }

    // Trim all string fields except walletId (which is a wallet address)
    for (const key in input) {
      if (key !== "walletId" && typeof input[key] === "string") {
        input[key] = input[key].trim();
        if (input[key] === "") delete input[key];
      }
    }

    // Convert number fields to integers (but NOT walletId, which is a wallet address string)
    for (const key of ["maxUses"]) {
      if (input[key]) {
        input[key] = Number(input[key]);
      }
    }
    // get paymenttype select status and set it here
    const selectedTypeElement = document.querySelector(
      ".payment-type-btn.selected",
    ) as HTMLDivElement;
    input["linkType"] = selectedTypeElement.dataset["type"];

    fetch("editPaymentLink", {
      method: "POST",
      body: JSON.stringify(input),
    }).then(async (result) => {
      const response = await result.json();
      // Re-enable submit button
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (!response.success && response.error) {
        // Handle validation errors
        let hasTab1Error = false;
        response.error.issues.forEach(
          (issue: { path: string[]; message: string }) => {
            const fieldName = issue.path[0];
            if (!fieldName) return;

            const tab1Fields = [
              "productTitle",
              "productDescription",
              "invoiceTitle",
              "invoiceDescription",
            ];

            if (tab1Fields.includes(fieldName)) {
              hasTab1Error = true;
            }

            const input = document.querySelector(`[name="${fieldName}"]`);
            const errorElement = document.getElementById(`${fieldName}-error`);

            if (input && errorElement) {
              input.classList.add("error");
              errorElement.textContent = issue.message;
              errorElement.style.display = "block";
            }
          },
        );

        // If there's a tab 1 error, show hint and switch to tab 1
        if (hasTab1Error) {
          const errorHint = document.getElementById(
            "_form-error",
          ) as HTMLDivElement;
          if (errorHint) {
            errorHint.textContent =
              "Please go back to the Basic Info tab to fix the highlighted errors";
            errorHint.style.display = "block";
          }
          // Switch back to tab 1
          const formTabs = document.querySelectorAll(".form-tab");
          const formSteps = document.querySelectorAll(
            ".form-step",
          ) as NodeListOf<HTMLDivElement>;
          for (const tab of formTabs) {
            tab.classList.toggle("active");
          }
          for (const step of formSteps) {
            step.classList.toggle("active");
          }
          const nextBtn = document.querySelector(
            ".next-btn",
          ) as HTMLButtonElement;
          nextBtn.innerText = "Next";
        }
      } else {
        // Handle success case
        editDialog.style.display = "none";
        form.reset();

        // Navigate to the detail route of the created/edited payment link
        const paymentLinkId = response.paymentLinkId;
        if (paymentLinkId) {
          router.navigate(`/payment-links/${paymentLinkId}`);
        }

        // Reload the page to refresh data
        window.location.reload();
      }
    });
  };
}
function clickOutsideCloseCB(e: Event) {
  const dialogOverlay = document.querySelector(
    ".edit-dialog-overlay",
  ) as HTMLDivElement;
  if (e.target === dialogOverlay && dialogOverlay) {
    dialogOverlay.style.display = "none";
  }
}
function switchActiveTabCB() {
  const formTabs = document.querySelectorAll(".form-tab");
  const nextBtn = document.querySelector(".next-btn") as HTMLButtonElement;
  const formSteps = document.querySelectorAll(
    ".form-step",
  ) as NodeListOf<HTMLDivElement>;

  for (const tab of formTabs) {
    tab.classList.toggle("active");
  }

  for (const step of formSteps) {
    step.classList.toggle("active");
    if (step.dataset.step === "2") {
      if (step.classList.contains("active")) {
        nextBtn.innerText = "Back";
      }
    } else {
      if (step.classList.contains("active")) {
        nextBtn.innerText = "Next";
      }
    }
  }
}
function changePaymentTypeCB() {
  // Prevent payment type changes in edit mode
  const form = document.querySelector("#payment-link-form") as HTMLFormElement;
  const paymentLinkIdInput = form.querySelector(
    'input[name="paymentLinkId"]',
  ) as HTMLInputElement;
  if (paymentLinkIdInput?.value) {
    // In edit mode, don't allow type switching
    return;
  }

  const typeButtons = document.querySelectorAll(
    ".payment-type-btn",
  ) as NodeListOf<HTMLButtonElement>;
  const typeForms = document.querySelectorAll(".payment-type-form");
  const specialFields = document.querySelectorAll(".product-invoice-fields");
  const dialogTitleElement = document.querySelector(
    ".dialog-title",
  ) as HTMLDivElement;
  const submitButtonTextElement = document.querySelector(
    ".submit-btn .button-text",
  ) as HTMLDivElement;
  for (const btn of typeButtons) {
    btn.classList.toggle("selected");
    if (btn.dataset.type === "product") {
      if (btn.classList.contains("selected")) {
        dialogTitleElement.innerText = "Create Product Payment Link";
        submitButtonTextElement.innerText = "Create Product Payment Link";
      }
    } else {
      if (btn.classList.contains("selected")) {
        dialogTitleElement.innerText = "Create Invoice Payment Link";
        submitButtonTextElement.innerText = "Create Invoice Payment Link";
      }
    }
  }

  for (const typeSelectionForm of typeForms) {
    typeSelectionForm.classList.toggle("active");
  }
  for (const field of specialFields) {
    field.classList.toggle("active");
  }
}
function toggleWalletDropdownCB(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const dropdown = document.querySelector(
    ".custom-dropdown-menu",
  ) as HTMLDivElement;
  const menu = dropdown?.querySelector(".dropdown-list") as HTMLDivElement;
  if (menu) {
    menu.classList.toggle("open");
  }
}

function selectWalletCB(event: Event) {
  event.stopPropagation();
  event.preventDefault();

  const target = event.target as HTMLElement;
  const listItem = target.closest(".dropdown-item") as HTMLLIElement;

  if (!listItem) return;

  const address = listItem.dataset.address || "";
  const name = listItem.dataset.name || "";

  const dropdown = document.querySelector(
    ".custom-dropdown-menu",
  ) as HTMLDivElement;
  const display = dropdown?.querySelector(
    ".dropdown-display",
  ) as HTMLDivElement;
  const hiddenInput = document.querySelector(
    'input[name="walletId"]',
  ) as HTMLInputElement;
  const menu = dropdown?.querySelector(".dropdown-list") as HTMLDivElement;

  if (display && hiddenInput && address && name) {
    display.textContent = name;
    display.dataset.selectedWallet = address;
    hiddenInput.value = address;
    hiddenInput.dataset.selected = "true";
  } else {
    console.warn("Failed to set wallet selection", {
      display: !!display,
      hiddenInput: !!hiddenInput,
      address,
      name,
    });
  }

  if (menu) {
    menu.classList.remove("open");
  }
}

function closeWalletDropdownCB() {
  const menu = document.querySelector(".dropdown-list") as HTMLDivElement;
  if (menu) {
    menu.classList.remove("open");
  }
}

// Close dropdown when clicking outside
document.addEventListener("click", closeWalletDropdownCB);

function showDeletePaymentLinkFormDialogCB() {
  const deleteWarning = document.querySelector(
    ".delete-warning",
  ) as HTMLDivElement;
  const deleteBtn = document.querySelector(".delete-btn") as HTMLButtonElement;

  deleteWarning.classList.add("show");
  deleteBtn.style.display = "none";
}

function hideDeletePaymentLinkFormDialogCB() {
  const deleteWarning = document.querySelector(
    ".delete-warning",
  ) as HTMLDivElement;
  const deleteBtn = document.querySelector(".delete-btn") as HTMLButtonElement;

  deleteWarning.classList.remove("show");
  deleteBtn.style.display = "block";
}

function confirmDeletePaymentLinkFormCB() {
  const form = document.querySelector("#payment-link-form") as HTMLFormElement;
  const paymentLinkIdInput = form.querySelector(
    'input[name="paymentLinkId"]',
  ) as HTMLInputElement;
  const paymentLinkId = paymentLinkIdInput?.value;

  if (!paymentLinkId) return;

  // Determine link type from selected button
  const selectedTypeElement = document.querySelector(
    ".payment-type-btn.selected",
  ) as HTMLDivElement;
  const linkType = selectedTypeElement?.dataset["type"] || "product";

  fetch("deletePaymentLink", {
    method: "POST",
    body: JSON.stringify({
      paymentLinkId: paymentLinkId,
      linkType: linkType,
    }),
  }).then(async (result) => {
    const response = await result.json();
    if (response.success) {
      const editDialog = document.querySelector(
        ".edit-dialog-overlay",
      ) as HTMLDivElement;
      editDialog.style.display = "none";
      router.navigate("/payment-links");
      window.location.reload();
    } else {
      console.error("Error deleting payment link:", response.error);
      hideDeletePaymentLinkFormDialogCB();
    }
  });
}

window.changePaymentType = changePaymentTypeCB;
window.switchActiveTab = switchActiveTabCB;
window.openPaymentLinkForm = openPaymentLinkFormCB;
window.clickOutsideClose = clickOutsideCloseCB;
window.toggleWalletDropdown = toggleWalletDropdownCB;
window.selectWallet = selectWalletCB;
window.showDeletePaymentLinkFormDialog = showDeletePaymentLinkFormDialogCB;
window.hideDeletePaymentLinkFormDialog = hideDeletePaymentLinkFormDialogCB;
window.confirmDeletePaymentLinkForm = confirmDeletePaymentLinkFormCB;

export function getWalletOptions(): MiniHtmlString {
  const scanSettings = window.dashboardData?.scan_settings;
  const wallets = scanSettings?.wallets || [];
  const items: MiniHtmlString[] = [];

  if (wallets.length === 0) {
    items.push(
      html`<li class="dropdown-item disabled">No wallets available</li>`,
    );
  } else {
    for (const wallet of wallets) {
      if (!wallet?.primary_address) continue;
      const walletName = wallet.wallet_name || "Unnamed Wallet";
      const walletAddress = wallet.primary_address || "";
      let truncatedAddress = walletAddress;
      if (walletAddress.length > 6) {
        truncatedAddress = `${walletAddress.slice(0, 3)}...${walletAddress.slice(-3)}`;
      }
      const displayName = `${walletName} (${truncatedAddress})`;
      items.push(
        html`<li
          class="dropdown-item"
          onclick="selectWallet(event)"
          data-address="${walletAddress}"
          data-name="${displayName}"
        >
          ${displayName}
        </li>`,
      );
    }
  }

  return flatten(
    items,
    (walletItems) =>
      html`<div class="custom-dropdown-menu">
        <input type="hidden" name="walletId" required />
        <div class="dropdown-display" onclick="toggleWalletDropdown(event)">
          Select a wallet
        </div>
        <ul class="dropdown-list">
          ${walletItems}
        </ul>
      </div>`,
  );
}
export function createPaymentLinkForm() {
  return html`<div>
    ${createPaymentLinkFormStyles}
    <div
      class="dialog-overlay edit-dialog-overlay"
      onclick="clickOutsideClose(event)"
    >
      <div class="dialog">
        <div class="dialog-header">
          <h2 class="dialog-title">Create Product Payment Link</h2>
          <button
            class="close-btn"
            onclick="document.querySelector('.edit-dialog-overlay').style.display = 'none'"
          >
            &times;
          </button>
        </div>

        <form id="payment-link-form">
          ${formTabStyles}
          <div class="form-tabs">
            <button
              type="button"
              class="form-tab active"
              data-step="1"
              onclick="switchActiveTab()"
            >
              Basic Info
            </button>
            <button
              type="button"
              class="form-tab"
              data-step="2"
              onclick="switchActiveTab()"
            >
              Amount &amp; Settings
            </button>
            <button
              type="button"
              class="nav-btn next-btn"
              style="margin-left:auto; margin-right: 20px"
              onclick="switchActiveTab()"
            >
              Next
            </button>
          </div>

          <div class="form-step active" data-step="1">
            ${paymentTypeSelectionStyles}
            <div class="payment-type-selector">
              <button
                type="button"
                class="payment-type-btn selected"
                data-type="product"
                onclick="changePaymentType(event)"
              >
                <svg
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
                </svg>
                <h3>Product Payment</h3>
                <p>
                  Create a reusable payment link for products, memberships, or
                  services
                </p>
              </button>

              <button
                type="button"
                class="payment-type-btn"
                data-type="invoice"
                onclick="changePaymentType(event)"
              >
                <svg
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                >
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8z"
                  ></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <h3>Invoice</h3>
                <p>
                  Create a one-time payment link for invoices and single
                  purchases
                </p>
              </button>
            </div>

            <div
              class="payment-type-form active product-form"
              data-type="product"
            >
              <div>
                <div
                  class="form-group"
                  style="margin-bottom: 1rem; position: relative;"
                >
                  <label
                    class="form-label"
                    style="

                  display: inline-flex;
                  margin-bottom: 1rem;
                  gap: 5px;
                  width: 100%;
              "
                    ><span>Product Title</span>
                    <div
                      style="
                    position: relative;
                    display: flex;
                    align-items: center;
                    flex: 1;
                    max-width: 200px;
                  "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 40"
                        style="
                      width: 100%;
                      height: 40px;
                      position: absolute;
                      top: -10px;
                      left: 0;
                    "
                      >
                        <!-- Curved dotted line with rightward curve -->
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
                    class="form-input product-title"
                    name="productTitle"
                    placeholder="title of your product"
                  />
                  <div class="error-message" id="productTitle-error"></div>
                </div>
                <div
                  class="form-group"
                  style="margin-bottom: 0; position: relative;"
                >
                  <label
                    class="form-label"
                    style="
          display: inline-flex;
          position: relative;
          margin-bottom: 1rem;
          gap: 5px;
          flex-direction: row-reverse;
          width: 100%;
        "
                    ><span>Product Description</span>
                    <div
                      style="
          position: relative;
          display: flex;
          align-items: center;
          flex: 1;
          max-width: 200px;
        "
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 200 40"
                        style="
            width: 100%;
            height: 40px;
            position: absolute;
            top: -10px;
            left: 0;
          "
                      >
                        <!-- Curved dotted line with downward curve at left -->
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
                    class="form-input product-details"
                    name="productDescription"
                    rows="6"
                    placeholder="Describe your product's value proposition..."
                  ></textarea>
                  <div
                    class="error-message"
                    id="productDescription-error"
                  ></div>
                </div>
              </div>
            </div>

            <div class="payment-type-form invoice-form" data-type="invoice">
              <div
                style="background: rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; margin-bottom: 1.5rem; border: 1px solid rgba(124,58,237,0.1);"
              >
                <div class="form-group" style="margin-bottom: 1rem;">
                  <label
                    class="form-label"
                    style="font-size: 0.875rem; opacity: 0.8;"
                    >Invoice Title</label
                  >
                  <input
                    type="text"
                    class="form-input"
                    name="invoiceTitle"
                    placeholder="e.g. Consulting Services - September 2023"
                    style="border-color: rgba(124,58,237,0.2);"
                  />
                  <div class="error-message" id="invoiceTitle-error"></div>
                </div>
                <div class="form-group" style="margin-bottom: 0;">
                  <label
                    class="form-label"
                    style="font-size: 0.875rem; opacity: 0.8;"
                    >Invoice Details</label
                  >
                  <textarea
                    class="form-input"
                    name="invoiceDescription"
                    rows="10"
                    placeholder="Enter invoice details and terms..."
                    style="border-color: rgba(124,58,237,0.2);"
                  ></textarea>
                  <div
                    class="error-message"
                    id="invoiceDescription-error"
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-step" data-step="2">
            <div class="form-group">
              <label class="form-label">Amount (XMR)</label>
              <input
                type="number"
                step="0.0001"
                class="form-input"
                name="amount"
                required
                placeholder="0.00"
              />
              <div class="error-message" id="amount-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Receiving Wallet</label>
              ${getWalletOptions()}
              <div class="error-message" id="walletId-error"></div>
            </div>

            <input type="hidden" name="paymentLinkId" />

            <div class="form-group product-invoice-fields">
              <label class="form-label form-label-optional"
                >Invoice Due Date
              </label>
              <input type="date" class="form-input" name="dueDate" />
              <div class="error-message" id="dueDate-error"></div>
            </div>

            <div class="form-group product-invoice-fields active">
              <label class="form-label form-label-optional"
                >Product Quantity</label
              >
              <input
                type="number"
                class="form-input"
                name="maxUses"
                placeholder="Leave blank for unlimited"
              />
              <div class="error-message" id="maxUses-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label form-label-optional">Success URL</label>
              <input
                type="url"
                class="form-input"
                name="successUrl"
                placeholder="https://..."
              />
              <div class="error-message" id="successUrl-error"></div>
              <div style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem;">
                End with <code>checkoutId=</code> to append the actual checkout ID on success.
              </div>
            </div>

            <div class="error-message" id="_form-error"></div>

            <button type="submit" class="submit-btn">
              <span class="spinner"></span>
              <span class="button-text">Create Product Payment Linkk</span>
            </button>

            <button
              type="button"
              class="delete-btn"
              onclick="showDeletePaymentLinkFormDialog()"
            >
              Delete Payment Link
            </button>

            <div class="delete-warning">
              <p>
                <strong>Warning:</strong> This action cannot be undone. Deleting
                this payment link will permanently remove it and all associated
                data.
              </p>
              <div class="warning-actions">
                <button
                  type="button"
                  class="cancel-delete"
                  onclick="hideDeletePaymentLinkFormDialog()"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  class="confirm-delete"
                  onclick="confirmDeletePaymentLinkForm()"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>`;
}

const createPaymentLinkFormStyles = html`<style>
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

  .delete-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #ef4444;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.75rem;
  }

  .delete-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.5);
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
  }

  .delete-warning.show {
    display: block;
  }

  .delete-warning p {
    color: rgba(248, 250, 252, 0.9);
    font-size: 0.875rem;
    line-height: 1.5;
    margin: 0 0 1rem 0;
  }

  .warning-actions {
    display: flex;
    gap: 0.75rem;
  }

  .cancel-delete {
    flex: 1;
    padding: 0.5rem 1rem;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }

  .cancel-delete:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .confirm-delete {
    flex: 1;
    padding: 0.5rem 1rem;
    background: #ef4444;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .confirm-delete:hover {
    background: #dc2626;
  }

  .form-step {
    display: none;
  }

  .form-step.active {
    display: block;
  }
  .form-label-optional::after {
    content: " (optional)";
    opacity: 0.7;
    font-weight: normal;
    font-size: 0.875em;
  }
  .product-invoice-fields {
    display: none;
  }

  .product-invoice-fields.active {
    display: block;
  }

  .wallet-address {
    display: block;
    font-size: 0.75rem;
    color: var(--accent);
    opacity: 0.8;
    margin-top: 0.25rem;
  }

  .custom-dropdown-menu {
    position: relative;
    width: 100%;
  }

  .dropdown-display {
    padding: 0.75rem;
    background: transparent;
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 8px;
    color: var(--text);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    min-height: 44px;
    white-space: normal;
    word-break: break-word;
  }

  .dropdown-display:empty::before {
    content: "Select a wallet";
    color: rgba(248, 250, 252, 0.5);
  }

  .dropdown-display:hover {
    border-color: var(--accent);
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.1);
  }

  .dropdown-display::after {
    content: "▼";
    margin-left: auto;
    font-size: 0.75rem;
    opacity: 0.6;
    transition: transform 0.3s ease;
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .dropdown-list {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    margin: 0.25rem 0 0 0;
    padding: 0.5rem 0;
    list-style: none;
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 8px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
    backdrop-filter: blur(10px);
  }

  .dropdown-list.open {
    max-height: 300px;
    opacity: 1;
    transform: translateY(0);
    overflow-y: auto;
  }

  .dropdown-item {
    padding: 0.75rem 1rem;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-item:not(.disabled):hover {
    background: rgba(124, 58, 237, 0.2);
    color: var(--accent);
    padding-left: 1.25rem;
  }

  .dropdown-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
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

  @media (max-width: 768px) {
    .payment-type-btn {
      padding: 0.9rem;
    }
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
    padding: 1.2rem;
  }

  .payment-type-form.product-form .form-input:hover,
  .payment-type-form.product-form .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
  }

  .payment-type-form.product-form .form-input {
    transition: all 0.3s ease;
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

  .product-title::placeholder {
    color: var(--accent);
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
    line-height: 1.8;
    font-size: 1.1rem;
    color: rgba(248, 250, 252, 0.9);
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
    padding: 0.5rem;
    position: relative;
    overflow: hidden;
  }
</style>`;
const formTabStyles = html`<style>
  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    margin-bottom: 11px;
    display: none;
  }

  .form-input.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  }
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
