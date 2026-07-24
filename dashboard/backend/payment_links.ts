import { checkAdminAndRedirect } from "../login";
import {
  deleteCheckoutSessionsByPaymentLinkId,
  deletePaymentLink,
  upsertPaymentLink,
} from "../../db";
import { readScanSettings } from "@spirobel/monero-wallet-api";
import { SCAN_SETTINGS_PATH } from "./wallets";
export async function editPaymentLinkRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;

  try {
    const body = await req.json();

    // Validate required fields
    const errors: any[] = [];

    // paymentLinkId is optional; will be auto-generated if not provided
    if (!body.amount || body.amount.trim() === "") {
      errors.push({ path: ["amount"], message: "Amount is required" });
    } else if (!(Number(body.amount) > 0)) {
      errors.push({
        path: ["amount"],
        message: "Amount must be a positive number",
      });
    }
    if (!body.walletId) {
      errors.push({ path: ["walletId"], message: "Wallet is required" });
    }
    if (!body.linkType || !["product", "invoice"].includes(body.linkType)) {
      errors.push({
        path: ["linkType"],
        message: "Link type must be 'product' or 'invoice'",
      });
    }
    if (body.linkType === "product" && !body.productTitle) {
      errors.push({
        path: ["productTitle"],
        message: "Product title is required",
      });
    }
    if (body.linkType === "invoice" && !body.invoiceTitle) {
      errors.push({
        path: ["invoiceTitle"],
        message: "Invoice title is required",
      });
    }
    const currency = String(body.currency ?? "XMR").toUpperCase();
    if (currency !== "XMR" && currency !== "USD") {
      errors.push({
        path: ["currency"],
        message: "Currency must be XMR or USD",
      });
    }

    if (errors.length > 0) {
      return Response.json({
        success: false,
        error: { issues: errors },
      });
    }

    // Generate payment link ID if not provided
    const paymentLinkId = body.paymentLinkId || crypto.randomUUID();

    // Get wallet primary address from scan settings
    const scanSettings = await readScanSettings(SCAN_SETTINGS_PATH);
    const wallet = scanSettings?.wallets?.find(
      (w: any) => w.primary_address === body.walletId,
    );
    if (!wallet) {
      return Response.json({
        success: false,
        error: {
          issues: [{ path: ["walletId"], message: "Wallet not found" }],
        },
      });
    }

    await upsertPaymentLink({
      paymentLinkId: paymentLinkId,
      linkType: body.linkType as "product" | "invoice",
      amount: body.amount.trim(),
      currency,
      amountFiat: currency === "USD" ? body.amount.trim() : null,
      wallet_primary_address: wallet.primary_address,
      maxUses: body.linkType === "product" ? body.maxUses || null : undefined,
      successUrl: body.successUrl || null,
      productTitle:
        body.linkType === "product" ? body.productTitle || null : undefined,
      productDescription:
        body.linkType === "product"
          ? body.productDescription || null
          : undefined,
      invoiceTitle:
        body.linkType === "invoice" ? body.invoiceTitle || null : undefined,
      invoiceDescription:
        body.linkType === "invoice"
          ? body.invoiceDescription || null
          : undefined,
      dueDate: body.linkType === "invoice" ? body.dueDate || null : undefined,
    });

    return Response.json({
      success: true,
      paymentLinkId: paymentLinkId,
    });
  } catch (error) {
    console.error("Error saving payment link:", error);
    return Response.json({
      success: false,
      error: {
        issues: [
          { path: ["_form"], message: "An error occurred while saving" },
        ],
      },
    });
  }
}

export async function deletePaymentLinkRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;

  try {
    const body = await req.json();

    // Validate required fields
    if (
      typeof body.paymentLinkId !== "string" ||
      body.paymentLinkId.trim().length === 0
    ) {
      return Response.json({
        success: false,
        error: {
          issues: [
            {
              path: ["paymentLinkId"],
              message: "Payment link ID is required",
            },
          ],
        },
      });
    }

    if (!body.linkType || !["product", "invoice"].includes(body.linkType)) {
      return Response.json({
        success: false,
        error: {
          issues: [
            {
              path: ["linkType"],
              message: "Link type must be 'product' or 'invoice'",
            },
          ],
        },
      });
    }

    await deleteCheckoutSessionsByPaymentLinkId(body.paymentLinkId);
    await deletePaymentLink(body.paymentLinkId, body.linkType);

    return Response.json({ success: true });
  } catch (error) {
    console.error("Error deleting payment link:", error);
    return Response.json({
      success: false,
      error: {
        issues: [
          {
            path: ["_form"],
            message: "An error occurred while deleting",
          },
        ],
      },
    });
  }
}
