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
  CREATE TABLE IF NOT EXISTS payment_links (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    productTitle TEXT,
    productDescription TEXT,
    invoiceTitle TEXT,
    invoiceDescription TEXT,
    amount TEXT,
    wallet_primary_address TEXT,
    dueDate TEXT,
    maxUses INTEGER,
    currentUses INTEGER,
    successUrl TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    linkType TEXT DEFAULT 'product' CHECK (linkType IN ('product', 'invoice')),
    timestamp TEXT DEFAULT CURRENT_TIMESTAMP
  );
`.execute();

type AdminSessionCookieRow = {
  id: number;
  cookie: string;
  timestamp: string;
};

type PaymentLinkRow = {
  id: number;
  productTitle: string | null;
  productDescription: string | null;
  invoiceTitle: string | null;
  invoiceDescription: string | null;
  amount: string;
  wallet_primary_address: string;
  dueDate: string | null;
  maxUses: number | null;
  currentUses: number;
  successUrl: string | null;
  status: "active" | "inactive";
  linkType: "product" | "invoice";
  timestamp: string;
};

type InsertIdRow = {
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

export function insertPaymentLink(data: {
  productTitle?: string | null;
  productDescription?: string | null;
  invoiceTitle?: string | null;
  invoiceDescription?: string | null;
  amount: string;
  wallet_primary_address: string;
  dueDate?: string | null;
  maxUses?: number | null;
  successUrl?: string | null;
  linkType?: "product" | "invoice";
}): SQL.Query<InsertIdRow[]> {
  return sql`
    INSERT INTO payment_links (
      productTitle, productDescription, 
      invoiceTitle, invoiceDescription,
      amount, wallet_primary_address, dueDate, 
      maxUses, currentUses, successUrl, 
      linkType
    ) VALUES (
      ${data.productTitle}, ${data.productDescription},
      ${data.invoiceTitle}, ${data.invoiceDescription},
      ${data.amount}, ${data.wallet_primary_address}, ${data.dueDate},
      ${data.maxUses || null}, 0, ${data.successUrl},
      ${data.linkType || "product"}
    )
    RETURNING id
  `.execute();
}

export function getPaymentLinkById(id: number): SQL.Query<PaymentLinkRow[]> {
  return sql`
    SELECT * FROM payment_links 
    WHERE id = ${id}
  `.execute();
}

export function getActivePaymentLinks(): SQL.Query<PaymentLinkRow[]> {
  return sql`
    SELECT * FROM payment_links 
    WHERE status = 'active'
  `.execute();
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
