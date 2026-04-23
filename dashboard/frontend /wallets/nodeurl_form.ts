import { html } from "@spirobel/mininext";

function openNodeUrlForm() {
  const nodeUrlDialog = document.querySelector(
    "#nodeurl-dialog-overlay",
  ) as HTMLDivElement;
  nodeUrlDialog.style.display = "flex";

  // Reset previous errors
  document.querySelectorAll(".nodeurl-form-input").forEach((input) => {
    (input as HTMLInputElement).classList.remove("error");
  });
  document.querySelectorAll(".nodeurl-error-message").forEach((msg) => {
    msg.textContent = "";
    (msg as HTMLDivElement).style.display = "none";
  });

  // Pre-fill form with current scan settings
  const scanSettings = window.dashboardData?.scan_settings;
  if (scanSettings) {
    const nodeurlInput = document.querySelector(
      '[name="nodeurl"]',
    ) as HTMLInputElement;
    const startHeightInput = document.querySelector(
      '[name="start_height"]',
    ) as HTMLInputElement;

    if (nodeurlInput && scanSettings.node_url) {
      nodeurlInput.value = scanSettings.node_url;
    }
    if (startHeightInput && scanSettings.start_height !== undefined) {
      startHeightInput.value = String(scanSettings.start_height);
    }
  }
  const nodeUrlForm = document.querySelector(
    "#nodeurl-form",
  ) as HTMLFormElement;

  if (nodeUrlForm) {
    nodeUrlForm.onsubmit = async (e) => {
      e.preventDefault();

      // Reset previous errors
      document.querySelectorAll(".nodeurl-form-input").forEach((input) => {
        (input as HTMLInputElement).classList.remove("error");
      });
      document.querySelectorAll(".nodeurl-error-message").forEach((msg) => {
        msg.textContent = "";
        (msg as HTMLDivElement).style.display = "none";
      });

      // Disable button and show loading state
      const submitBtn = nodeUrlForm.querySelector(
        ".submit-btn",
      ) as HTMLButtonElement;
      submitBtn.disabled = true;
      submitBtn.classList.add("loading");

      try {
        const formData = new FormData(nodeUrlForm);
        const input: any = Object.fromEntries(formData);

        // Trim string inputs
        if (input.nodeurl) input.nodeurl = input.nodeurl.trim();
        if (input.start_height) input.start_height = Number(input.start_height);

        // Validate inputs
        const errors: { [key: string]: string } = {};

        if (!input.nodeurl || input.nodeurl === "") {
          errors.nodeurl = "Node URL is required";
        }

        if (
          input.start_height === null ||
          input.start_height === undefined ||
          input.start_height < 0
        ) {
          errors.start_height =
            "Start height must be a valid non-negative number";
        }

        if (Object.keys(errors).length > 0) {
          // Display errors
          Object.entries(errors).forEach(([field, message]) => {
            const input = nodeUrlForm.querySelector(
              `[name="${field}"]`,
            ) as HTMLInputElement;
            const errorDiv = nodeUrlForm.querySelector(
              `#${field}-error`,
            ) as HTMLDivElement;

            if (input) input.classList.add("error");
            if (errorDiv) {
              errorDiv.textContent = message;
              errorDiv.style.display = "block";
            }
          });

          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
          return;
        }

        // Submit to API
        const response = await fetch("/updateNodeUrl", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(input),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          const errorMessage =
            result.error?.message || "Failed to update node URL";
          const nodeUrlError = nodeUrlForm.querySelector(
            "#nodeurl-error",
          ) as HTMLDivElement;

          if (nodeUrlError) {
            nodeUrlError.textContent = errorMessage;
            nodeUrlError.style.display = "block";
          }

          submitBtn.disabled = false;
          submitBtn.classList.remove("loading");
          return;
        }

        // Success - close dialog and reload
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
            required
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
            required
            placeholder="0"
            min="0"
          />
          <div
            class="nodeurl-error-message error-message"
            id="start_height-error"
          ></div>
        </div>

        <button type="submit" class="submit-btn">
          <span class="spinner"></span>
          <span class="button-text">Update Node URL</span>
        </button>
      </form>
    </div>
  </div>`;
}

// Hook up event listeners when mounted
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
