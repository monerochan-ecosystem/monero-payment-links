import { html } from "@spirobel/mininext";

export const mainStyles = html`<style>
  :root {
    --primary: #5b21b6;
    --secondary: #4c1d95;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #18181b;
  }
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
  }
  input {
    box-sizing: border-box;
  }
  textarea {
    box-sizing: border-box;
  }
  select {
    background-color: #231c30 !important;
    color: #fff !important;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.1);
    color: var(--text);
    font-size: 1rem;
  }

  select option {
    color: #fff !important;
    padding: 0.75rem !important;
    border-radius: 8px !important;
    border: 1px solid rgba(124, 58, 237, 0.3) !important;
    background: rgba(124, 58, 237, 0.1) !important;
    font-size: 1rem;
  }

  .layout-container {
    display: flex;
    min-height: 100vh;
    width: 100%;
  }

  .main-content {
    margin: 20px auto;
    display: flex;
  }

  @media (min-width: 768px) {
    .main-content {
      padding: 2rem;
      justify-content: center;
      align-items: center;
    }
  }

  .dialog-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    display: none;
    justify-content: center;
    backdrop-filter: blur(4px);
    overflow-y: auto;
    z-index: 101;
    padding-top: 20px;
  }

  .dialog {
    height: fit-content;
    background: var(--bg);
    padding: 2rem;
    border-radius: 20px;
    width: 90%;
    max-width: 500px;
    border: 1px solid var(--accent);
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
  }

  .dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .dialog-title {
    font-size: 1.5rem;
    font-weight: 600;
  }
  @media (max-width: 768px) {
    .main-content {
      padding-bottom: 80px; /* Increase padding to prevent overlap */
    }
    .dialog {
      padding: 1rem;
    }
    .dialog-title {
      font-size: 1.2rem;
    }
    .dialog-header {
      margin-bottom: 1rem;
    }
  }

  .close-btn {
    background: none;
    border: none;
    color: var(--text);
    cursor: pointer;
    font-size: 1.5rem;
    opacity: 0.7;
    transition: opacity 0.3s ease;
  }

  .close-btn:hover {
    opacity: 1;
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    opacity: 0.8;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border-radius: 8px;
    border: 1px solid rgba(124, 58, 237, 0.3);
    background: rgba(124, 58, 237, 0.1);
    color: var(--text);
    font-size: 1rem;
    transition: all 0.3s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent);
    box-shadow: 0 0 0 2px rgba(124, 58, 237, 0.2);
  }
</style>`;
