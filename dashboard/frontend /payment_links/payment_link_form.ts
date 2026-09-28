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

      if (currentSelectedButton?.dataset.type !== paymentLink.linkType) {
        const typeButtons = form.querySelectorAll(
          ".payment-type-btn",
        ) as NodeListOf<HTMLButtonElement>;
        typeButtons.forEach((btn) => {
          btn.classList.toggle("selected");
        });

        const typeForms = form.querySelectorAll(
          ".payment-type-form",
        ) as NodeListOf<HTMLDivElement>;
        typeForms.forEach((form) => {
          form.classList.toggle("active");
        });

        const specialFields = form.querySelectorAll(
          ".product-invoice-fields",
        ) as NodeListOf<HTMLDivElement>;
        specialFields.forEach((field) => {
          field.classList.toggle("active");
        });
      }

      if (isProduct) {
        const titleInput = form.querySelector(
          'input[name="productTitle"]',
        ) as HTMLInputElement;
        const descInput = form.querySelector(
          'textarea[name="productDescription"]',
        ) as HTMLTextAreaElement;
        if (titleInput) titleInput.value = paymentLink.title || "";
        if (descInput) descInput.value = paymentLink.description || "";

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

        const productTitleInput = form.querySelector(
          'input[name="productTitle"]',
        ) as HTMLInputElement;
        const productDescInput = form.querySelector(
          'textarea[name="productDescription"]',
        ) as HTMLTextAreaElement;
        if (productTitleInput) productTitleInput.value = "";
        if (productDescInput) productDescInput.value = "";
      }

      const amountInput = form.querySelector(
        'input[name="amount"]',
      ) as HTMLInputElement;
      const currencySelect = form.querySelector(
        'select[name="currency"]',
      ) as HTMLSelectElement;
      if (currencySelect) {
        currencySelect.value =
          paymentLink.currency === "USD" ? "USD" : "XMR";
      }
      if (amountInput) amountInput.value = paymentLink.amount || "";

      const maxUsesInput = form.querySelector(
        'input[name="maxUses"]',
      ) as HTMLInputElement;
      if (maxUsesInput && paymentLink.maxUses) {
        maxUsesInput.value = paymentLink.maxUses.toString();
      } else if (maxUsesInput) {
        maxUsesInput.value = "";
      }

      const dueDateInput = form.querySelector(
        'input[name="dueDate"]',
      ) as HTMLInputElement;
      if (dueDateInput && paymentLink.dueDate) {
        dueDateInput.value = paymentLink.dueDate;
      } else if (dueDateInput) {
        dueDateInput.value = "";
      }

      if (isProduct) {
        const dueDateClear = form.querySelector(
          'input[name="dueDate"]',
        ) as HTMLInputElement;
        if (dueDateClear) dueDateClear.value = "";
      } else {
        const maxUsesClear = form.querySelector(
          'input[name="maxUses"]',
        ) as HTMLInputElement;
        if (maxUsesClear) maxUsesClear.value = "";
      }

      const successUrlInput = form.querySelector(
        'input[name="successUrl"]',
      ) as HTMLInputElement;
      if (successUrlInput) {
        successUrlInput.value = paymentLink.successUrl || "";
      }

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

      const deleteBtn = form.querySelector(".delete-btn") as HTMLButtonElement;
      if (deleteBtn) {
        deleteBtn.style.display = "block";
      }
      const deleteWarning = form.querySelector(
        ".delete-warning",
      ) as HTMLDivElement;
      if (deleteWarning) {
        deleteWarning.classList.remove("show");
      }
    }
  } else {
    form.reset();
    paymentLinkIdInput.value = "";

    const deleteBtn = form.querySelector(".delete-btn") as HTMLButtonElement;
    if (deleteBtn) {
      deleteBtn.style.display = "none";
    }
    const deleteWarning = form.querySelector(
      ".delete-warning",
    ) as HTMLDivElement;
    if (deleteWarning) {
      deleteWarning.classList.remove("show");
    }

    const selectedButton = document.querySelector(
      ".payment-type-btn.selected",
    ) as HTMLButtonElement;
    if (selectedButton?.dataset.type !== "product") {
      changePaymentTypeCB();
    }

    const dialogTitle = document.querySelector(
      ".dialog-title",
    ) as HTMLDivElement;
    const submitButtonText = form.querySelector(
      ".submit-btn .button-text",
    ) as HTMLDivElement;

    if (dialogTitle) dialogTitle.innerText = "Create Product Payment Link";
    if (submitButtonText)
      submitButtonText.innerText = "Create Product Payment Link";

    const typeButtonsCreate = form.querySelectorAll(
      ".payment-type-btn",
    ) as NodeListOf<HTMLButtonElement>;
    typeButtonsCreate.forEach((btn) => {
      btn.disabled = false;
      btn.style.opacity = "1";
      btn.style.cursor = "pointer";
    });

    const paymentTypeSelectorCreate = form.querySelector(
      ".payment-type-selector",
    ) as HTMLDivElement;
    if (paymentTypeSelectorCreate) {
      paymentTypeSelectorCreate.style.display = "flex";
    }
  }

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

    document.querySelectorAll(".form-input").forEach((input) => {
      input.classList.remove("error");
    });
    document.querySelectorAll(".error-message").forEach((msg) => {
      (msg as HTMLDivElement).style.display = "none";
    });

    submitBtn.disabled = true;
    submitBtn.classList.add("loading");

    const formData = new FormData(form);
    const input: any = Object.fromEntries(formData);

    const paymentLinkIdInput = form.querySelector(
      'input[name="paymentLinkId"]',
    ) as HTMLInputElement;
    if (!paymentLinkIdInput?.value) {
      delete input["paymentLinkId"];
    }

    if (!input["walletId"]) {
      const hiddenInput = form.querySelector(
        'input[name="walletId"]',
      ) as HTMLInputElement;
      if (hiddenInput && hiddenInput.value) {
        input["walletId"] = hiddenInput.value;
      }
    }

    for (const key in input) {
      if (key !== "walletId" && typeof input[key] === "string") {
        input[key] = input[key].trim();
        if (input[key] === "") delete input[key];
      }
    }

    for (const key of ["maxUses"]) {
      if (input[key]) {
        input[key] = Number(input[key]);
      }
    }
    const selectedTypeElement = document.querySelector(
      ".payment-type-btn.selected",
    ) as HTMLDivElement;
    input["linkType"] = selectedTypeElement.dataset["type"];

    fetch("editPaymentLink", {
      method: "POST",
      body: JSON.stringify(input),
    }).then(async (result) => {
      const response = await result.json();
      submitBtn.disabled = false;
      submitBtn.classList.remove("loading");
      if (!response.success && response.error) {
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

        if (hasTab1Error) {
          const errorHint = document.getElementById(
            "_form-error",
          ) as HTMLDivElement;
          if (errorHint) {
            errorHint.textContent =
              "Please go back to the Basic Info tab to fix the highlighted errors";
            errorHint.style.display = "block";
          }
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
        editDialog.style.display = "none";
        form.reset();

        const paymentLinkId = response.paymentLinkId;
        if (paymentLinkId) {
          router.navigate(`/payment-links/${paymentLinkId}`);
        }

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
function changePaymentTypeCB(event?: Event) {
  // prevent payment type changes in edit mode
  const form = document.querySelector("#payment-link-form") as HTMLFormElement;
  const paymentLinkIdInput = form.querySelector(
    'input[name="paymentLinkId"]',
  ) as HTMLInputElement;
  if (paymentLinkIdInput?.value) {
    return;
  }

  const alreadySelected = document.querySelector(
    ".payment-type-btn.selected",
  ) as HTMLButtonElement | null;

  let targetType: string | undefined;
  if (event) {
    const target = event.target as HTMLElement;
    const clickedBtn = target.closest(
      ".payment-type-btn",
    ) as HTMLButtonElement | null;
    targetType = clickedBtn?.dataset.type;
    if (targetType && alreadySelected?.dataset.type === targetType) {
      return;
    }
  } else {
    // programmatic call (from openPaymentLinkFormCB) flip to the other type
    targetType =
      alreadySelected?.dataset.type === "product" ? "invoice" : "product";
  }

  if (!targetType) return;

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
    if (btn.dataset.type === targetType) {
      btn.classList.add("selected");
    } else {
      btn.classList.remove("selected");
    }
  }

  const selectedBtn = document.querySelector(
    ".payment-type-btn.selected",
  ) as HTMLButtonElement | null;
  if (selectedBtn?.dataset.type === "product") {
    dialogTitleElement.innerText = "Create Product Payment Link";
    submitButtonTextElement.innerText = "Create Product Payment Link";
  } else {
    dialogTitleElement.innerText = "Create Invoice Payment Link";
    submitButtonTextElement.innerText = "Create Invoice Payment Link";
  }

  for (const typeSelectionForm of typeForms) {
    const formType = (typeSelectionForm as HTMLElement).dataset.type;
    if (formType === selectedBtn?.dataset.type) {
      typeSelectionForm.classList.add("active");
    } else {
      typeSelectionForm.classList.remove("active");
    }
  }

  for (const field of specialFields) {
    if (selectedBtn?.dataset.type === "invoice") {
      field.classList.toggle(
        "active",
        field.querySelector('[name="dueDate"]') !== null,
      );
    } else {
      field.classList.toggle(
        "active",
        field.querySelector('[name="maxUses"]') !== null,
      );
    }
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
              <label class="form-label">Currency</label>
              <select class="form-input" name="currency">
                <option value="XMR" selected>XMR</option>
                <option value="USD">USD</option>
              </select>
              <div class="error-message" id="currency-error"></div>
            </div>

            <div class="form-group">
              <label class="form-label">Amount</label>
              <input
                type="number"
                step="any"
                class="form-input"
                name="amount"
                required
                placeholder="0.00"
              />
              <div class="error-message" id="amount-error"></div>
              <div class="form-hint" style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.35rem;">
                usd amount converts to xmr at checkout
              </div>
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
              <div
                style="font-size: 0.8rem; opacity: 0.7; margin-top: 0.25rem;"
              >
                End with <code>checkoutId=</code> to append the actual checkout
                ID on success.
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


