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
