import {
  handle002ShareRequest,
  readWalletsFromScanSettings,
  writeStartHeightToScanSettings,
  writeNodeUrlToScanSettings,
  writeMerchantConfirmationsToScanSettings,
} from "@spirobel/monero-wallet-api";
import { checkAdminAndRedirect } from "../login";
import type { ManyScanCachesOpened } from "@spirobel/monero-wallet-api";

let _wallets: ManyScanCachesOpened | undefined;

export function getWallets(): ManyScanCachesOpened | undefined {
  return _wallets;
}

export function setWallets(w: ManyScanCachesOpened) {
  _wallets = w;
}

export const WALLET_CACHES_DIR = "wallet-caches";
export const SCAN_SETTINGS_PATH = WALLET_CACHES_DIR + "/ScanSettings.json";
export async function saveWallet(
  primary_address: string,
  view_key: string,
  wallet_name: string,
  wallet_slot?: number,
  originalPrimaryAddress?: string,
) {
  primary_address = primary_address.trim();
  view_key = view_key.trim();

  const wallets = getWallets();
  const existingWallet = wallets?.wallets.find(
    (w) => w.primary_address === primary_address,
  );
  if (originalPrimaryAddress && originalPrimaryAddress !== primary_address) {
    // address changed: remove old, add new
    await wallets?.removeWallet(originalPrimaryAddress);
    await wallets?.addViewWallet(primary_address, view_key, {
      wallet_name,
      wallet_slot,
    });
  } else if (originalPrimaryAddress === primary_address || existingWallet) {
    // same address, just update fields
    await wallets?.setWalletName(primary_address, wallet_name);
    if (typeof wallet_slot === "number") {
      await wallets?.setWalletSlot(primary_address, wallet_slot);
    }
  } else {
    // new wallet
    await wallets?.addViewWallet(primary_address, view_key, {
      wallet_name,
      wallet_slot,
    });
  }
}

export type WalletFormInput = {
  walletName: string;
  primaryAddress: string;
  secretViewKey: string;
  originalPrimaryAddress?: string;
  walletSlot?: number;
};

export async function editWalletRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  try {
    const body = (await req.json()) as WalletFormInput;

    const validation = validateWalletInput(body);
    if (!validation.success) {
      return Response.json({ success: false, error: validation.error });
    }

    await saveWallet(
      body.primaryAddress,
      body.secretViewKey,
      body.walletName,
      body.walletSlot,
      body.originalPrimaryAddress,
    );
    return Response.json({
      success: true,
      primaryAddress: body.primaryAddress,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    return Response.json({
      success: false,
      error: { issues: [{ path: [], message }] },
    });
  }
}

export async function shareViewKeyRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  //if slot already exists we  make sure primary address & vk is the same
  const wallets = await readWalletsFromScanSettings(SCAN_SETTINGS_PATH);
  const res = await handle002ShareRequest(
    req,
    wallets,
    async ({ primary_address, viewkey, wallet_slot }) => {
      const existingWallet = wallets.find(
        (w: any) => w.primary_address === primary_address.trim(),
      );
      const wallet_name =
        existingWallet?.wallet_name ?? "unnamed wallet " + wallet_slot;
      await saveWallet(
        primary_address.trim(),
        viewkey.trim(),
        wallet_name,
        wallet_slot,
      );
    },
    "/dashboard#/wallets",
  );
  return Response.json(res);
}

export async function deleteWalletRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;

  try {
    const body = await req.json();

    // Validate the input
    if (
      typeof body.primaryAddress !== "string" ||
      body.primaryAddress.trim().length === 0
    ) {
      return Response.json({
        success: false,
        error: {
          issues: [
            {
              path: ["primaryAddress"],
              message: "Primary address is required",
            },
          ],
        },
      });
    }

    // Delete the wallet by removing it from scan settings
    const wallets = getWallets();
    await wallets?.removeWallet(body.primaryAddress);

    return Response.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown error";
    console.error("Error deleting wallet:", error);
    return Response.json({
      success: false,
      error: { issues: [{ path: [], message }] },
    });
  }
}

function validateWalletInput(input: WalletFormInput) {
  const issues: { path: string[]; message: string }[] = [];

  // Check walletName
  if (
    typeof input.walletName !== "string" ||
    input.walletName.trim().length === 0
  ) {
    issues.push({
      path: ["walletName"],
      message: "Wallet name is required and must be a non-empty string",
    });
  } else if (input.walletName.length > 100) {
    issues.push({
      path: ["walletName"],
      message: "Wallet name must be less than 100 characters",
    });
  }

  // Check primaryAddress
  if (
    typeof input.primaryAddress !== "string" ||
    input.primaryAddress.trim().length === 0
  ) {
    issues.push({
      path: ["primaryAddress"],
      message: "Primary address is required and must be a non-empty string",
    });
  } else if (!isValidMoneroAddress(input.primaryAddress.trim())) {
    issues.push({
      path: ["primaryAddress"],
      message: "Invalid Monero address format",
    });
  }

  // Check secretViewKey
  if (
    typeof input.secretViewKey !== "string" ||
    input.secretViewKey.trim().length === 0
  ) {
    issues.push({
      path: ["secretViewKey"],
      message: "Secret view key is required and must be a non-empty string",
    });
  } else if (!isValidMoneroPrivateKey(input.secretViewKey.trim())) {
    issues.push({
      path: ["secretViewKey"],
      message: "Invalid secret view key format (must be 64 hex characters)",
    });
  }

  if (issues.length > 0) {
    return { success: false, error: { issues } };
  }

  return { success: true };
}

function isValidMoneroAddress(address: string): boolean {
  // Basic validation
  return (
    address.length >= 95 && address.length <= 106 && isAlphaNumeric(address)
  );
}

function isValidMoneroPrivateKey(key: string): boolean {
  return key.length === 64 && isAlphaNumeric(key);
}

function isAlphaNumeric(str: string) {
  return str.match(/^[a-z0-9]+$/i) !== null;
}

export type NodeUrlFormInput = {
  nodeurl: string;
  start_height: number | null | "";
  merchant_confirmations: number | null | "";
};

export async function updateNodeUrlRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;

  try {
    const body = (await req.json()) as NodeUrlFormInput;

    const issues: { path: string[]; message: string }[] = [];

    if (typeof body.nodeurl !== "string" || body.nodeurl.trim().length === 0) {
      issues.push({
        path: ["nodeurl"],
        message: "Node URL is required and must be a non-empty string",
      });
    }
    if (body.start_height === "") body.start_height = null;
    if (
      body.start_height !== null &&
      (typeof body.start_height !== "number" || body.start_height < 0)
    ) {
      issues.push({
        path: ["start_height"],
        message: "Start height must be a non-negative number or null",
      });
    }
    if (body.merchant_confirmations === "") body.merchant_confirmations = null;
    if (
      body.merchant_confirmations !== null &&
      (typeof body.merchant_confirmations !== "number" ||
        body.merchant_confirmations < 0)
    ) {
      issues.push({
        path: ["merchant_confirmations"],
        message: "Confirmations must be a non-negative number or null",
      });
    }

    if (issues.length > 0) {
      return Response.json({ success: false, error: { issues } });
    }

    await writeNodeUrlToScanSettings(body.nodeurl.trim(), SCAN_SETTINGS_PATH);

    await writeStartHeightToScanSettings(body.start_height, SCAN_SETTINGS_PATH);

    await writeMerchantConfirmationsToScanSettings(
      body.merchant_confirmations,
      SCAN_SETTINGS_PATH,
    );

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error updating node URL:", error);
    return Response.json({
      success: false,
      error: { issues: [{ path: [], message: "Invalid JSON" }] },
    });
  }
}
