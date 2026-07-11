import { html, flatten } from "@spirobel/mininext";
import { themeNames } from "../../../theme/theme";

function toggleThemeDropdown(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const target = event.target as HTMLElement;
  const dropdown = target.closest(".custom-dropdown-menu") as HTMLDivElement;
  const menu = dropdown?.querySelector(".dropdown-list") as HTMLDivElement;
  if (menu) menu.classList.toggle("open");
}

function selectThemeDropdown(event: Event) {
  event.stopPropagation();
  event.preventDefault();
  const target = event.target as HTMLElement;
  const item = target.closest(".dropdown-item") as HTMLLIElement;
  if (!item) return;
  const value = item.dataset.value;
  const name = item.dataset.name;
  const dropdown = item.closest(".custom-dropdown-menu") as HTMLDivElement;
  const display = dropdown?.querySelector(
    ".dropdown-display",
  ) as HTMLDivElement;
  const hiddenInput = dropdown?.querySelector(
    'input[type="hidden"]',
  ) as HTMLInputElement;
  if (display) {
    display.textContent = (name || value) ?? "";
  }
  if (hiddenInput) {
    hiddenInput.value = value || "";
  }
  const menu = dropdown?.querySelector(".dropdown-list") as HTMLDivElement;
  if (menu) menu.classList.remove("open");
}

// close any open theme dropdown on outside click
document.addEventListener("click", () => {
  document.querySelectorAll(".theme-dropdown-list.open").forEach((menu) => {
    menu.classList.remove("open");
  });
});

function themeSelect(name: string) {
  const items = themeNames.map(
    (n) =>
      html`<li
        class="dropdown-item"
        onclick="selectThemeDropdown(event)"
        data-value="${n}"
        data-name="${n.charAt(0).toUpperCase() + n.slice(1)}"
      >
        ${n.charAt(0).toUpperCase() + n.slice(1)}
      </li>`,
  );

  if (items.length === 0) {
    items.push(html`<li class="dropdown-item disabled">No themes</li>`);
  }

  return flatten(
    items,
    (listItems) => html`<div class="custom-dropdown-menu">
      <input type="hidden" name="${name}" />
      <div class="dropdown-display" onclick="toggleThemeDropdown(event)">
        Select a theme
      </div>
      <ul class="dropdown-list theme-dropdown-list">${listItems}</ul>
    </div>`,
  );
}

function openNodeUrlForm() {
  const dialog = document.querySelector(
    "#settings-dialog-overlay",
  ) as HTMLDivElement;
  dialog.style.display = "flex";

  document.querySelectorAll(".settings-form-input").forEach((input) => {
    (input as HTMLInputElement).classList.remove("error");
  });
  document.querySelectorAll(".settings-error-message").forEach((msg) => {
    msg.textContent = "";
    (msg as HTMLDivElement).style.display = "none";
  });

  const scanSettings = window.dashboardData?.scan_settings;
  if (scanSettings) {
    const nodeurlInput = document.querySelector(
      '[name="nodeurl"]',
    ) as HTMLInputElement;
    const startHeightInput = document.querySelector(
      '[name="start_height"]',
    ) as HTMLInputElement;
    const merchantConfirmationsInput = document.querySelector(
      '[name="merchant_confirmations"]',
    ) as HTMLInputElement;

    if (nodeurlInput && scanSettings.node_url) {
      nodeurlInput.value = scanSettings.node_url;
    }
    if (
      startHeightInput &&
      scanSettings.start_height !== undefined &&
      scanSettings.start_height !== null
    ) {
      startHeightInput.value = String(scanSettings.start_height);
    }
    if (
      merchantConfirmationsInput &&
      scanSettings.merchant_confirmations !== undefined &&
      scanSettings.merchant_confirmations !== null
    ) {
      merchantConfirmationsInput.value = String(
        scanSettings.merchant_confirmations,
      );
    }
  }

  const connectionForm = document.querySelector(
    "#connection-form",
  ) as HTMLFormElement;

  if (connectionForm) {
    connectionForm.onsubmit = async (e) => {
      e.preventDefault();

      document.querySelectorAll(".settings-form-input").forEach((input) => {
        (input as HTMLInputElement).classList.remove("error");
      });
      document.querySelectorAll(".settings-error-message").forEach((msg) => {
        msg.textContent = "";
        (msg as HTMLDivElement).style.display = "none";
      });

      const submitBtn = connectionForm.querySelector(
        ".submit-btn",
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");

      try {
        const formData = new FormData(connectionForm);
        const input: any = Object.fromEntries(formData);

        if (input.nodeurl) input.nodeurl = input.nodeurl.trim();
        if (input.start_height) input.start_height = Number(input.start_height);
        if (input.merchant_confirmations)
          input.merchant_confirmations = Number(input.merchant_confirmations);

        const response = await fetch("/updateNodeUrl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          if (result.error?.issues && Array.isArray(result.error.issues)) {
            result.error.issues.forEach(
              (issue: { path: string[]; message: string }) => {
                const fieldName = issue.path[0] || "nodeurl";
                const fieldInput = connectionForm.querySelector(
                  `[name="${fieldName}"]`,
                ) as HTMLInputElement;
                const errorDiv = connectionForm.querySelector(
                  `#${fieldName}-error`,
                ) as HTMLDivElement;

                if (fieldInput) fieldInput.classList.add("error");
                if (errorDiv) {
                  errorDiv.textContent = issue.message;
                  errorDiv.style.display = "block";
                }
              },
            );
          } else {
            const nodeUrlError = connectionForm.querySelector(
              "#nodeurl-error",
            ) as HTMLDivElement;

            if (nodeUrlError) {
              nodeUrlError.textContent =
                result.error?.message || "Failed to update settings";
              nodeUrlError.style.display = "block";
            }
          }

          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
          return;
        }

        closeNodeUrlForm();
        window.location.reload();
      } catch (error) {
        console.error("Error updating settings:", error);
        const nodeUrlError = connectionForm.querySelector(
          "#nodeurl-error",
        ) as HTMLDivElement;

        if (nodeUrlError) {
          nodeUrlError.textContent =
            "An error occurred while updating. Please try again.";
          nodeUrlError.style.display = "block";
        }

        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
      }
    };
  }

  const themeForm = document.querySelector("#theme-form") as HTMLFormElement;
  if (themeForm) {
    themeForm.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(themeForm);
      const input: any = Object.fromEntries(formData);

      const submitBtn = themeForm.querySelector(
        ".submit-btn",
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");

      try {
        const response = await fetch("/updateTheme", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          console.error("Failed to update theme:", result.error);
          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
          return;
        }

        closeNodeUrlForm();
        window.location.reload();
      } catch (error) {
        console.error("Error updating theme:", error);
        submitBtn.disabled = false;
        submitBtn.classList.remove("loading");
      }
    };
  }

  // set theme dropdown display from hydrated data
  for (const fieldName of ["checkout_theme", "dashboard_theme"]) {
    const themeKey = fieldName === "checkout_theme" ? "theme_checkout" : "theme_dashboard";
    const hInput = document.querySelector(
      `.custom-dropdown-menu input[name="${fieldName}"]`,
    ) as HTMLInputElement;
    const displayEl = hInput
      ?.closest(".custom-dropdown-menu")
      ?.querySelector(".dropdown-display") as HTMLDivElement;
    const val = (window.dashboardData as any)?.[themeKey] || "stripe";
    if (hInput) hInput.value = val;
    if (displayEl) {
      displayEl.textContent = val.charAt(0).toUpperCase() + val.slice(1);
    }
  }
}

function closeNodeUrlForm() {
  const dialog = document.querySelector(
    "#settings-dialog-overlay",
  ) as HTMLDivElement;
  dialog.style.display = "none";
}

function clickOutsideNodeUrlClose(e?: Event) {
  const dialogOverlay = document.querySelector(
    "#settings-dialog-overlay",
  ) as HTMLDivElement;
  if (e && e.target === dialogOverlay && dialogOverlay) {
    dialogOverlay.style.display = "none";
  }
  if (!e) {
    dialogOverlay.style.display = "none";
  }
}

function switchSettingsTab() {
  const formTabs = document.querySelectorAll(".settings-tab");
  const formSteps = document.querySelectorAll(
    ".settings-step",
  ) as NodeListOf<HTMLDivElement>;

  for (const tab of formTabs) {
    tab.classList.toggle("active");
  }

  for (const step of formSteps) {
    step.classList.toggle("active");
  }
}

export function createNodeUrlForm() {
  return html`<div
    class="dialog-overlay"
    id="settings-dialog-overlay"
    onclick="clickOutsideNodeUrlClose(event)"
  >
    <div class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">Settings</h2>
        <button class="close-btn" onclick="closeNodeUrlForm()">×</button>
      </div>

      <div class="form-tabs">
        <button
          type="button"
          class="settings-tab form-tab active"
          onclick="switchSettingsTab()"
        >
          Connection
        </button>
        <button
          type="button"
          class="settings-tab form-tab"
          onclick="switchSettingsTab()"
        >
          Theme
        </button>
      </div>

      <div class="settings-step form-step active">
        <form id="connection-form">
          <div class="form-group">
            <label class="form-label">Node URL</label>
            <input
              type="text"
              class="settings-form-input form-input"
              name="nodeurl"
              placeholder="http://node.example.com:18081"
            />
            <div
              class="settings-error-message error-message"
              id="nodeurl-error"
            ></div>
          </div>

          <div class="form-group">
            <label class="form-label">Start Height</label>
            <input
              type="number"
              class="settings-form-input form-input"
              name="start_height"
              placeholder="0"
              min="0"
            />
            <div
              class="settings-error-message error-message"
              id="start_height-error"
            ></div>
          </div>

          <div class="form-group">
            <label class="form-label">Minimum Payment Confirmations</label>
            <input
              type="number"
              class="settings-form-input form-input"
              name="merchant_confirmations"
              placeholder="10"
              min="0"
            />
            <div
              class="settings-error-message error-message"
              id="merchant_confirmations-error"
            ></div>
          </div>

          <button type="submit" class="submit-btn">
            <span class="spinner"></span>
            <span class="button-text">Update Connection Settings</span>
          </button>
        </form>
      </div>

      <div class="settings-step form-step">
        <form id="theme-form">
          <div class="form-group">
            <label class="form-label">Checkout Theme</label>
            ${themeSelect("checkout_theme")}
          </div>

          <div class="form-group">
            <label class="form-label">Dashboard Theme</label>
            ${themeSelect("dashboard_theme")}
          </div>

          <button type="submit" class="submit-btn">
            <span class="spinner"></span>
            <span class="button-text">Update Theme</span>
          </button>
        </form>
      </div>
    </div>
  </div>`;
}

declare global {
  interface Window {
    openNodeUrlForm: () => void;
    closeNodeUrlForm: () => void;
    clickOutsideNodeUrlClose: (e?: Event) => void;
    switchSettingsTab: () => void;
    toggleThemeDropdown: (event: Event) => void;
    selectThemeDropdown: (event: Event) => void;
  }
}

window.openNodeUrlForm = openNodeUrlForm;
window.closeNodeUrlForm = closeNodeUrlForm;
window.clickOutsideNodeUrlClose = clickOutsideNodeUrlClose;
window.switchSettingsTab = switchSettingsTab;
window.toggleThemeDropdown = toggleThemeDropdown;
window.selectThemeDropdown = selectThemeDropdown;