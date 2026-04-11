import { SQL } from "bun";

const sql = new SQL({
  adapter: "sqlite",
  filename: "monero_payments.db",
  create: true,
});

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
    wallet_primary_address TEXT,
    maxUses INTEGER,
    currentUses INTEGER DEFAULT 0,
    successUrl TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
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
    wallet_primary_address TEXT,
    dueDate TEXT,
    maxUses INTEGER,
    currentUses INTEGER DEFAULT 0,
    successUrl TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
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
  wallet_primary_address: string;
  maxUses: number | null;
  currentUses: number;
  successUrl: string | null;
  status: "active" | "inactive";
  timestamp: string;
};

export type InvoicePaymentLinkRow = {
  id: number;
  payment_link_id: string;
  invoiceTitle: string | null;
  invoiceDescription: string | null;
  amount: string;
  wallet_primary_address: string;
  dueDate: string | null;
  maxUses: number | null;
  currentUses: number;
  successUrl: string | null;
  status: "active" | "inactive";
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
  maxUses?: number | null;
  successUrl?: string | null;
  paymentLinkId?: string;
}): SQL.Query<InsertIdRow[]> {
  const paymentLinkId = data.paymentLinkId ?? crypto.randomUUID();

  return sql`
    INSERT INTO invoice_payment_links (
      payment_link_id,
      invoiceTitle, invoiceDescription,
      amount, wallet_primary_address, dueDate,
      maxUses, currentUses, successUrl
    ) VALUES (
      ${paymentLinkId},
      ${data.invoiceTitle}, ${data.invoiceDescription},
      ${data.amount}, ${data.wallet_primary_address}, ${data.dueDate},
      ${data.maxUses || null}, 0, ${data.successUrl}
    )
    RETURNING id
  `.execute();
}

type CombinedPaymentLinkRow = {
  id: number;
  payment_link_id: string;
  title: string | null; // productTitle or invoiceTitle
  description: string | null; // productDescription or invoiceDescription
  amount: string;
  wallet_primary_address: string;
  dueDate: string | null; // only for invoice
  maxUses: number | null;
  currentUses: number;
  successUrl: string | null;
  status: "active" | "inactive";
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
      wallet_primary_address,
      NULL AS dueDate,
      maxUses,
      currentUses,
      successUrl,
      status,
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
      wallet_primary_address,
      dueDate,
      maxUses,
      currentUses,
      successUrl,
      status,
      'invoice' AS linkType,
      timestamp
    FROM invoice_payment_links 
    WHERE payment_link_id = ${paymentLinkId}
  `.execute();
}
export function getAllActivePaymentLinks(): SQL.Query<
  CombinedPaymentLinkRow[]
> {
  return sql`
    (SELECT 
      id,
      payment_link_id,
      productTitle AS title,
      productDescription AS description,
      amount,
      wallet_primary_address,
      NULL AS dueDate,
      maxUses,
      currentUses,
      successUrl,
      status,
      'product' AS linkType,
      timestamp
     FROM product_payment_links 
     WHERE status = 'active')
    
    UNION ALL
    
    (SELECT 
      id,
      payment_link_id,
      invoiceTitle AS title,
      invoiceDescription AS description,
      amount,
      wallet_primary_address,
      dueDate,
      maxUses,
      currentUses,
      successUrl,
      status,
      'invoice' AS linkType,
      timestamp
     FROM invoice_payment_links 
     WHERE status = 'active')
    
    ORDER BY timestamp DESC
  `.execute();
}
export function upsertPaymentLink(data: {
  paymentLinkId: string;
  linkType: "product" | "invoice";
  amount: string;
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
  if (data.linkType === "product") {
    return sql`
      INSERT INTO product_payment_links (
        payment_link_id, productTitle, productDescription,
        amount, wallet_primary_address,
        maxUses, currentUses, successUrl
      ) VALUES (
        ${data.paymentLinkId},
        ${data.productTitle}, ${data.productDescription},
        ${data.amount}, ${data.wallet_primary_address},
        ${data.maxUses || null}, 0, ${data.successUrl}
      )
      ON CONFLICT(payment_link_id) DO UPDATE SET
        productTitle = excluded.productTitle,
        productDescription = excluded.productDescription,
        amount = excluded.amount,
        wallet_primary_address = excluded.wallet_primary_address,
        maxUses = excluded.maxUses,
        successUrl = excluded.successUrl
      RETURNING id
    `.execute();
  } else {
    return sql`
      INSERT INTO invoice_payment_links (
        payment_link_id, invoiceTitle, invoiceDescription,
        amount, wallet_primary_address, dueDate,
        maxUses, currentUses, successUrl
      ) VALUES (
        ${data.paymentLinkId},
        ${data.invoiceTitle}, ${data.invoiceDescription},
        ${data.amount}, ${data.wallet_primary_address}, ${data.dueDate},
        ${data.maxUses || null}, 0, ${data.successUrl}
      )
      ON CONFLICT(payment_link_id) DO UPDATE SET
        invoiceTitle = excluded.invoiceTitle,
        invoiceDescription = excluded.invoiceDescription,
        amount = excluded.amount,
        wallet_primary_address = excluded.wallet_primary_address,
        dueDate = excluded.dueDate,
        maxUses = excluded.maxUses,
        successUrl = excluded.successUrl
      RETURNING id
    `.execute();
  }
}

export function incrementPaymentLinkUses(id: number): SQL.Query<{}> {
  return sql`
    UPDATE payment_links 
    SET currentUses = currentUses + 1 
    WHERE id = ${id}
  `.execute();
}

export function checkAndDeactivateIfMaxUsesReached(id: number): SQL.Query<{}> {
  return sql`
    UPDATE payment_links 
    SET status = 'inactive'
    WHERE id = ${id} 
      AND maxUses IS NOT NULL 
      AND currentUses >= maxUses
  `.execute();
}
