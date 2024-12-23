import { html, url, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { sidebar } from "./components/sidebar";
import { mainStyles } from ".";
import { createPaymentLinkForm } from "./components/createPaymentLinksForm";
import { walletSvg } from "./svgs";
import { db } from "../../db/db";
import { paymentLinks, wallets } from "../../db/schema";
import {
  paymentLinkCardInList,
  paymentLinksCardInListStyles,
} from "./components/paymentLinkCard";
const createPaymentLinkFrontend = url.frontend("createPaymentLink.ts");
export function paymentLinksEndpoint(mini: Mini<Loggedin>) {
  const walletList = db.select().from(wallets).all();
  const paymentLinksList = db.select().from(paymentLinks).all();

  if (walletList.length == 0) {
    return mini.html`   ${mainStyles} ${paymentLinksStyles} ${createPaymentLinkFrontend}
  <div class="layout-container">
   ${sidebar}
   ${noWalletsPaymentsCardStyles} 
   <main class="main-content payment-links-section">
    <div class="guidance-card" id="no-wallets-guidance">
      <div class="guidance-icon">
        <img src="${walletSvg}" width="38" height="38" />
      </div>
      <h2 class="guidance-title">Connect a Wallet First</h2>
      <p class="guidance-text">
        To create and manage payment links, you'll need to connect a wallet. Head over to the Wallets section to get started.
      </p>
      <a href="/wallets" class="guidance-cta">
        Go to Wallets
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      </a>
    </div>
    </main>
    </div>`;
  }
  const paymentLinksElementList = [];
  for (const paymentLinks of paymentLinksList) {
    paymentLinksElementList.push(paymentLinkCardInList(mini, paymentLinks));
  }
  if (paymentLinksList.length === 0) {
    return mini.html`
    ${mainStyles} ${paymentLinksStyles} ${paymentLinksCardInListStyles}${createPaymentLinkFrontend}
  <div class="layout-container">
    ${sidebar} 
    <main class="main-content payment-links-section">
      ${createPaymentLinkForm(mini, walletList)}
          <div class="empty-state-card">
          <div class="empty-state-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>
            </svg>
          </div>
          <h3 class="empty-state-title">Create Your First Payment Link!</h3>
          <p class="empty-state-description">
            Start accepting payments in minutes. Create a payment link for your product, service, or invoice and share it with your customers.
          </p>
          <button class="empty-state-button" onclick="document.querySelector('.create-link-btn').click()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            Create Payment Link
          </button>
        </div>
        </main>
        </div>`;
  }
  return mini.html`${mainStyles} ${paymentLinksStyles} ${paymentLinksCardInListStyles}${createPaymentLinkFrontend}
  <div class="layout-container">
    ${sidebar} 
    <main class="main-content payment-links-section">
      <div class="payment-links-header">
        <h1>Payment Links</h1>
      </div>
      ${createPaymentLinkForm(mini, walletList)}
      <div class="payment-links-list">
        ${paymentLinksElementList}
      </div>
      </main>
    </div>`;
}

const paymentLinksStyles = html`<style>
  .empty-state-card {
    background: rgba(124, 58, 237, 0.1);
    border: 2px dashed rgba(124, 58, 237, 0.3);
    border-radius: 20px;
    padding: 3rem 2rem;
    text-align: center;
    margin: 2rem auto;
    max-width: 500px;
    transition: all 0.3s ease;
  }

  .empty-state-card:hover {
    border-color: var(--accent);
    transform: translateY(-2px);
  }

  .empty-state-icon {
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

  .empty-state-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, var(--accent), #a855f7);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .empty-state-description {
    color: var(--text);
    opacity: 0.8;
    margin-bottom: 2rem;
    line-height: 1.6;
  }

  .empty-state-button {
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

  .empty-state-button:hover {
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
  .payment-links-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
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

  .payment-links-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }
</style>`;

const noWalletsPaymentsCardStyles = html`<style>
  .guidance-card {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    border-radius: 20px;
    padding: 2rem;
    max-width: 500px;
    width: 90%;
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
</style>`;
