import type { Server, ServerWebSocket } from "bun";
import type { ManyScanCachesOpened } from "@spirobel/monero-wallet-api";
import type { SyncStatus } from "./dashboard/dashboard";

export const WS_TOPIC = "dashboard";

let server: Server<undefined> | null = null;
export function setServer(s: Server<undefined>) {
  server = s;
}

export function broadcast(data: object) {
  server?.publish(WS_TOPIC, JSON.stringify(data));
}

export function serializeWallets(wallets?: ManyScanCachesOpened) {
  const wallet_balances = wallets?.wallets.map((w) => ({
    primary_address: w.primary_address,
    spendable: w.amount.toString(),
    pending: w.pending_amount.toString(),
  })) || [];

  const sync = wallets?.connectionStatusOpened?.connectionStatus?.sync ?? null;
  const sync_status: SyncStatus = {
    current_height: wallets?.current_height ?? null,
    daemon_height: wallets?.daemonHeight ?? sync?.daemon_height ?? 0,
    is_connected: wallets?.connectionStatusOpened?.isConnected ?? false,
    eta: sync?.eta ?? null,
  };

  return { wallet_balances, sync_status };
}
