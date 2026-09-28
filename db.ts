import { SQL } from "bun";

const sql = new SQL({
  adapter: "sqlite",
  filename: "monero_payments.db",
  create: true,
});
await sql`PRAGMA journal_mode = WAL`;

await sql`
  CREATE TABLE IF NOT EXISTS admin_session_cookies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cookie TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`.execute();

await sql`
CREATE TABLE IF NOT EXISTS product_payment_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_link_id TEXT NOT NULL UNIQUE,
    productTitle TEXT,
    productDescription TEXT,
    amount TEXT,
    currency TEXT DEFAULT 'XMR',
    amountFiat TEXT,
    wallet_primary_address TEXT,
    maxUses INTEGER,
    currentUses INTEGER DEFAULT 0,
    successUrl TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`.execute();

await sql`
CREATE TABLE IF NOT EXISTS invoice_payment_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    payment_link_id TEXT NOT NULL UNIQUE,
    invoiceTitle TEXT,
    invoiceDescription TEXT,
    amount TEXT,
    currency TEXT DEFAULT 'XMR',
    amountFiat TEXT,
    wallet_primary_address TEXT,
    dueDate TEXT,
    currentUses INTEGER DEFAULT 0,
    successUrl TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`.execute();

export type AdminSessionCookieRow = {
  id: number;
  cookie: string;
  timestamp: string;
};

export type ProductPaymentLinkRow = {
  id: number;
  payment_link_id: string;
  productTitle: string | null;
  productDescription: string | null;
  amount: string;
  currency: string | null;
  amountFiat: string | null;
  wallet_primary_address: string;
  maxUses: number | null;
  currentUses: number;
  successUrl: string | null;
  timestamp: string;
};

export type InvoicePaymentLinkRow = {
  id: number;
  payment_link_id: string;
  invoiceTitle: string | null;
  invoiceDescription: string | null;
  amount: string;
  currency: string | null;
  amountFiat: string | null;
  wallet_primary_address: string;
  dueDate: string | null;
  currentUses: number;
  successUrl: string | null;
  timestamp: string;
};

export type InsertIdRow = {
  id: number;
};

export function insertAdminSessionCookie(
  cookie: string,
): SQL.Query<InsertIdRow[]> {
  return sql`
    INSERT INTO admin_session_cookies (cookie)
    VALUES (${cookie})
    RETURNING id
  `.execute();
}

export function getSessionCookieById(
  id: number,
): SQL.Query<AdminSessionCookieRow> {
  return sql`
    SELECT * FROM admin_session_cookies 
    WHERE id = ${id}
  `.execute();
}

export function getSessionCookieByValue(
  cookie: string,
): SQL.Query<AdminSessionCookieRow[]> {
  return sql`
    SELECT * FROM admin_session_cookies 
    WHERE cookie = ${cookie}
  `.execute();
}

export function insertProductPaymentLink(data: {
  productTitle?: string | null;
  productDescription?: string | null;
  amount: string;
  wallet_primary_address: string;
  maxUses?: number | null;
  successUrl?: string | null;
  paymentLinkId?: string;
}): SQL.Query<InsertIdRow[]> {
  const paymentLinkId = data.paymentLinkId ?? crypto.randomUUID();

  return sql`
    INSERT INTO product_payment_links (
      payment_link_id,
      productTitle, productDescription,
      amount, wallet_primary_address,
      maxUses, currentUses, successUrl
    ) VALUES (
      ${paymentLinkId},
      ${data.productTitle}, ${data.productDescription},
      ${data.amount}, ${data.wallet_primary_address},
      ${data.maxUses || null}, 0, ${data.successUrl}
    )
    RETURNING id
  `.execute();
}

export function insertInvoicePaymentLink(data: {
  invoiceTitle?: string | null;
  invoiceDescription?: string | null;
  amount: string;
  wallet_primary_address: string;
  dueDate?: string | null;
  successUrl?: string | null;
  paymentLinkId?: string;
}): SQL.Query<InsertIdRow[]> {
  const paymentLinkId = data.paymentLinkId ?? crypto.randomUUID();

  return sql`
    INSERT INTO invoice_payment_links (
      payment_link_id,
      invoiceTitle, invoiceDescription,
      amount, wallet_primary_address, dueDate,
      currentUses, successUrl
    ) VALUES (
      ${paymentLinkId},
      ${data.invoiceTitle}, ${data.invoiceDescription},
      ${data.amount}, ${data.wallet_primary_address}, ${data.dueDate},
      0, ${data.successUrl}
    )
    RETURNING id
  `.execute();
}

export type CombinedPaymentLinkRow = {
  id: number;
  payment_link_id: string;
  title: string | null; // productTitle or invoiceTitle
  description: string | null; // productDescription or invoiceDescription
  amount: string;
  currency: string | null;
  amountFiat: string | null;
  wallet_primary_address: string;
  dueDate: string | null; // only for invoice
  maxUses: number | null;
  currentUses: number;
  successUrl: string | null;
  linkType: "product" | "invoice";
  timestamp: string;
};

export function getPaymentLinkByPaymentLinkId(
  paymentLinkId: string,
): SQL.Query<CombinedPaymentLinkRow[]> {
  return sql`
    SELECT 
      id,
      payment_link_id,
      productTitle AS title,
      productDescription AS description,
      amount,
      currency,
      amountFiat,
      wallet_primary_address,
      NULL AS dueDate,
      maxUses,
      currentUses,
      successUrl,
      'product' AS linkType,
      timestamp
    FROM product_payment_links 
    WHERE payment_link_id = ${paymentLinkId}

    UNION ALL

    SELECT 
      id,
      payment_link_id,
      invoiceTitle AS title,
      invoiceDescription AS description,
      amount,
      currency,
      amountFiat,
      wallet_primary_address,
      dueDate,
      NULL AS maxUses,
      currentUses,
      successUrl,
      'invoice' AS linkType,
      timestamp
    FROM invoice_payment_links 
    WHERE payment_link_id = ${paymentLinkId}
  `.execute();
}

export function getAllPaymentLinks(): SQL.Query<CombinedPaymentLinkRow[]> {
  return sql`
    SELECT
      id,
      payment_link_id,
      productTitle AS title,
      productDescription AS description,
      amount,
      currency,
      amountFiat,
      wallet_primary_address,
      NULL AS dueDate,
      maxUses,
      currentUses,
      successUrl,
      'product' AS linkType,
      timestamp
    FROM product_payment_links

    UNION ALL

    SELECT
      id,
      payment_link_id,
      invoiceTitle AS title,
      invoiceDescription AS description,
      amount,
      currency,
      amountFiat,
      wallet_primary_address,
      dueDate,
      NULL AS maxUses,
      currentUses,
      successUrl,
      'invoice' AS linkType,
      timestamp
    FROM invoice_payment_links

    ORDER BY timestamp DESC
  `.execute();
}
export function upsertPaymentLink(data: {
  paymentLinkId: string;
  linkType: "product" | "invoice";
  amount: string;
  currency?: string | null;
  amountFiat?: string | null;
  wallet_primary_address: string;
  maxUses?: number | null;
  successUrl?: string | null;
  // product only
  productTitle?: string | null;
  productDescription?: string | null;
  // invoice only
  invoiceTitle?: string | null;
  invoiceDescription?: string | null;
  dueDate?: string | null;
}): SQL.Query<InsertIdRow[]> {
  const currency = data.currency ?? "XMR";
  const amountFiat = data.amountFiat ?? null;
  if (data.linkType === "product") {
    return sql`
      INSERT INTO product_payment_links (
        payment_link_id, productTitle, productDescription,
        amount, currency, amountFiat, wallet_primary_address,
        maxUses, currentUses, successUrl
      ) VALUES (
        ${data.paymentLinkId},
        ${data.productTitle}, ${data.productDescription},
        ${data.amount}, ${currency}, ${amountFiat}, ${data.wallet_primary_address},
        ${data.maxUses || null}, 0, ${data.successUrl}
      )
      ON CONFLICT(payment_link_id) DO UPDATE SET
        productTitle = excluded.productTitle,
        productDescription = excluded.productDescription,
        amount = excluded.amount,
        currency = excluded.currency,
        amountFiat = excluded.amountFiat,
        wallet_primary_address = excluded.wallet_primary_address,
        maxUses = excluded.maxUses,
        successUrl = excluded.successUrl
      RETURNING id
    `.execute();
  } else {
    return sql`
      INSERT INTO invoice_payment_links (
        payment_link_id, invoiceTitle, invoiceDescription,
        amount, currency, amountFiat, wallet_primary_address, dueDate,
        currentUses, successUrl
      ) VALUES (
        ${data.paymentLinkId},
        ${data.invoiceTitle}, ${data.invoiceDescription},
        ${data.amount}, ${currency}, ${amountFiat}, ${data.wallet_primary_address}, ${data.dueDate},
        0, ${data.successUrl}
      )
      ON CONFLICT(payment_link_id) DO UPDATE SET
        invoiceTitle = excluded.invoiceTitle,
        invoiceDescription = excluded.invoiceDescription,
        amount = excluded.amount,
        currency = excluded.currency,
        amountFiat = excluded.amountFiat,
        wallet_primary_address = excluded.wallet_primary_address,
        dueDate = excluded.dueDate,
        successUrl = excluded.successUrl
      RETURNING id
    `.execute();
  }
}

export function deleteProductPaymentLink(paymentLinkId: string): SQL.Query<{}> {
  return sql`
    DELETE FROM product_payment_links
    WHERE payment_link_id = ${paymentLinkId}
  `.execute();
}

export function deleteInvoicePaymentLink(paymentLinkId: string): SQL.Query<{}> {
  return sql`
    DELETE FROM invoice_payment_links
    WHERE payment_link_id = ${paymentLinkId}
  `.execute();
}

export function deletePaymentLink(
  paymentLinkId: string,
  linkType: "product" | "invoice",
): SQL.Query<{}> {
  if (linkType === "product") {
    return deleteProductPaymentLink(paymentLinkId);
  } else {
    return deleteInvoicePaymentLink(paymentLinkId);
  }
}

export function deleteCheckoutSessionsByPaymentLinkId(
  paymentLinkId: string,
): SQL.Query<{}> {
  return sql`
    DELETE FROM checkout_session
    WHERE payment_link_id = ${paymentLinkId}
  `.execute();
}

export async function incrementPaymentLinkUses(payment_link_id: string) {
  await sql`
    UPDATE product_payment_links
    SET currentUses = currentUses + 1
    WHERE payment_link_id = ${payment_link_id}
  `.execute();
  await sql`
    UPDATE invoice_payment_links
    SET currentUses = currentUses + 1
    WHERE payment_link_id = ${payment_link_id}
  `.execute();
}

await sql`
CREATE TABLE IF NOT EXISTS checkout_session (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount TEXT NOT NULL,
    session_id TEXT NOT NULL,
    address TEXT,
    paid_status INTEGER NOT NULL DEFAULT 0,
    required_confirmations INTEGER NOT NULL DEFAULT 10,
    tx_confirmations INTEGER NOT NULL DEFAULT 0,
    tx_hash TEXT,
    payment_link_id TEXT,
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`.execute();

export type CheckoutSessionRow = {
  id: number;
  amount: string;
  session_id: string;
  address: string | null;
  paid_status: number;
  required_confirmations: number;
  tx_confirmations: number;
  tx_hash: string | null;
  payment_link_id: string | null;
  timestamp: string;
};

export function getCheckoutSessionByPrimaryId(
  id: number,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    SELECT * FROM checkout_session
    WHERE id = ${id}
  `.execute();
}
export function createCheckoutSession(
  amount: string,
  session_id: string,
  required_confirmations: number = 10,
  payment_link_id?: string | null,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    INSERT INTO checkout_session (amount, session_id, paid_status, required_confirmations, payment_link_id)
    VALUES (${amount}, ${session_id}, 0, ${required_confirmations}, ${payment_link_id ?? null})
    RETURNING *
  `.execute();
}

export function updateCheckoutSessionAddress(
  session_id: string,
  address: string,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    UPDATE checkout_session
    SET address = ${address}
    WHERE session_id = ${session_id}
  `.execute();
}

export function updateCheckoutSessionPaid(
  session_id: string,
  paid_status: number,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    UPDATE checkout_session
    SET paid_status = ${paid_status}
    WHERE session_id = ${session_id}
  `.execute();
}

export function updateTxConfirmations(
  id: number,
  tx_confirmations: number,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    UPDATE checkout_session
    SET tx_confirmations = ${tx_confirmations}
    WHERE id = ${id}
  `.execute();
}

export function updateTxHash(
  id: number,
  tx_hash: string,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    UPDATE checkout_session
    SET tx_hash = ${tx_hash}
    WHERE id = ${id}
  `.execute();
}

export function markAsPaid(id: number): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    UPDATE checkout_session
    SET paid_status = 1
    WHERE id = ${id}
  `.execute();
}
export function getCheckoutSessionBySessionId(
  session_id: string,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    SELECT * FROM checkout_session
    WHERE session_id = ${session_id}
  `.execute();
}

export function getCheckoutSessionByAddress(
  address: string,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    SELECT * FROM checkout_session
    WHERE address = ${address}
  `.execute();
}

export function getAllCheckoutSessions(): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    SELECT * FROM checkout_session
    ORDER BY timestamp DESC
  `.execute();
}

export function getAllSuccessfulCheckoutSessions(): SQL.Query<
  CheckoutSessionRow[]
> {
  return sql`
    SELECT * FROM checkout_session
    WHERE paid_status = 1
      AND payment_link_id IS NOT NULL
    ORDER BY timestamp DESC
  `.execute();
}

export function getPaidCheckoutSessionByPaymentLinkId(
  paymentLinkId: string,
): SQL.Query<CheckoutSessionRow[]> {
  return sql`
    SELECT * FROM checkout_session
    WHERE paid_status = 1
      AND payment_link_id = ${paymentLinkId}
    ORDER BY timestamp DESC
    LIMIT 1
  `.execute();
}
