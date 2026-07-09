import { html } from "@spirobel/mininext";

function openNodeUrlForm() {
  const nodeUrlDialog = document.querySelector(
    "#nodeurl-dialog-overlay",
  ) as HTMLDivElement;
  nodeUrlDialog.style.display = "flex";

  document.querySelectorAll(".nodeurl-form-input").forEach((input) => {
    (input as HTMLInputElement).classList.remove("error");
  });
  document.querySelectorAll(".nodeurl-error-message").forEach((msg) => {
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
  const nodeUrlForm = document.querySelector(
    "#nodeurl-form",
  ) as HTMLFormElement;

  if (nodeUrlForm) {
    nodeUrlForm.onsubmit = async (e) => {
      e.preventDefault();

      document.querySelectorAll(".nodeurl-form-input").forEach((input) => {
        (input as HTMLInputElement).classList.remove("error");
      });
      document.querySelectorAll(".nodeurl-error-message").forEach((msg) => {
        msg.textContent = "";
        (msg as HTMLDivElement).style.display = "none";
      });

      const submitBtn = nodeUrlForm.querySelector(
        ".submit-btn",
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");

      try {
        const formData = new FormData(nodeUrlForm);
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
                const input = nodeUrlForm.querySelector(
                  `[name="${fieldName}"]`,
                ) as HTMLInputElement;
                const errorDiv = nodeUrlForm.querySelector(
                  `#${fieldName}-error`,
                ) as HTMLDivElement;

                if (input) input.classList.add("error");
                if (errorDiv) {
                  errorDiv.textContent = issue.message;
                  errorDiv.style.display = "block";
                }
              },
            );
          } else {
            const nodeUrlError = nodeUrlForm.querySelector(
              "#nodeurl-error",
            ) as HTMLDivElement;

            if (nodeUrlError) {
              nodeUrlError.textContent =
                result.error?.message || "Failed to update node URL";
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
        console.error("Error updating node URL:", error);
        const nodeUrlError = nodeUrlForm.querySelector(
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
}

function closeNodeUrlForm() {
  const nodeUrlDialog = document.querySelector(
    "#nodeurl-dialog-overlay",
  ) as HTMLDivElement;
  nodeUrlDialog.style.display = "none";
}

function clickOutsideNodeUrlClose(e?: Event) {
  const dialogOverlay = document.querySelector(
    "#nodeurl-dialog-overlay",
  ) as HTMLDivElement;
  if (e && e.target === dialogOverlay && dialogOverlay) {
    dialogOverlay.style.display = "none";
  }
  if (!e) {
    dialogOverlay.style.display = "none";
  }
}

export function createNodeUrlForm() {
  return html`<div
    class="dialog-overlay"
    id="nodeurl-dialog-overlay"
    onclick="clickOutsideNodeUrlClose(event)"
  >
    <div class="dialog">
      <div class="dialog-header">
        <h2 class="dialog-title">Set Node URL</h2>
        <button class="close-btn" onclick="closeNodeUrlForm()">×</button>
      </div>

      <form id="nodeurl-form">
        <div class="form-group">
          <label class="form-label">Node URL</label>
          <input
            type="text"
            class="nodeurl-form-input form-input"
            name="nodeurl"
            placeholder="http://node.example.com:18081"
          />
          <div
            class="nodeurl-error-message error-message"
            id="nodeurl-error"
          ></div>
        </div>

        <div class="form-group">
          <label class="form-label">Start Height</label>
          <input
            type="number"
            class="nodeurl-form-input form-input"
            name="start_height"
            placeholder="0"
            min="0"
          />
          <div
            class="nodeurl-error-message error-message"
            id="start_height-error"
          ></div>
        </div>

        <div class="form-group">
          <label class="form-label">Minimum Payment Confirmations</label>
          <input
            type="number"
            class="nodeurl-form-input form-input"
            name="merchant_confirmations"
            placeholder="10"
            min="0"
          />
          <div
            class="nodeurl-error-message error-message"
            id="merchant_confirmations-error"
          ></div>
        </div>

        <button type="submit" class="submit-btn">
          <span class="spinner"></span>
          <span class="button-text">Update Connection Settings</span>
        </button>
      </form>
    </div>
  </div>`;
}

declare global {
  interface Window {
    openNodeUrlForm: () => void;
    closeNodeUrlForm: () => void;
    clickOutsideNodeUrlClose: (e?: Event) => void;
  }
}

window.openNodeUrlForm = openNodeUrlForm;
window.closeNodeUrlForm = closeNodeUrlForm;
window.clickOutsideNodeUrlClose = clickOutsideNodeUrlClose;
