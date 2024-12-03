const blocksContainer = document.querySelector(".blocks-container");
const syncBar = document.querySelector(".sync-bar");
const syncStatus = document.querySelector(".sync-status");
const totalBlocks = 20;
const addWalletBtn = document.querySelector(".add-wallet-btn");
const dialogOverlay = document.querySelector(".dialog-overlay");
const closeBtn = document.querySelector(".close-btn");
const addWalletForm = document.querySelector("#add-wallet-form");

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

// Dialog controls
addWalletBtn.addEventListener("click", () => {
  dialogOverlay.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  dialogOverlay.style.display = "none";
});

dialogOverlay.addEventListener("click", (e) => {
  if (e.target === dialogOverlay) {
    dialogOverlay.style.display = "none";
  }
});

// Form submission
addWalletForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formData = new FormData(addWalletForm);
  // Here you would typically handle the wallet creation
  // For now, we'll just close the dialog
  dialogOverlay.style.display = "none";
  addWalletForm.reset();
});

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

// Add click handler for wallet address
document.querySelector(".wallet-address").addEventListener("click", () => {
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

// Advanced options toggle
document.addEventListener("DOMContentLoaded", () => {
  const advancedToggle = document.querySelector(".advanced-toggle");
  const advancedFields = document.querySelector(".advanced-fields");

  advancedToggle.addEventListener("click", () => {
    advancedToggle.classList.toggle("active");
    advancedFields.classList.toggle("active");

    if (advancedFields.classList.contains("active")) {
      advancedFields.style.display = "block";
      advancedToggle.textContent = "Hide Advanced Options";
    } else {
      setTimeout(() => {
        advancedFields.style.display = "none";
      }, 300); // Match the transition duration
      advancedToggle.textContent = "Show Advanced Options";
    }
  });

  // Update the form submission handler to include advanced fields
  addWalletForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(addWalletForm);
    // Here you would typically handle the wallet creation
    dialogOverlay.style.display = "none";
    addWalletForm.reset();
    // Reset advanced fields state
    advancedFields.classList.remove("active");
    advancedFields.style.display = "none";
    advancedToggle.classList.remove("active");
    advancedToggle.textContent = "Show Advanced Options";
  });
});
