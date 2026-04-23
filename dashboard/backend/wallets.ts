import {
  writeViewKeyToDotEnv,
  writeScanSettingsFileDefaultLocation,
  handle002ShareRequest,
  readWalletsFromScanSettings,
} from "@spirobel/monero-wallet-api";
import { checkAdminAndRedirect } from "../login";
export async function saveWallet(
  primary_address: string,
  view_key: string,
  wallet_name: string,
  wallet_slot?: number,
  originalPrimaryAddress?: string,
) {
  primary_address = primary_address.trim();
  view_key = view_key.trim();

  // If the primary address changed, remove the old wallet first
  if (originalPrimaryAddress && originalPrimaryAddress !== primary_address) {
    await writeScanSettingsFileDefaultLocation({
      writeCallback: async (settings) => {
        settings.wallets = settings.wallets.filter(
          (w: any) => w.primary_address !== originalPrimaryAddress,
        );
      },
    });
  }

  await writeViewKeyToDotEnv(primary_address, view_key);
  await writeScanSettingsFileDefaultLocation({
    writeCallback: async (settings) => {
      const existingWallet = settings.wallets.find(
        (w: any) => w.primary_address === primary_address,
      );
      if (existingWallet) {
        existingWallet.wallet_name = wallet_name;
        existingWallet.wallet_slot = wallet_slot;
      } else {
        settings.wallets.push({ primary_address, wallet_name, wallet_slot });
      }
    },
  });
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
    return Response.json({
      success: false,
      error: { issues: [{ path: [], message: "Invalid JSON" }] },
    });
  }
}

export async function shareViewKeyRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  //if slot already exists we  make sure primary address & vk is the same
  const wallets = await readWalletsFromScanSettings();
  const res = await handle002ShareRequest(
    req,
    wallets,
    async ({ primary_address, viewkey, wallet_slot }) =>
      await saveWallet(
        primary_address.trim(),
        viewkey.trim(),
        "unnamed wallet " + wallet_slot,
        wallet_slot,
      ),
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
    await writeScanSettingsFileDefaultLocation({
      writeCallback: async (settings) => {
        settings.wallets = settings.wallets.filter(
          (w: any) => w.primary_address !== body.primaryAddress,
        );
      },
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error parsing delete wallet request:", error);
    return Response.json({
      success: false,
      error: { issues: [{ path: [], message: "Invalid JSON" }] },
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
