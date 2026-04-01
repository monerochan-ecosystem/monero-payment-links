async function ensureAdminSecret(): Promise<string> {
  const envPath = ".env";
  const envFile = Bun.file(envPath);

  if (!(await envFile.exists())) {
    const secret = crypto.randomUUID();
    await Bun.write(envPath, `ADMIN_SECRET=${secret}\n`);
    console.log("created .env with random ADMIN_SECRET");
    return secret;
  }
  throw new Error(".env already exists");
}

let adminSecret = Bun.env.ADMIN_SECRET;

export async function getAdminSecret(): Promise<string> {
  console.log("getAdminSecret", adminSecret);
  if (!adminSecret) {
    adminSecret = await ensureAdminSecret();
  }
  return adminSecret;
}
