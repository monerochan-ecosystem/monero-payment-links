import { writeEnvLineToDotEnvRefresh } from "@spirobel/monero-wallet-api";

async function ensureAdminSecret(): Promise<string> {
  const existing = Bun.env.ADMIN_SECRET;
  if (existing) return existing;

  const secret = crypto.randomUUID();
  await writeEnvLineToDotEnvRefresh("ADMIN_SECRET", secret);
  console.log("created ADMIN_SECRET in .env");
  return secret;
}

let adminSecret = Bun.env.ADMIN_SECRET;

export async function getAdminSecret(): Promise<string> {
  if (!adminSecret) {
    adminSecret = await ensureAdminSecret();
  }
  return adminSecret;
}
