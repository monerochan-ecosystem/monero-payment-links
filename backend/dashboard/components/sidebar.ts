import { html, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../../users/loginLogout";
import { walletSvg } from "../svgs";

export function sidebar(mini: Mini<Loggedin>) {
  return mini.html`  <nav class="sidebar">

    
    <a href="/wallets" class="menu-item ${() => {
      if (mini.requrl.pathname.startsWith("/wallets")) return "active";
    }}">
        <img src="${walletSvg}" class="icon" />
      Wallets
    </a>
    
    <a href="/transactions" class="menu-item ${() => {
      if (mini.requrl.pathname.startsWith("/transactions")) return "active";
    }}">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M7 16V4M7 4L3 8M7 4L11 8"/>
        <path d="M17 8v12M17 20l4-4M17 20l-4-4"/>
      </svg>
      Transactions
    </a>
    
    <a href="/payment-links" class="menu-item ${() => {
      if (mini.requrl.pathname.startsWith("/payment-links")) return "active";
    }}">
      <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
        <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
      </svg>
      Payment Links
    </a>
  </nav>
  ${sidebarStyles}
`;
}

const sidebarStyles = html`<style>
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
    text-decoration: none;
    border-radius: 8px;
    transition: all 0.3s ease;
    margin-bottom: 0.5rem;
  }

  .menu-item:hover {
    background: rgba(124, 58, 237, 0.2);
    transform: translateX(4px);
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
      height: 60px; /* Set fixed height */
      padding: 0.4rem 0.5rem; /* Reduce padding */
      flex-direction: row;
      justify-content: space-around;
      align-items: center; /* Align items to the center */
      background: var(--primary);
      z-index: 100;
      border-right: none;
      border-top: 1px solid var(--accent);
    }

    .sidebar-logo {
      display: none; /* Hide logo on mobile */
    }

    .menu-item {
      flex-direction: row; /* Change from column to row */
      padding: 0.5rem;
      margin-bottom: 0;
      text-align: left; /* Change from center to left */
      font-weight: 700;
      width: auto; /* Remove fixed width */
      gap: 0.2rem; /* Add gap between icon and text */
    }

    .main-content {
      padding-bottom: 80px; /* Increase padding to prevent overlap */
    }

    .add-wallet-btn {
      bottom: 90px; /* Move button further up to avoid overlap */
    }
  }
</style>`;
