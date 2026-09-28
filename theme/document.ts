import { html } from "@spirobel/mininext";

// document theme, minimalistic black on white like a printed document

export const checkoutStyles = html`<style>
  iframe {
    border: none;
    width: 100%;
    height: 55px;
  }

  :root {
    --primary: #1a1a1a;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
    --success: #1a1a1a;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg);
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
    padding: 1rem;
  }

  .checkout-container {
    max-width: 500px;
    width: 100%;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .payment-info {
    margin-bottom: 2rem;
  }

  .payment-amount {
    text-align: center;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    color: var(--text);
  }

  .payment-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
  }

  .info-box {
    background: #f9f9f9;
    border-radius: 2px;
    padding: 1.5rem;
    border: 1px solid #eee;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .info-amount {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  .info-due-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: #444;
    white-space: pre-wrap;
  }

  .product-description {
    text-align: center;
    margin-bottom: 3rem;
    line-height: 1.8;
    font-size: 1.1rem;
    color: #333;
    padding: 2rem;
    background: #f9f9f9;
    border-radius: 2px;
    border: 1px solid #eee;
  }

  .payment-steps {
    counter-reset: step;
  }

  .step {
    display: flex;
    gap: 1rem;
    margin-bottom: 12px;
    padding: 19px;
    background: #fff;
    border-radius: 2px;
    border: 1px solid #eee;
    transition: all 0.2s ease;
  }

  .step:hover {
    border-color: #ccc;
  }

  .step:before {
    counter-increment: step;
    content: counter(step);
    width: 28px;
    height: 28px;
    background: var(--accent);
    color: #fff;
    border-radius: 2px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
  }

  .step-content {
    flex: 1;
  }

  .step h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    color: var(--text);
  }

  .step p {
    margin: 0;
    font-size: 0.925rem;
    opacity: 0.7;
  }

  .wallet-address {
    background: #f9f9f9;
    border-radius: 2px;
    padding: 1rem;
    font-family: "Courier New", monospace;
    word-break: break-all;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border: 1px solid #eee;
  }

  .pay-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 31px;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    color: #fff;
    background: var(--accent);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease;
  }

  .pay-button:hover {
    background: #000;
  }

  .pay-button:active {
    background: #333;
  }

  .copy-btn {
    background: var(--accent);
    border: none;
    color: #fff;
    padding: 0.5rem 1rem;
    border-radius: 2px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.2s ease;
    white-space: nowrap;
  }

  .copy-btn:hover {
    background: #000;
  }

  .copy-btn.copied {
    background: var(--success);
  }

  .qr-code {
    width: 140px;
    height: 140px;
    background: white;
    border-radius: 2px;
    margin: 1rem auto;
    padding: 1rem;
    border: 1px solid #eee;
  }

  .payment-status {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 2px;
  }

  .payment-status.pending {
    background: #f0f0f0;
  }

  .payment-status.success {
    background: #e8e8e8;
  }

  .timer {
    text-align: center;
    font-size: 0.875rem;
    opacity: 0.6;
    margin-top: 1rem;
  }

  @media (max-width: 640px) {
    .checkout-container {
      padding: 1.5rem;
    }

    .payment-amount {
      font-size: 2.5rem;
    }

    .wallet-address {
      flex-direction: column;
    }

    .copy-btn {
      width: 100%;
    }
  }
</style>`;

export const invoicePaidStyles = html`<style>
  :root {
    --primary: #1a1a1a;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
    padding: 1rem;
  }

  .info-container {
    max-width: 520px;
    width: 100%;
    text-align: center;
  }

  .info-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .info-box {
    background: #f9f9f9;
    border-radius: 2px;
    padding: 1.5rem;
    border: 1px solid #eee;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .info-amount {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: #444;
    white-space: pre-wrap;
  }

  .info-message {
    font-size: 1rem;
    line-height: 1.7;
    color: #444;
    margin: 0;
  }

  .info-tx {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.875rem;
  }

  .info-tx-label {
    color: #666;
  }

  .info-tx-hash {
    font-family: "Courier New", monospace;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .info-tx-hash:hover {
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .info-card {
      padding: 2rem 1.5rem;
    }
  }
</style>`;

export const outOfStockStyles = html`<style>
  :root {
    --primary: #1a1a1a;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
    padding: 1rem;
  }

  .info-container {
    max-width: 520px;
    width: 100%;
    text-align: center;
  }

  .info-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2.5rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .info-box {
    background: #f9f9f9;
    border-radius: 2px;
    padding: 1.5rem;
    border: 1px solid #eee;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .info-amount {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: #444;
    white-space: pre-wrap;
  }

  .info-message {
    font-size: 1rem;
    line-height: 1.7;
    color: #444;
    margin: 0;
  }

  @media (max-width: 640px) {
    .info-card {
      padding: 2rem 1.5rem;
    }
  }
</style>`;

export const paymentStatusStyles = html`<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  :root {
    --primary: #1a1a1a;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
    --success: #1a1a1a;
  }

  html,
  body {
    background-color: var(--bg);
    color: var(--text);
  }

  .payment-status {
    text-align: center;
    padding: 1rem;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: "Georgia", "Times New Roman", serif;
  }

  .payment-status.pending {
    background: #f0f0f0;
  }

  .payment-status.success {
    background: #e8e8e8;
  }

  body {
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
    background: #fff;
  }
</style>`;

export const walletNotDetectedStyles = html`<style>
  :root {
    --primary: #1a1a1a;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
    --success: #1a1a1a;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
    padding: 1rem;
  }

  .wallet-not-detected {
    max-width: 480px;
    width: 100%;
    text-align: center;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 3rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .wallet-not-detected h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    color: var(--text);
  }

  .wallet-not-detected p {
    font-size: 1rem;
    line-height: 1.7;
    color: #444;
    margin: 0 0 2rem 0;
  }

  .install-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 32px;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    color: #fff;
    background: var(--accent);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.2s ease;
  }

  .install-btn:hover {
    background: #000;
  }

  .install-btn:active {
    background: #333;
  }

  .back-btn {
    display: block;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    color: #666;
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: var(--text);
  }

  @media (max-width: 640px) {
    .wallet-not-detected {
      padding: 2rem 1.5rem;
    }

    .wallet-not-detected h1 {
      font-size: 1.5rem;
    }
  }
</style>`;

export const loginStyles = html`<style>
  :root {
    --primary: #1a1a1a;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
    padding: 1rem;
  }

  .login-card {
    max-width: 400px;
    width: 100%;
    text-align: center;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 3rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .login-card h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    color: var(--text);
  }

  .login-card p.subtitle {
    font-size: 0.9rem;
    color: #666;
    margin: 0 0 2rem 0;
  }

  .login-card form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .login-card input {
    width: 100%;
    padding: 0.875rem 1rem;
    font-size: 1rem;
    font-family: inherit;
    color: var(--text);
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    outline: none;
    transition: all 0.2s ease;
    box-sizing: border-box;
  }

  .login-card input::placeholder {
    color: #999;
  }

  .login-card input:focus {
    border-color: var(--accent);
  }

  .login-card button {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    color: #fff;
    background: var(--accent);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .login-card button:hover {
    background: #000;
  }

  .login-card button:active {
    background: #333;
  }

  .login-card .error {
    color: #c00;
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
    padding: 0.75rem 1rem;
    background: #f4ecec;
    border: 1px solid #e0d0d0;
    border-radius: 2px;
  }
</style>`;

export const dashBoardStyles = html`
<style>
  :root {
    --primary: #1a1a1a;
    --secondary: #333;
    --accent: #1a1a1a;
    --text: #1a1a1a;
    --bg: #fafafa;
  }

  /* === base === */
  body {
    margin: 0;
    min-height: 100vh;
    display: flex;
    background: var(--bg);
    font-family: "Georgia", "Times New Roman", serif;
    color: var(--text);
  }

  input, textarea, select {
    box-sizing: border-box;
    background-color: #fff;
    color: var(--text);
    padding: 0.75rem;
    border-radius: 2px;
    border: 1px solid #ccc;
    background: #fff;
    font-size: 1rem;
  }

  select option {
    color: var(--text);
    padding: 0.75rem;
    border-radius: 2px;
    border: 1px solid #eee;
    background: #fff;
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
    background: rgba(0, 0, 0, 0.4);
    display: none;
    justify-content: center;
    overflow-y: auto;
    z-index: 101;
    padding-top: 20px;
  }

  .dialog {
    height: fit-content;
    background: #fff;
    padding: 2rem;
    border-radius: 2px;
    width: 90%;
    max-width: 500px;
    border: 1px solid #ddd;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
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
      padding-bottom: 80px;
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
    opacity: 0.5;
    transition: opacity 0.2s ease;
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
    border-radius: 2px;
    border: 1px solid #ccc;
    background: #fff;
    color: var(--text);
    font-size: 1rem;
    transition: all 0.2s ease;
  }

  .form-input:focus {
    outline: none;
    border-color: var(--accent);
  }

  /* === sidebar === */
  .sidebar {
    width: 280px;
    background: #fff;
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    border-right: 1px solid #eee;
  }

  .sidebar-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0 1rem;
    margin-bottom: 2rem;
    color: var(--text);
    font-size: 1.5rem;
    font-weight: 600;
  }

  .menu-item {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: var(--text);
    text-decoration: none;
    border-radius: 2px;
    cursor: pointer;
    user-select: none;
    transition: all 0.2s ease;
    margin-bottom: 0.5rem;
  }

  .menu-item:hover {
    background: #f0f0f0;
  }

  .menu-item.active {
    background: var(--accent);
    color: #fff;
  }

  .icon {
    width: 20px !important;
    height: 20px !important;
  }

  @media (max-width: 768px) {
    .icon {
      width: 24px;
      height: 24px;
    }
    .sidebar {
      position: fixed;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 60px;
      padding: 0.4rem 0.5rem;
      flex-direction: row;
      justify-content: space-around;
      align-items: center;
      background: #fff;
      z-index: 100;
      border-right: none;
      border-top: 1px solid #eee;
    }

    .sidebar-logo {
      display: none;
    }

    .menu-item {
      flex-direction: row;
      padding: 0.5rem;
      margin-bottom: 0;
      text-align: left;
      font-weight: 700;
      width: auto;
      gap: 0.2rem;
    }

    .main-content {
      padding-bottom: 80px;
    }

    .add-wallet-btn {
      bottom: 90px !important;
    }
    .wallet-footer-left {
      bottom: 90px !important;
      left: 2rem !important;
    }
  }

  /* === wallet form === */
  .restore-wallet-link {
    color: var(--accent);
    text-decoration: underline;
    cursor: pointer;
    font-size: 0.9rem;
  }
  .restore-wallet-link:hover {
    color: #000;
  }

  /* === wallets grid === */
  .wallets-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
    gap: 2rem;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }

  @media (max-width: 1300px) {
    .wallets-grid {
      grid-template-columns: 1fr;
      padding: 1rem;
      padding-bottom: 80px;
    }
  }

  .wallet-card {
    max-width: 380px;
    height: 220px;
    background: #fff;
    border-radius: 2px;
    padding: 24px;
    border: 1px solid #ddd;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
  }

  @keyframes float {
    0% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
    100% { transform: translateY(0px); }
  }

  .empty-wallet-card {
    text-decoration: none;
    color: var(--text);
    max-width: 380px;
    height: 220px;
    background: #fafafa;
    border: 2px dashed #ccc;
    border-radius: 2px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.2s ease;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 1rem;
  }

  .empty-state-icon {
    width: 48px;
    height: 48px;
    opacity: 0.5;
    margin-bottom: 1rem;
    color: var(--text);
  }

  .empty-state-text {
    font-size: 1.1rem;
    color: var(--text);
    opacity: 0.7;
    text-align: center;
  }

  .empty-state-subtext {
    font-size: 0.9rem;
    color: var(--text);
    opacity: 0.5;
    text-align: center;
  }

  .floating {
    animation: float 3s ease-in-out infinite;
  }

  .wallet-actions {
    position: absolute;
    bottom: 1rem;
    right: 1rem;
  }

  .edit-wallet-btn {
    background: #f0f0f0;
    border: 1px solid #ddd;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-wallet-btn:hover {
    background: #e0e0e0;
  }

  .add-wallet-btn {
    z-index: 100;
    text-decoration: none;
    outline: none;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    background: var(--accent);
    border: none;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 2px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }

  .add-wallet-btn:hover {
    background: #000;
  }

  .wallet-footer-left {
    position: fixed;
    bottom: 2rem;
    left: 360px;
    z-index: 100;
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .set-nodeurl-btn {
    text-decoration: none;
    outline: none;
    position: static;
    background: var(--accent);
    border: none;
    color: #fff;
    padding: 1rem 2rem;
    border-radius: 2px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }

  .set-nodeurl-btn:hover {
    background: #000;
  }

  .show-more, .show-less {
    width: 100%;
    border: none;
    color: var(--text);
    padding: 1rem;
    margin: 1rem 0;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    cursor: pointer;
    font-size: 0.9rem;
    opacity: 0.8;
  }

  .advanced-toggle:hover { opacity: 1; }

  .advanced-fields {
    overflow: hidden;
    opacity: 1;
    max-height: 300px;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #c00;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: none;
  }

  .form-input.error {
    border-color: #c00;
    background: #f4ecec;
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
  }

  .delete-btn {
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    margin-top: 1rem;
    transition: all 0.2s ease;
    padding: 1rem;
    background: #f4ecec;
    border: 1px solid #d0c0c0;
    border-radius: 2px;
    color: #c00;
  }

  .delete-btn:hover {
    background: #e8d0d0;
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: #f4ecec;
    border: 1px solid #d0c0c0;
    border-radius: 2px;
    color: #c00;
  }

  .delete-warning.show {
    display: block;
  }

  .warning-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
  }

  .warning-actions button {
    flex: 1;
    padding: 0.75rem;
    border-radius: 2px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .cancel-delete {
    background: #e0e0e0;
    color: var(--text);
  }

  .cancel-delete:hover {
    background: #d0d0d0;
  }

  .confirm-delete {
    background: #c00;
    color: #fff;
  }

  .confirm-delete:hover {
    background: #a00;
  }

  .edit-dialog-overlay {
    display: none;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--accent);
    border: none;
    border-radius: 2px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn .button-text { display: inline; }
  .submit-btn.loading .button-text { display: none; }
  .submit-btn.loading .spinner { display: inline-block; }

  .spinner {
    display: none;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255,255,255,0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .submit-btn:hover {
    background: #000;
  }

  .wallet-card:hover {
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .wallet-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
  }

  .wallet-balance {
    font-size: 2rem;
    font-weight: 700;
  }

  .wallet-name {
    font-size: 2rem;
    font-weight: 700;
  }

  .wallet-address {
    width: 100%;
    word-wrap: break-word;
    display: inline-block;
    font-size: 1rem;
    opacity: 0.9;
    margin-bottom: 20px;
    transition: all 0.2s ease;
    font-family: "Courier New", monospace;
  }

  .wallet-address:hover {
    opacity: 1;
    cursor: pointer;
  }

  .blocks-container {
    display: flex;
    gap: 4px;
    margin-top: 20px;
    flex-wrap: wrap;
  }

  .block {
    width: 12px;
    height: 12px;
    background: #e0e0e0;
    border-radius: 2px;
    transition: all 0.2s ease;
  }

  .block.synced {
    background: var(--accent);
    animation: blockPulse 2s infinite;
  }

  @keyframes blockPulse {
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
  }

  .sync-status {
    font-size: 0.875rem;
    margin-top: 10px;
    animation: fadeInOut 2s infinite;
  }

  @keyframes fadeInOut {
    0% { opacity: 0.7; }
    50% { opacity: 1; }
    100% { opacity: 0.7; }
  }

  /* === payment link form === */
  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--accent);
    border: none;
    border-radius: 2px;
    color: #fff;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .submit-btn:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn:hover {
    background: #000;
  }

  .delete-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid #d0c0c0;
    border-radius: 2px;
    color: #c00;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-top: 0.75rem;
  }

  .delete-btn:hover {
    background: #f4ecec;
    border-color: #c00;
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: #f4ecec;
    border: 1px solid #d0c0c0;
    border-radius: 2px;
  }

  .delete-warning.show {
    display: block;
  }

  .delete-warning p {
    color: #444;
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
    background: #e0e0e0;
    border: 1px solid #ddd;
    border-radius: 2px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .cancel-delete:hover {
    background: #d0d0d0;
  }

  .confirm-delete {
    flex: 1;
    padding: 0.5rem 1rem;
    background: #c00;
    border: none;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .confirm-delete:hover {
    background: #a00;
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

  /* === custom dropdown === */
  .custom-dropdown-menu {
    position: relative;
    width: 100%;
  }

  .dropdown-display {
    padding: 0.75rem;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 2px;
    color: var(--text);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    min-height: 44px;
    white-space: normal;
    word-break: break-word;
  }

  .dropdown-display:empty::before {
    content: "Select";
    color: #999;
  }

  .dropdown-display:hover {
    border-color: var(--accent);
  }

  .dropdown-display::after {
    content: "▼";
    margin-left: auto;
    font-size: 0.75rem;
    opacity: 0.5;
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
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.2s ease;
    z-index: 1000;
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
    transition: all 0.15s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-item:not(.disabled):hover {
    background: #f0f0f0;
    padding-left: 1.25rem;
  }

  .dropdown-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  /* === payment link detail === */
  .detail-container {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .detail-header {
    margin-bottom: 2rem;
  }

  .detail-actions {
    display: flex;
    gap: 0.5rem;
  }

  .detail-card.invoice {
    background: #f9f9f9;
    border: 1px solid #eee;
  }

  .detail-card .info-box {
    background: #f9f9f9;
    border-radius: 2px;
    padding: 1.5rem;
    border: 1px solid #eee;
    text-align: left;
    margin-bottom: 1.5rem;
  }

  .detail-card .info-title {
    font-size: 1.125rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 0.5rem;
  }

  .detail-card .info-amount {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 0.75rem;
    color: var(--text);
  }

  .detail-card .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: #444;
    white-space: pre-wrap;
  }

  .detail-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
  }

  .detail-description {
    color: #444;
    margin: 0 0 1rem 0;
    line-height: 1.6;
  }

  .payment-link-url {
    display: block;
    word-break: break-all;
  }

  .payment-link-url-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin: 1rem 0 1.5rem 0;
  }

  .stat-value {
    word-break: break-word;
  }

  .stat-value.wallet-address {
    font-size: 0.875rem;
    font-family: "Courier New", monospace;
  }

  .info-payment-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.875rem;
  }

  .info-payment-status-label {
    color: #666;
  }

  .info-payment-status-value {
    font-weight: 600;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .info-payment-status-value::before {
    content: "";
    width: 8px;
    height: 8px;
    border-radius: 50%;
    display: inline-block;
  }

  .info-payment-status-value.paid {
    color: var(--accent);
  }

  .info-payment-status-value.paid::before {
    background: var(--accent);
  }

  .info-payment-status-value.unpaid {
    color: #999;
  }

  .info-payment-status-value.unpaid::before {
    background: #ccc;
  }

  .info-due-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: #666;
    margin-bottom: 0.75rem;
  }

  .info-wallet {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.875rem;
  }

  .info-wallet-label {
    color: #666;
  }

  .info-wallet-address {
    font-family: "Courier New", monospace;
    color: var(--accent);
  }

  .info-payment-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #eee;
    font-size: 0.875rem;
  }

  .info-payment-type-label {
    color: #666;
  }

  .info-payment-type-value {
    font-weight: 600;
    color: var(--accent);
  }

  .payment-history h3 {
    margin: 0 0 1.5rem 0;
    font-size: 1.25rem;
  }

  .transaction-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }

  .transaction-amount.received {
    color: var(--accent);
    font-weight: 600;
  }

  .transaction-status.confirmed {
    background: #f0f0f0;
    color: var(--accent);
    padding: 0.15rem 0.6rem;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid #ddd;
    width: 65px;
    text-align: center;
  }

  .transaction-date {
    color: #666;
  }

  .transaction-hash {
    font-family: "Courier New", monospace;
    color: #666;
  }

  .transaction-hash-link {
    font-family: "Courier New", monospace;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .transaction-hash-link:hover {
    text-decoration: underline;
  }

  .edit-payment-link-btn {
    background: #f0f0f0;
    border: 1px solid #ddd;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-payment-link-btn:hover {
    background: #e0e0e0;
  }

  .delete-payment-link-btn {
    background: #f4ecec;
    border: 1px solid #d0c0c0;
    color: #c00;
    padding: 0.5rem;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-payment-link-btn:hover {
    background: #e8d0d0;
  }

  .delete-dialog-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }

  .delete-dialog {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2rem;
    max-width: 420px;
    width: 90%;
    text-align: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.12);
  }

  .delete-dialog h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }

  .delete-dialog p {
    color: #444;
    font-size: 0.875rem;
    line-height: 1.6;
    margin: 0 0 1.5rem 0;
  }

  .delete-dialog-actions {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .cancel-delete-btn {
    padding: 0.75rem 1.5rem;
    background: #e0e0e0;
    border: 1px solid #ddd;
    border-radius: 2px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
  }

  .cancel-delete-btn:hover {
    background: #d0d0d0;
  }

  .confirm-delete-btn {
    padding: 0.75rem 1.5rem;
    background: #c00;
    border: none;
    border-radius: 2px;
    color: #fff;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .confirm-delete-btn:hover {
    background: #a00;
  }

  @media (max-width: 768px) {
    .detail-container {
      padding: 1rem;
    }

    .detail-header {
      gap: 1rem;
      align-items: flex-start;
    }
  }

  /* === payment links list === */
  .payment-links-section {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .payment-links-header {
    margin-bottom: 1rem;
    margin-top: 1rem;
  }

  .payment-links-header h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  .create-link-btn {
    z-index: 100;
    background: var(--accent);
    border: none;
    color: #fff;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.2s ease;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    border-radius: 2px;
    padding: 1rem 2rem;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }

  .create-link-btn:hover {
    background: #000;
  }

  @media (max-width: 768px) {
    .create-link-btn {
      bottom: 90px;
    }
  }

  .payment-link-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
  }

  .payment-link-card:hover {
    border-color: var(--accent);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .payment-link-info {
    flex: 1;
  }

  .payment-link-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
  }

  .copy-link-btn {
    background: #f0f0f0;
    border: 1px solid #ddd;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-link-btn:hover {
    background: #e0e0e0;
  }

  .invoice-badge,
  .product-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 2px;
    margin-left: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .invoice-badge {
    background: #f0f0f0;
    color: var(--accent);
    border: 1px solid #ddd;
  }

  .product-badge {
    background: #f9f9f9;
    color: #666;
    border: 1px solid #eee;
  }

  .payment-links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 10px;
  }

  .payment-link-url {
    color: var(--accent);
    margin: 0 0 0.5rem 0;
    font-size: 0.875rem;
  }

  .payment-link-details {
    display: flex;
    gap: 0.5rem;
    font-size: 0.875rem;
    color: #666;
  }

  .payment-link-dialog .dialog {
    max-width: 600px;
  }

  @media (max-width: 768px) {
    .payment-links-header {
      flex-direction: column;
      gap: 1rem;
      align-items: flex-start;
    }
  }

  .detail-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .back-btn {
    padding: 30px 0 30px 0;
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text);
    text-decoration: none;
    font-size: 0.875rem;
    opacity: 0.8;
    transition: all 0.2s ease;
  }

  .back-btn:hover {
    opacity: 1;
  }

  .detail-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2rem;
    margin-bottom: 2rem;
  }

  .detail-stats {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
    margin-bottom: 2rem;
  }

  .stat-card {
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 1rem;
  }

  .stat-label {
    font-size: 0.875rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: 600;
  }

  .payment-history {
    background: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 2px;
    padding: 1rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #eee;
  }

  .history-item:last-child {
    border-bottom: none;
  }

  /* === form tabs === */
  .form-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }

  .form-tab {
    background: none;
    border: none;
    color: var(--text);
    opacity: 0.5;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.2s ease;
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
    transition: transform 0.2s ease;
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
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-btn:hover:not(:disabled) {
    background: #000;
  }

  /* === payment type selection === */
  .payment-type-card {
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: all 0.2s ease;
  }

  .payment-type-card:hover {
    border-color: var(--accent);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .payment-type-card.selected {
    border-color: var(--accent);
    background: #f0f0f0;
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
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.2s ease;
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
    border-color: var(--accent);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .payment-type-btn.selected {
    background: #f0f0f0;
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
    animation: slideIn 0.2s ease-out;
  }

  @keyframes slideIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .payment-type-form.product-form h3 {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
  }

  .payment-type-form.product-form {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 1.2rem;
  }

  .payment-type-form.product-form .form-input {
    transition: all 0.2s ease;
  }

  .payment-type-form.product-form .form-input:hover,
  .payment-type-form.product-form .form-input:focus {
    border-color: var(--accent);
  }

  .payment-type-form.product-form .form-label {
    font-size: 0.875rem;
    color: var(--accent);
    font-weight: 500;
    display: inline-block;
    margin-bottom: 0.75rem;
    padding-right: 1rem;
  }

  .product-title::placeholder {
    color: #999;
  }

  .product-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    width: 100%;
    border: 1px solid #eee;
    background: #f9f9f9;
    padding: 0.75rem;
    border-radius: 2px;
    transition: all 0.2s ease;
    margin-bottom: 1rem;
  }

  .product-details {
    text-align: center;
    line-height: 1.8;
    font-size: 1.1rem;
    color: #333;
    background: #f9f9f9;
    border-radius: 2px;
    border: 1px solid #eee;
    resize: none;
  }

  .payment-type-form.product-form .form-group {
    margin-bottom: 2rem;
    position: relative;
  }

  .product-invoice-fields {
    display: none;
  }

  .product-invoice-fields.active {
    display: block;
  }

  .payment-type-form.product-form > div {
    border-radius: 2px;
    padding: 0.5rem;
    position: relative;
    overflow: hidden;
  }

  /* === transactions list === */
  .transactions-section {
    padding: 2rem;
    max-width: 800px;
    margin: 0 auto;
  }

  .transactions-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
  }

  .transactions-header h1 {
    font-size: 2rem;
    font-weight: 600;
    margin: 0;
  }

  .transactions-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .transaction-item {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.2s ease;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .transaction-item:hover {
    border-color: var(--accent);
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
  }

  .transaction-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: #f0f0f0;
    color: #999;
  }

  .transaction-icon.incoming.product {
    background: #f0f0f0;
    color: var(--accent);
  }

  .transaction-icon.incoming.invoice {
    background: #f9f9f9;
    color: #666;
  }

  .transaction-info {
    flex: 1;
  }

  .transaction-primary {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
    gap: 20px;
  }

  .transaction-type {
    font-weight: 600;
  }

  .transaction-amount.product-amount {
    color: var(--accent);
    font-weight: 600;
  }

  .transaction-amount.invoice-amount {
    color: #666;
    font-weight: 600;
  }

  .transaction-secondary {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: #666;
  }

  .transaction-status.product-badge {
    background: #f0f0f0;
    color: var(--accent);
    padding: 0.15rem 0.6rem;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid #ddd;
  }

  .transaction-status.invoice-badge {
    background: #f9f9f9;
    color: #666;
    padding: 0.15rem 0.6rem;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid #eee;
  }

  .transaction-date {
    color: #999;
  }

  .transaction-address {
    font-family: "Courier New", monospace;
    color: #999;
  }

  .transactions-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 1rem;
    text-align: center;
    color: #999;
  }

  .transactions-empty h3 {
    margin: 0;
    color: var(--text);
  }

  .transactions-empty p {
    margin: 0;
    font-size: 0.875rem;
  }

  @media (max-width: 768px) {
    .transactions-header {
      flex-direction: column;
      gap: 1rem;
      align-items: stretch;
    }

    .transactions-filter {
      width: 100%;
    }

    .transaction-secondary {
      flex-direction: row;
      gap: 0.25rem;
    }
  }

  /* === empty payment links === */
  .empty-payment-links-card {
    background: #fff;
    border: 2px dashed #ddd;
    border-radius: 2px;
    padding: 3rem 2rem;
    text-align: center;
    margin: 2rem auto;
    max-width: 500px;
    transition: all 0.2s ease;
  }

  .empty-payment-links-card:hover {
    border-color: var(--accent);
  }

  .empty-payment-links-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    padding: 1rem;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--accent);
    animation: float 3s ease-in-out infinite;
  }

  .empty-payment-links-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--accent);
  }

  .empty-payment-links-description {
    color: #666;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .empty-payment-links-button {
    background: var(--accent);
    color: #fff;
    border: none;
    padding: 1rem 2rem;
    border-radius: 2px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-payment-links-button:hover {
    background: #000;
    box-shadow: 0 1px 3px rgba(0,0,0,0.12);
  }

  /* === form tab styles === */
  .error-message {
    color: #c00;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    margin-bottom: 11px;
    display: none;
  }

  .form-input.error {
    border-color: #c00;
    background: #f4ecec;
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(204, 0, 0, 0.1);
  }

  /* === no wallets guidance === */
  .guidance-card {
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 2px;
    padding: 2rem;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0,0,0,0.08);
    animation: fadeInUp 0.4s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }

  .guidance-icon {
    width: 80px;
    height: 80px;
    background: #f0f0f0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 1rem;
  }

  .guidance-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin: 0;
  }

  .guidance-text {
    color: #444;
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }

  .guidance-cta {
    background: var(--accent);
    color: #fff;
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 2px;
    font-weight: 600;
    transition: all 0.2s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .guidance-cta:hover {
    background: #000;
  }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
/*syncHeights*/
  .connection-progress {
    display: grid;
    justify-items: start;
    align-content: center;
    line-height: 1.15;
  }
  .connection-progress .heights {
    color: #888;
    font-size: 0.75rem;
    font-variant-numeric: tabular-nums;
    font-family: "Courier New", monospace;
  }
  .connection-progress .mini-divider {
    width: 50px;
    height: 4px;
    background: #666;
    border-radius: 12px;
    margin: 2px 0;
  }
  .connection-progress .no-connection {
    color: #888;
    font-size: 0.75rem;
    font-family: "Courier New", monospace;
    line-height: 1.15;
  }
</style>`;