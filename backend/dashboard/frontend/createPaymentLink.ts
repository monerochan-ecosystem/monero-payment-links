function createPaymentLink(walletId: number | null) {
  // Reset previous errors
  document.querySelectorAll(".form-input").forEach((input) => {
    input.classList.remove("error");
  });
  document.querySelectorAll(".error-message").forEach((msg) => {
    (msg as HTMLDivElement).style.display = "none";
  });
  // open the edit dialog
  const editDialog = document.querySelector(
    ".edit-dialog-overlay"
  ) as HTMLDivElement;
  editDialog.style.display = "flex";

  const form = document.querySelector("#payment-link-form") as HTMLFormElement;

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
    // Trim all string fields
    for (const key in input) {
      input[key] = input[key].trim();
      if (input[key] === "") delete input[key];
    }

    // Convert number fields to integers
    for (const key of ["maxUses", "walletId"]) {
      if (input[key]) {
        input[key] = Number(input[key]);
      }
    }

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
window.createPaymentLink = createPaymentLink;
