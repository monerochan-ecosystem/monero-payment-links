export async function saveWallet(
  primary_address: string,
  view_key: string,
  wallet_name: string,
) {
  primary_address = primary_address.trim();
  view_key = view_key.trim();
  await writeViewKeyToDotEnv(primary_address, view_key);
  await writeWalletToScanSettings({
    primary_address,
    wallet_name,
  });
}

import {
  writeViewKeyToDotEnv,
  writeWalletToScanSettings,
} from "@spirobel/monero-wallet-api";
import { checkAdminAndRedirect } from "../login";

export type WalletFormInput = {
  walletName: string;
  primaryAddress: string;
  secretViewKey: string;
  id?: number;
};

export async function editWalletRoute(req: Request) {
  console.log(req);

  const adminRedirect = await checkAdminAndRedirect(req);
  console.log(adminRedirect);
  if (adminRedirect) return adminRedirect;
  console.log(req);
  try {
    const body = (await req.json()) as WalletFormInput;

    // Validate the input
    const validation = validateWalletInput(body);
    if (!validation.success) {
      return Response.json({ success: false, error: validation.error });
    }

    await saveWallet(body.primaryAddress, body.secretViewKey, body.walletName);
    return Response.json({ success: true });
  } catch (error) {
    console.error("Error parsing wallet request:", error);
    return Response.json({
      success: false,
      error: { issues: [{ path: [], message: "Invalid JSON" }] },
    });
  }
}

export async function deleteWalletRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;

  try {
    const body = await req.json();

    // Validate the input
    if (typeof body.walletId !== "number" || body.walletId <= 0) {
      return Response.json({
        success: false,
        error: {
          issues: [
            {
              path: ["walletId"],
              message: "walletId must be a positive number",
            },
          ],
        },
      });
    }

    // TODO: Implement the actual wallet deletion logic here
    // For now, just return success
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

  // Check id (optional, for updates)
  if (input.id !== undefined) {
    if (typeof input.id !== "number" || input.id <= 0) {
      issues.push({ path: ["id"], message: "ID must be a positive number" });
    }
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
