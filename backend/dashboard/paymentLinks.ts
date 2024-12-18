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
  paymentLinksCardStyles,
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
  return mini.html`${mainStyles} ${paymentLinksStyles} ${paymentLinksCardStyles}${createPaymentLinkFrontend}
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
    </div>`;
}

const paymentLinksStyles = html`<style>
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
