import { html } from "@spirobel/mininext";
import { router } from "./dashboard_router";
export const sidebarStyles = html`<style>
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
    .menu-item:hover {
      background: rgba(124, 58, 237, 0.2);
      transform: translateY(-4px);
    }

    .main-content {
      padding-bottom: 80px;
    }

    .add-wallet-btn {
      bottom: 90px;
    }
  }
</style>`;

export function sidebar() {
  const current_path = router.getCurrentPath();
  return html`
    <nav class="sidebar">
      <a
        href="${router.link("/wallets")}"
        class="menu-item ${current_path.startsWith("/wallets") ? "active" : ""}"
      >
        <svg
          width="24"
          height="24"
          stroke-width="2"
          fill="white"
          class="bi bi-wallet"
          viewBox="0 0 16 16"
        >
          <path
            d="M0 3a2 2 0 0 1 2-2h13.5a.5.5 0 0 1 0 1H15v2a1 1 0 0 1 1 1v8.5a1.5 1.5 0 0 1-1.5 1.5h-12A2.5 2.5 0 0 1 0 12.5zm1 1.732V12.5A1.5 1.5 0 0 0 2.5 14h12a.5.5 0 0 0 .5-.5V5H2a2 2 0 0 1-1-.268M1 3a1 1 0 0 0 1 1h12V2H2a1 1 0 0 0-1 1"
          />
        </svg>
        Wallets
      </a>

      <a
        href="${router.link("/transactions")}"
        class="menu-item ${current_path.startsWith("/transactions")
          ? "active"
          : ""}"
      >
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M7 16V4M7 4L3 8M7 4L11 8" />
          <path d="M17 8v12M17 20l4-4M17 20l-4-4" />
        </svg>
        Transactions
      </a>

      <a
        href="${router.link("/payment-links")}"
        class="menu-item ${current_path.startsWith("/payment-links")
          ? "active"
          : ""}"
      >
        <svg
          class="icon"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
        >
          <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
        </svg>
        Payment Links
      </a>
      ${sidebarStyles}
    </nav>
  `;
}
