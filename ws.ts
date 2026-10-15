import type { Server, ServerWebSocket } from "bun";
import type { ManyScanCachesOpened } from "@spirobel/monero-wallet-api";
import {
  getAllPaymentLinks,
  getDashboardCheckoutSessions,
  type CheckoutSessionRow,
  type CombinedPaymentLinkRow,
} from "./db";
import { getWallets } from "./dashboard/backend/wallets";

export const WS_TOPIC = "dashboard";

let server: Server<undefined> | null = null;
export function setServer(s: Server<undefined>) {
  server = s;
}

export function broadcast(data: object) {
  server?.publish(WS_TOPIC, JSON.stringify(data));
}

export function serializeWallets(wallets?: ManyScanCachesOpened) {
  const sync_status = wallets?.connectionStatusOpened?.connectionStatus?.sync;
  return {
    wallet_balances:
      wallets?.wallets.map((w) => ({
        primary_address: w.primary_address,
        spendable: w.amount.toString(),
        pending: w.pending_amount.toString(),
      })) ?? [],
    sync_status,
    current_height: wallets?.current_height ?? null,
  };
}

export function serializeDashboard(
  wallets?: ManyScanCachesOpened,
  checkoutSessions?: CheckoutSessionRow[],
  paymentLinks?: CombinedPaymentLinkRow[],
) {
  return {
    ...serializeWallets(wallets),
    checkout_sessions: checkoutSessions ?? [],
    payment_links: paymentLinks ?? [],
  };
}

export async function loadDashboardBroadcast() {
  return serializeDashboard(
    getWallets(),
    await getDashboardCheckoutSessions(),
    await getAllPaymentLinks(),
  );
}
