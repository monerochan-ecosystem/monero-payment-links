import { html } from "@spirobel/mininext";

// checkout
export const checkoutStyles = html`<style>
  iframe {
    border: none;
    width: 100%;
    height: 55px;
  }

  :root {
    --primary: #5b21b6;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #070707;
    --success: #34d399;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
    padding: 1rem;
    background-image: radial-gradient(
      circle at 50% 50%,
      rgba(124, 58, 237, 0.15) 0%,
      transparent 50%
    );
  }

  .checkout-container {
    max-width: 500px;
    width: 100%;
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 2rem;
  }

  .payment-info {
    margin-bottom: 2rem;
  }

  .payment-amount {
    text-align: center;
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 0.5rem;
    background: linear-gradient(135deg, #fff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-shadow: 0 0 30px rgba(124, 58, 237, 0.3);
  }

  .payment-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
  }

  .info-box {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
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
    background: linear-gradient(135deg, #fff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .info-due-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(248, 250, 252, 0.6);
    margin-bottom: 0.75rem;
  }

  .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: rgba(248, 250, 252, 0.8);
    white-space: pre-wrap;
  }

  .product-description {
    text-align: center;
    margin-bottom: 3rem;
    line-height: 1.8;
    font-size: 1.1rem;
    color: rgba(248, 250, 252, 0.9);
    padding: 2rem;
    background: rgba(124, 58, 237, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .payment-steps {
    counter-reset: step;
  }

  .step {
    display: flex;
    gap: 1rem;
    margin-bottom: 12px;
    padding: 19px;
    background: rgba(20, 20, 20, 0.5);
    border-radius: 12px;
    border: 1px solid rgba(124, 58, 237, 0.1);
    transition: all 0.3s ease;
  }

  .step:hover {
    border-color: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }

  .step:before {
    counter-increment: step;
    content: counter(step);
    width: 28px;
    height: 28px;
    background: var(--accent);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    flex-shrink: 0;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.3);
  }

  .step-content {
    flex: 1;
  }

  .step h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .step p {
    margin: 0;
    font-size: 0.925rem;
    opacity: 0.8;
  }

  .wallet-address {
    background: rgba(20, 20, 20, 0.5);
    border-radius: 12px;
    padding: 1rem;
    font-family: monospace;
    word-break: break-all;
    margin: 0.5rem 0;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
  }
  .wallet-address::selection {
    background: rgba(124, 58, 237, 0.4);
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
    background: linear-gradient(135deg, var(--accent) 0%, #6d28d9 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.25s ease;
    box-shadow:
      0 4px 15px rgba(124, 58, 237, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .pay-button:hover {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow:
      0 6px 25px rgba(124, 58, 237, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .pay-button:active {
    transform: translateY(0);
    box-shadow:
      0 2px 10px rgba(124, 58, 237, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .wallet-address::selection {
    background: rgba(124, 58, 237, 0.6);
    color: #ffffff;
  }
  .wallet-address::-moz-selection {
    background: rgba(124, 58, 237, 0.6);
    color: #ffffff;
  }

  .copy-btn {
    background: var(--accent);
    border: none;
    color: var(--text);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    font-size: 0.875rem;
    transition: all 0.3s ease;
    white-space: nowrap;
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
  }

  .copy-btn:hover {
    background: var(--primary);
    transform: translateY(-2px);
  }

  .copy-btn.copied {
    background: var(--success);
  }

  .qr-code {
    width: 140px;
    height: 140px;
    background: white;
    border-radius: 12px;
    margin: 1rem auto;
    padding: 1rem;
    box-shadow: 0 0 30px rgba(124, 58, 237, 0.2);
  }

  .payment-status {
    text-align: center;
    margin-top: 2rem;
    padding: 1rem;
    border-radius: 12px;
    animation: pulse 2s infinite;
    backdrop-filter: blur(5px);
  }

  .payment-status.pending {
    background: rgba(124, 58, 237, 0.1);
  }

  .payment-status.success {
    background: rgba(16, 185, 129, 0.12);
  }

  @keyframes pulse {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.8;
    }
  }

  .timer {
    text-align: center;
    font-size: 0.875rem;
    opacity: 0.8;
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

// checkout
export const invoicePaidStyles = html`<style>
  :root {
    --primary: #5b21b6;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #070707;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
    padding: 1rem;
    background-image: radial-gradient(
      circle at 50% 50%,
      rgba(124, 58, 237, 0.15) 0%,
      transparent 50%
    );
  }

  .info-container {
    max-width: 520px;
    width: 100%;
    text-align: center;
  }

  .info-card {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 2.5rem 2rem;
  }

  .info-box {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
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
    background: linear-gradient(135deg, #fff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: rgba(248, 250, 252, 0.8);
    white-space: pre-wrap;
  }

  .info-message {
    font-size: 1rem;
    line-height: 1.7;
    color: rgba(248, 250, 252, 0.8);
    margin: 0;
  }

  .info-tx {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    font-size: 0.875rem;
  }

  .info-tx-label {
    color: rgba(248, 250, 252, 0.6);
  }

  .info-tx-hash {
    font-family: monospace;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .info-tx-hash:hover {
    color: #a78bfa;
    text-decoration: underline;
  }

  @media (max-width: 640px) {
    .info-card {
      padding: 2rem 1.5rem;
    }
  }
</style>`;



// checkout
export const outOfStockStyles = html`<style>
  :root {
    --primary: #5b21b6;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #070707;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
    padding: 1rem;
    background-image: radial-gradient(
      circle at 50% 50%,
      rgba(124, 58, 237, 0.15) 0%,
      transparent 50%
    );
  }

  .info-container {
    max-width: 520px;
    width: 100%;
    text-align: center;
  }

  .info-card {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 2.5rem 2rem;
  }

  .info-box {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
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
    background: linear-gradient(135deg, #fff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: rgba(248, 250, 252, 0.8);
    white-space: pre-wrap;
  }

  .info-message {
    font-size: 1rem;
    line-height: 1.7;
    color: rgba(248, 250, 252, 0.8);
    margin: 0;
  }

  @media (max-width: 640px) {
    .info-card {
      padding: 2rem 1.5rem;
    }
  }
</style>`;



// checkout
export const paymentStatusStyles = html`<style>
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html,
  body {
    background-color: #000;
    color: #fff;
  }
  :root {
    --primary: #5b21b6;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #070707;
    --success: #34d399;
  }
  .payment-status {
    text-align: center;
    padding: 1rem;
    border-radius: 12px;
    animation: pulse 2s infinite;
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  html {
    background: rgba(20, 20, 20, 0.8);
  }

  .payment-status.pending {
    background: rgba(124, 58, 237, 0.1);
  }

  .payment-status.success {
    background: rgba(16, 185, 129, 0.12);
  }

  @keyframes pulse {
    0% {
      opacity: 0.8;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.8;
    }
  }
  body {
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
    background: rgba(20, 20, 20, 0.8);
  }
</style>`;



// checkout
export const walletNotDetectedStyles = html`<style>
  :root {
    --primary: #5b21b6;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #070707;
    --success: #34d399;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
    padding: 1rem;
    background-image: radial-gradient(
      circle at 50% 50%,
      rgba(124, 58, 237, 0.15) 0%,
      transparent 50%
    );
  }

  .wallet-not-detected {
    max-width: 480px;
    width: 100%;
    text-align: center;
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 3rem 2rem;
  }

  .wallet-not-detected h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 1rem 0;
    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .wallet-not-detected p {
    font-size: 1rem;
    line-height: 1.7;
    color: rgba(248, 250, 252, 0.8);
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
    background: linear-gradient(135deg, var(--accent) 0%, #6d28d9 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
    transition: all 0.25s ease;
    box-shadow:
      0 4px 15px rgba(124, 58, 237, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .install-btn:hover {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow:
      0 6px 25px rgba(124, 58, 237, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .install-btn:active {
    transform: translateY(0);
    box-shadow:
      0 2px 10px rgba(124, 58, 237, 0.3),
      inset 0 1px 0 rgba(255, 255, 255, 0.05);
  }

  .back-btn {
    display: block;
    align-items: center;
    gap: 6px;
    margin-top: 1.5rem;
    font-size: 0.9rem;
    font-weight: 500;
    font-family: inherit;
    color: rgba(248, 250, 252, 0.5);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .back-btn:hover {
    color: rgba(248, 250, 252, 0.85);
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


export const dashBoardStyles = html`
<style>
  /*mainStyles*/
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
  /*sidebarStyles*/
  .sidebar {
    width: 280px;
    background: var(--primary);
    padding: 2rem 1rem;
    display: flex;
    flex-direction: column;
    border-right: 1px solid var(--accent);
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
    border-radius: 8px;
    cursor: pointer;
    user-select: none;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
  }

  .menu-item:hover {
    background: rgba(124, 58, 237, 0.2);
  }

  .menu-item.active {
    background: var(--accent);
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
      background: var(--primary);
      z-index: 100;
      border-right: none;
      border-top: 1px solid var(--accent);
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
    .set-nodeurl-btn {
      bottom: 90px !important;
      left: 2rem !important;
    }
  }
/*walletFormStyles */
.restore-wallet-link {
  color: var(--accent, #7c3aed);
  text-decoration: underline;
  cursor: pointer;
  font-size: 0.9rem;
}
.restore-wallet-link:hover {
  color: var(--primary, #5b21b6);
}

/*walletStyles*/
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
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 20px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
  .empty-wallet-card {
    text-decoration: none;
    max-width: 380px;
    height: 220px;
    background: rgba(91, 33, 182, 0.1);
    border: 2px dashed var(--accent);
    border-radius: 20px;
    padding: 24px;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
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
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-wallet-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
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
    color: var(--text);
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .add-wallet-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
  }
  .set-nodeurl-btn {
    text-decoration: none;
    outline: none;
    position: fixed;
    bottom: 2rem;
    left: 360px;
    background: var(--accent);
    border: none;
    color: var(--text);
    padding: 1rem 2rem;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .set-nodeurl-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
  }

  .show-more {
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
  .show-less {
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

  .advanced-toggle:hover {
    opacity: 1;
  }

  .advanced-fields {
    overflow: hidden;
    opacity: 1;
    max-height: 300px;
    margin-bottom: 1rem;
  }

  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    display: none;
  }

  .form-input.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  }

  .delete-btn {
    cursor: pointer;
    width: 100%;
    font-size: 1rem;
    margin-top: 1rem;
    transition: all 0.3s ease;
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 8px;
    color: #fecaca;
  }

  .delete-btn:hover {
    background: #b91c1c;
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(220, 38, 38, 0.1);
    border: 1px solid rgba(220, 38, 38, 0.3);
    border-radius: 8px;
    color: #fecaca;
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
    border-radius: 6px;
    border: none;
    cursor: pointer;
    font-weight: 600;
  }

  .cancel-delete {
    background: #374151;
    color: var(--text);
  }

  .cancel-delete:hover {
    background: #4b5563;
  }

  .confirm-delete {
    background: #dc2626;
    color: var(--text);
  }

  .confirm-delete:hover {
    background: #b91c1c;
  }

  .edit-dialog-overlay {
    display: none;
  }

  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:disabled {
    background: #4c4c4c;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn .button-text {
    display: inline;
  }

  .submit-btn.loading .button-text {
    display: none;
  }

  .submit-btn.loading .spinner {
    display: inline-block;
  }

  .spinner {
    display: none;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .submit-btn:hover {
    background: var(--primary);
    transform: translateY(-2px);
  }


  .wallet-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
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
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }
  .wallet-name {
    font-size: 2rem;
    font-weight: 700;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  }

  .wallet-address {
    width: 100%;
    word-wrap: break-word;
    display: inline-block;
    font-size: 0.875rem;
    opacity: 0.7;
    margin-bottom: 20px;
    transition: all 0.3s ease;
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
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    transition: all 0.3s ease;
  }

  .block.synced {
    background: var(--accent);
    box-shadow: 0 0 10px var(--accent);
    animation: blockPulse 2s infinite;
  }

  @keyframes blockPulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }

  .sync-status {
    font-size: 0.875rem;
    margin-top: 10px;
    animation: fadeInOut 2s infinite;
  }

  @keyframes fadeInOut {
    0% {
      opacity: 0.7;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0.7;
    }
  }

/* createPaymentLinkFormStyles */
  .submit-btn {
    width: 100%;
    padding: 1rem;
    background: var(--accent);
    border: none;
    border-radius: 8px;
    color: var(--text);
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .submit-btn:disabled {
    background: #4c4c4c;
    cursor: not-allowed;
    transform: none;
  }

  .submit-btn .button-text {
    display: inline;
  }

  .submit-btn.loading .button-text {
    display: none;
  }

  .submit-btn.loading .spinner {
    display: inline-block;
  }

  .spinner {
    display: none;
    width: 20px;
    height: 20px;
    border: 3px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    border-top-color: #fff;
    animation: spin 1s ease-in-out infinite;
    margin: 0 auto;
  }

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  .submit-btn:hover {
    background: var(--primary);
    transform: translateY(-2px);
  }

  .delete-btn {
    width: 100%;
    padding: 0.75rem;
    background: transparent;
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
    color: #ef4444;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 0.75rem;
  }

  .delete-btn:hover {
    background: rgba(239, 68, 68, 0.1);
    border-color: rgba(239, 68, 68, 0.5);
  }

  .delete-warning {
    display: none;
    margin-top: 1rem;
    padding: 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.3);
    border-radius: 8px;
  }

  .delete-warning.show {
    display: block;
  }

  .delete-warning p {
    color: rgba(248, 250, 252, 0.9);
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
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 6px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }

  .cancel-delete:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .confirm-delete {
    flex: 1;
    padding: 0.5rem 1rem;
    background: #ef4444;
    border: none;
    border-radius: 6px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 600;
  }

  .confirm-delete:hover {
    background: #dc2626;
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


  .custom-dropdown-menu {
    position: relative;
    width: 100%;
  }

  .dropdown-display {
    padding: 0.75rem;
    background: transparent;
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 8px;
    color: var(--text);
    font-size: 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    min-height: 44px;
    white-space: normal;
    word-break: break-word;
  }

  .dropdown-display:empty::before {
    content: "Select a wallet";
    color: rgba(248, 250, 252, 0.5);
  }

  .dropdown-display:hover {
    border-color: var(--accent);
    box-shadow: 0 0 12px rgba(124, 58, 237, 0.1);
  }

  .dropdown-display::after {
    content: "▼";
    margin-left: auto;
    font-size: 0.75rem;
    opacity: 0.6;
    transition: transform 0.3s ease;
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
    background: rgba(20, 20, 20, 0.95);
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 8px;
    max-height: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(-10px);
    transition: all 0.3s ease;
    z-index: 1000;
    backdrop-filter: blur(10px);
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
    transition: all 0.2s ease;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .dropdown-item:not(.disabled):hover {
    background: rgba(124, 58, 237, 0.2);
    color: var(--accent);
    padding-left: 1.25rem;
  }

  .dropdown-item.disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }


/*paymentLinkDetailStyles*/ 
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
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
  }

  .detail-card .info-box {
    background: rgba(255, 255, 255, 0.05);
    border-radius: 12px;
    padding: 1.5rem;
    border: 1px solid rgba(124, 58, 237, 0.1);
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
    background: linear-gradient(135deg, #fff 0%, #7c3aed 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .detail-card .info-description {
    font-size: 0.925rem;
    line-height: 1.6;
    color: rgba(248, 250, 252, 0.8);
    white-space: pre-wrap;
  }

  .detail-card h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.75rem;
  }

  .detail-description {
    color: rgba(248, 250, 252, 0.8);
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
    font-family: monospace;
  }

  .info-payment-status {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    font-size: 0.875rem;
  }

  .info-payment-status-label {
    color: rgba(248, 250, 252, 0.6);
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
    color: #34d399;
  }

  .info-payment-status-value.paid::before {
    background: #34d399;
  }

  .info-payment-status-value.unpaid {
    color: rgba(248, 250, 252, 0.6);
  }

  .info-payment-status-value.unpaid::before {
    background: rgba(248, 250, 252, 0.4);
  }

  .info-due-date {
    font-size: 0.875rem;
    font-weight: 500;
    color: rgba(248, 250, 252, 0.6);
    margin-bottom: 0.75rem;
  }

  .info-wallet {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    font-size: 0.875rem;
  }

  .info-wallet-label {
    color: rgba(248, 250, 252, 0.6);
  }

  .info-wallet-address {
    font-family: monospace;
    color: var(--accent);
  }

  .info-payment-type {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid rgba(124, 58, 237, 0.1);
    font-size: 0.875rem;
  }

  .info-payment-type-label {
    color: rgba(248, 250, 252, 0.6);
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
    color: #34d399;
    font-weight: 600;
  }

  .transaction-status.confirmed {
    background: rgba(16, 185, 129, 0.12);
    color: #34d399;
    padding: 0.15rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid rgba(16, 185, 129, 0.2);
    width: 65px;
    text-align: center;
  }

  .transaction-date {
    color: rgba(248, 250, 252, 0.6);
  }

  .transaction-hash {
    font-family: monospace;
    color: rgba(248, 250, 252, 0.6);
  }

  .transaction-hash-link {
    font-family: monospace;
    color: var(--accent);
    text-decoration: none;
    transition: color 0.2s ease;
  }

  .transaction-hash-link:hover {
    color: #a78bfa;
    text-decoration: underline;
  }

  .edit-payment-link-btn {
    padding: 0.5rem;
  }

  .edit-payment-link-btn:hover {
    background: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }

  .delete-payment-link-btn {
    background: rgba(239, 68, 68, 0.2);
    border: 1px solid rgba(239, 68, 68, 0.3);
    color: #ef4444;
    padding: 0.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .delete-payment-link-btn:hover {
    background: rgba(239, 68, 68, 0.3);
    transform: translateY(-2px);
  }

  .delete-dialog-overlay {
    display: none;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(4px);
    z-index: 1000;
    align-items: center;
    justify-content: center;
  }

  .delete-dialog {
    background: var(--bg);
    border: 1px solid var(--accent);
    border-radius: 20px;
    padding: 2rem;
    max-width: 420px;
    width: 90%;
    text-align: center;
    box-shadow: 0 10px 30px rgba(124, 58, 237, 0.2);
  }

  .delete-dialog h3 {
    margin: 0 0 1rem 0;
    font-size: 1.25rem;
  }

  .delete-dialog p {
    color: rgba(248, 250, 252, 0.8);
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
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 8px;
    color: var(--text);
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
  }

  .cancel-delete-btn:hover {
    background: rgba(255, 255, 255, 0.2);
  }

  .confirm-delete-btn {
    padding: 0.75rem 1.5rem;
    background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
    border: none;
    border-radius: 8px;
    color: white;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 0.875rem;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(239, 68, 68, 0.35);
  }

  .confirm-delete-btn:hover {
    background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
    transform: translateY(-2px);
    box-shadow: 0 6px 25px rgba(239, 68, 68, 0.5);
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

/*paymentLinksStyles */
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
    color: var(--text);
    cursor: pointer;
    font-size: 1rem;
    transition: all 0.3s ease;
    position: fixed;
    bottom: 2rem;
    right: 2rem;
    border-radius: 10px;
    padding: 1rem 2rem;
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  .create-link-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(124, 58, 237, 0.4);
  }
  @media (max-width: 768px) {
    .create-link-btn {
      bottom: 90px;
    }
  }
  .payment-link-card {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
  }

  .payment-link-card:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
  }

  .payment-link-info {
    flex: 1;
  }

  .payment-link-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
  }

  .copy-link-btn {
    background: rgba(124, 58, 237, 0.2);
    border: none;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .copy-link-btn:hover {
    background: rgba(124, 58, 237, 0.3);
    transform: translateY(-2px);
  }

  .invoice-badge,
  .product-badge {
    font-size: 0.7rem;
    padding: 0.2rem 0.6rem;
    border-radius: 9999px;
    margin-left: 0.5rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    display: inline-flex;
    align-items: center;
    gap: 0.3rem;
  }

  .invoice-badge {
    background: rgba(124, 58, 237, 0.12);
    color: #a78bfa;
    border: 1px solid rgba(124, 58, 237, 0.2);
  }

  .product-badge {
    background: rgba(16, 185, 129, 0.12);
    color: #34d399;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }
  .payment-links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 10px;
  }

  .payment-link-info {
    flex: 1;
  }

  .payment-link-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.125rem;
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
    color: rgba(248, 250, 252, 0.8);
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
    transition: all 0.3s ease;
  }

  .back-btn:hover {
    opacity: 1;
  }

  .detail-card {
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
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
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
    border-radius: 8px;
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
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.1);
    border-radius: 12px;
    padding: 1rem;
  }

  .history-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid rgba(124, 58, 237, 0.1);
  }

  .history-item:last-child {
    border-bottom: none;
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
  .edit-payment-link-btn {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: var(--text);
    width: 32px;
    height: 32px;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .edit-payment-link-btn:hover {
    background: rgba(255, 255, 255, 0.3);
    transform: translateY(-2px);
  }

/*emptyPaymentLinksStyles*/
  .empty-payment-links-card {
    background: rgba(124, 58, 237, 0.1);
    border: 2px dashed rgba(124, 58, 237, 0.3);
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    margin: 2rem auto;
    max-width: 500px;
    transition: all 0.3s ease;
  }

  .empty-payment-links-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .empty-payment-links-icon {
    width: 80px;
    height: 80px;
    margin: 0 auto 1.5rem;
    padding: 1rem;
    background: rgba(124, 58, 237, 0.15);
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
    background: linear-gradient(135deg, var(--accent), #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .empty-payment-links-description {
    color: var(--text);
    opacity: 0.8;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .empty-payment-links-button {
    background: var(--accent);
    color: var(--text);
    border: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .empty-payment-links-button:hover {
    background: var(--primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3);
  }

  @keyframes float {
    0% {
      transform: translateY(0px);
    }
    50% {
      transform: translateY(-10px);
    }
    100% {
      transform: translateY(0px);
    }
  }
/*formTabStyles*/ 
  .error-message {
    color: #ef4444;
    font-size: 0.875rem;
    margin-top: 0.5rem;
    margin-bottom: 11px;
    display: none;
  }

  .form-input.error {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.1);
  }

  .form-input.error:focus {
    box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.2);
  }
  .form-tabs {
    display: flex;
    gap: 1rem;
    margin-bottom: 1.5rem;
    border-bottom: 1px solid rgba(124, 58, 237, 0.2);
    padding-bottom: 1rem;
  }

  .form-tab {
    background: none;
    border: none;
    color: var(--text);
    opacity: 0.7;
    padding: 0.5rem 1rem;
    cursor: pointer;
    transition: all 0.3s ease;
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
    transition: transform 0.3s ease;
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
    color: var(--text);
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .nav-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  .nav-btn:hover:not(:disabled) {
    background: var(--primary);
  }
/*paymentTypeSelectionStyles*/
  .payment-type-card {
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 2rem;
    margin-bottom: 1.5rem;
    cursor: pointer;
    transition: all 0.3s ease;
  }

  .payment-type-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }

  .payment-type-card.selected {
    border-color: var(--accent);
    background: rgba(124, 58, 237, 0.1);
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
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.3s ease;
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
    transform: translateY(-2px);
    border-color: var(--accent);
    box-shadow: 0 4px 12px rgba(124, 58, 237, 0.2);
  }

  .payment-type-btn.selected {
    background: rgba(124, 58, 237, 0.2);
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
    animation: slideIn 0.3s ease-out;
  }

  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .payment-type-form.product-form h3 {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
  }

  .payment-type-form.product-form {
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 1.2rem;
  }

  .payment-type-form.product-form .form-input:hover,
  .payment-type-form.product-form .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
  }

  .payment-type-form.product-form .form-input {
    transition: all 0.3s ease;
  }

  .payment-type-form.product-form .form-label {
    position: relative;
    font-size: 0.875rem;
    color: var(--accent);
    font-weight: 500;
    display: inline-block;
    margin-bottom: 0.75rem;
    padding-right: 1rem;
  }

  .product-title::placeholder {
    color: var(--accent);
  }

  .product-title {
    text-align: center;
    font-size: 1.5rem;
    font-weight: 600;
    color: var(--accent);
    margin-bottom: 2rem;
    letter-spacing: -0.02em;
    width: 100%;
    border: none;
    background: linear-gradient(
      135deg,
      rgba(124, 58, 237, 0.05),
      rgba(124, 58, 237, 0.1)
    );
    padding: 0.75rem;
    border-radius: 16px;
    text-align: center;
    letter-spacing: -0.02em;
    transition: all 0.3s ease;
    backdrop-filter: blur(10px);
    margin-bottom: 1rem;
  }

  .product-details {
    text-align: center;
    line-height: 1.8;
    font-size: 1.1rem;
    color: rgba(248, 250, 252, 0.9);
    background: rgba(124, 58, 237, 0.05);
    border-radius: 12px;
    border: 1px solid rgba(124, 58, 237, 0.1);
    resize: none;
  }

  .payment-type-form.product-form .form-group {
    margin-bottom: 2rem;
    position: relative;
  }

  .payment-type-form.product-form .form-input:hover,
  .payment-type-form.product-form .form-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 20px rgba(124, 58, 237, 0.2);
  }

  .payment-type-form.product-form > div {
    border-radius: 12px;
    padding: 0.5rem;
    position: relative;
    overflow: hidden;
  }
/*transactionsListStyles*/
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
    background: rgba(124, 58, 237, 0.1);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 12px;
    padding: 1.25rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
    text-decoration: none;
    color: inherit;
    cursor: pointer;
  }

  .transaction-item:hover {
    transform: translateY(-2px);
    border-color: var(--accent);
  }

  .transaction-icon {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    background: rgba(107, 114, 128, 0.1);
    color: #9ca3af;
  }

  .transaction-icon.incoming.product {
    background: rgba(16, 185, 129, 0.12);
    color: #34d399;
  }

  .transaction-icon.incoming.invoice {
    background: rgba(124, 58, 237, 0.12);
    color: #a78bfa;
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
    color: #34d399;
    font-weight: 600;
  }

  .transaction-amount.invoice-amount {
    color: #34d399;
    font-weight: 600;
  }

  .transaction-secondary {
    display: flex;
    gap: 1rem;
    font-size: 0.875rem;
    color: rgba(248, 250, 252, 0.8);
  }

  .transaction-status.product-badge {
    background: rgba(16, 185, 129, 0.12);
    color: #34d399;
    padding: 0.15rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  .transaction-status.invoice-badge {
    background: rgba(124, 58, 237, 0.12);
    color: #a78bfa;
    padding: 0.15rem 0.6rem;
    border-radius: 9999px;
    font-size: 0.7rem;
    font-weight: 600;
    letter-spacing: 0.02em;
    border: 1px solid rgba(124, 58, 237, 0.2);
  }

  .transaction-date {
    color: rgba(248, 250, 252, 0.6);
  }

  .transaction-address {
    font-family: monospace;
    color: rgba(248, 250, 252, 0.6);
  }

  .transactions-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    padding: 3rem 1rem;
    text-align: center;
    color: rgba(248, 250, 252, 0.6);
  }

  .transactions-empty h3 {
    margin: 0;
    color: var(--text);
  }

  .transactions-empty p {
    margin: 0;
    font-size: 0.875rem;
  }
/*noWalletsPaymentsCardStyles*/
  .guidance-card {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
    animation: fadeInUp 0.5s ease-out;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.5rem;
  }
  .guidance-icon {
    width: 80px;
    height: 80px;
    background: rgba(255, 255, 255, 0.1);
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
    color: rgba(255, 255, 255, 0.9);
    font-size: 1.1rem;
    line-height: 1.6;
    margin: 0;
  }
  .guidance-cta {
    background: rgba(255, 255, 255, 0.15);
    color: var(--text);
    text-decoration: none;
    padding: 1rem 2rem;
    border-radius: 10px;
    font-weight: 600;
    transition: all 0.3s ease;
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }
  .guidance-cta:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-2px);
  }
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>`
// login
export const loginStyles = html`<style>
  :root {
    --primary: #5b21b6;
    --accent: #7c3aed;
    --text: #f8fafc;
    --bg: #070707;
  }

  body {
    margin: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    background: var(--bg);
    font-family: "Inter", system-ui, sans-serif;
    color: var(--text);
    padding: 1rem;
    background-image: radial-gradient(
      circle at 50% 50%,
      rgba(124, 58, 237, 0.15) 0%,
      transparent 50%
    );
  }

  .login-card {
    max-width: 400px;
    width: 100%;
    text-align: center;
    background: rgba(20, 20, 20, 0.8);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(124, 58, 237, 0.2);
    border-radius: 20px;
    padding: 3rem 2rem;
  }

  .login-card h1 {
    font-size: 1.75rem;
    font-weight: 700;
    margin: 0 0 0.5rem 0;
    background: linear-gradient(135deg, #fff 0%, #a78bfa 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .login-card p.subtitle {
    font-size: 0.9rem;
    color: rgba(248, 250, 252, 0.5);
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
    background: rgba(124, 58, 237, 0.05);
    border: 1px solid rgba(124, 58, 237, 0.3);
    border-radius: 12px;
    outline: none;
    transition: all 0.25s ease;
    box-sizing: border-box;
  }

  .login-card input::placeholder {
    color: rgba(248, 250, 252, 0.4);
  }

  .login-card input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.15);
  }

  .login-card button {
    padding: 0.875rem 2rem;
    font-size: 1rem;
    font-weight: 600;
    font-family: inherit;
    color: #fff;
    background: linear-gradient(135deg, var(--accent) 0%, #6d28d9 100%);
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.25s ease;
    box-shadow:
      0 4px 15px rgba(124, 58, 237, 0.35),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  .login-card button:hover {
    background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    transform: translateY(-2px);
    box-shadow:
      0 6px 25px rgba(124, 58, 237, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
  }

  .login-card button:active {
    transform: translateY(0);
  }

  .login-card .error {
    color: #f87171;
    font-size: 0.875rem;
    margin: 0 0 1rem 0;
    padding: 0.75rem 1rem;
    background: rgba(239, 68, 68, 0.1);
    border: 1px solid rgba(239, 68, 68, 0.2);
    border-radius: 10px;
  }
</style>`;
