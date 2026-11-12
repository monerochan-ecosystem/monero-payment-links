import { html } from "@spirobel/mininext";
import { themeNames } from "../../../theme/theme";
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
} from "../form_kit";

type SettingsDraft = {
  nodeurl: string;
  start_height: string;
  merchant_confirmations: string;
  checkout_theme: string;
  dashboard_theme: string;
};

const form = newFormState<SettingsDraft>({
  nodeurl: "",
  start_height: "",
  merchant_confirmations: "",
  checkout_theme: "",
  dashboard_theme: "",
});
let tab: "connection" | "theme" = "connection";
let openThemeMenu: keyof SettingsDraft | null = null;

export function openNodeUrlForm() {
  const s = window.dashboardData?.scan_settings;
  const data = window.dashboardData;
  tab = "connection";
  openThemeMenu = null;
  openForm(form, {
    nodeurl: s?.node_url ?? "",
    start_height: s?.start_height != null ? String(s.start_height) : "",
    merchant_confirmations:
      s?.merchant_confirmations != null ? String(s.merchant_confirmations) : "",
    checkout_theme: data?.theme_checkout || "stripe",
    dashboard_theme: data?.theme_dashboard || "stripe",
  });
}

async function submitConnection(e: Event) {
  e.preventDefault();
  const d = form.draft;
  const input: Record<string, string | number> = { nodeurl: d.nodeurl.trim() };
  if (d.start_height) input.start_height = Number(d.start_height);
  if (d.merchant_confirmations)
    input.merchant_confirmations = Number(d.merchant_confirmations);
  form.errors = {};
  form.saving = true;
  try {
    const result = await postJson("/updateNodeUrl", input);
    if (!result.success) {
      if (Array.isArray(result.error?.issues)) setIssues(form, result.error.issues);
      else
        form.errors.nodeurl =
          result.error?.message || "Failed to update settings";
      return;
    }
    form.open = false;
    window.location.reload();
  } catch (err) {
    console.error("Error updating settings:", err);
    form.errors.nodeurl = "An error occurred while updating. Please try again.";
  } finally {
    form.saving = false;
  }
}

async function submitTheme(e: Event) {
  e.preventDefault();
  form.saving = true;
  try {
    const result = await postJson("/updateTheme", {
      checkout_theme: form.draft.checkout_theme,
      dashboard_theme: form.draft.dashboard_theme,
    });
    if (!result.success) {
      console.error("Failed to update theme:", result.error);
      return;
    }
    form.open = false;
    window.location.reload();
  } catch (err) {
    console.error("Error updating theme:", err);
  } finally {
    form.saving = false;
  }
}

const capitalize = (n: string) => n.charAt(0).toUpperCase() + n.slice(1);

function themeSelect(name: "checkout_theme" | "dashboard_theme") {
  const current = form.draft[name];
  const items =
    themeNames.length === 0
      ? html`<li class="dropdown-item disabled">No themes</li>`
      : themeNames.map(
          (n) =>
            html`<li
              class="dropdown-item"
              onclick=${(e: Event) => {
                e.stopPropagation();
                form.draft[name] = n;
                openThemeMenu = null;
              }}
            >
              ${capitalize(n)}
            </li>`,
        );
  return html`<div class="custom-dropdown-menu">
    <div
      class="dropdown-display"
      onclick=${(e: Event) => {
        e.stopPropagation();
        openThemeMenu = openThemeMenu === name ? null : name;
      }}
    >
      ${current ? capitalize(current) : "Select a theme"}
    </div>
    <ul
      class="dropdown-list theme-dropdown-list ${openThemeMenu === name
        ? "open"
        : ""}"
    >
      ${items}
    </ul>
  </div>`;
}

function connectionStep() {
  const d = form.draft;
  return html`<form id="connection-form" onsubmit=${submitConnection}>
    <div class="form-group">
      <label class="form-label">Node URL</label>
      <input
        type="text"
        class="${inputClass(form, "nodeurl", "settings-form-input")}"
        name="nodeurl"
        placeholder="http://node.example.com:18081"
        value=${d.nodeurl}
        oninput=${bind(form, "nodeurl")}
      />
      ${errorMessage(form, "nodeurl", "settings-error-message error-message")}
    </div>

    <div class="form-group">
      <label class="form-label">Start Height</label>
      <input
        type="number"
        class="${inputClass(form, "start_height", "settings-form-input")}"
        name="start_height"
        placeholder="0"
        min="0"
        value=${d.start_height}
        oninput=${bind(form, "start_height")}
      />
      ${errorMessage(
        form,
        "start_height",
        "settings-error-message error-message",
      )}
    </div>

    <div class="form-group">
      <label class="form-label">Minimum Payment Confirmations</label>
      <input
        type="number"
        class="${inputClass(form, "merchant_confirmations", "settings-form-input")}"
        name="merchant_confirmations"
        placeholder="10"
        min="0"
        value=${d.merchant_confirmations}
        oninput=${bind(form, "merchant_confirmations")}
      />
      ${errorMessage(
        form,
        "merchant_confirmations",
        "settings-error-message error-message",
      )}
    </div>

    ${submitButton(form, "Update Connection Settings")}
  </form>`;
}

function themeStep() {
  return html`<form id="theme-form" onsubmit=${submitTheme}>
    <div class="form-group">
      <label class="form-label">Checkout Theme</label>
      ${themeSelect("checkout_theme")}
    </div>

    <div class="form-group">
      <label class="form-label">Dashboard Theme</label>
      ${themeSelect("dashboard_theme")}
    </div>

    ${submitButton(form, "Update Theme")}
  </form>`;
}

function dialog() {
  return html`<div
    class="dialog-overlay"
    id="settings-dialog-overlay"
    style="display: flex"
    onclick=${closeOnOverlay(form)}
  >
    <div class="dialog" onclick=${() => { openThemeMenu = null; }}>
      <div class="dialog-header">
        <h2 class="dialog-title">Settings</h2>
        <button class="close-btn" onclick=${() => { form.open = false; }}>
          ×
        </button>
      </div>

      <div class="form-tabs">
        <button
          type="button"
          class="settings-tab form-tab ${tab === "connection" ? "active" : ""}"
          onclick=${() => { tab = "connection"; }}
        >
          Connection
        </button>
        <button
          type="button"
          class="settings-tab form-tab ${tab === "theme" ? "active" : ""}"
          onclick=${() => { tab = "theme"; }}
        >
          Theme
        </button>
      </div>

      <div class="settings-step form-step active">
        ${tab === "connection" ? connectionStep : themeStep}
      </div>
    </div>
  </div>`;
}

export function createNodeUrlForm() {
  return html`<div>${form.open ? dialog : null}</div>`;
}
