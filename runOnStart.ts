async function checkIfEnv() {
  if (!Bun.env.ADMIN_SECRET) {
    const secret = crypto.randomUUID();
    await Bun.write("./.env", `ADMIN_SECRET = ${secret}\n`);
    Bun.env.ADMIN_SECRET = secret;
  }
}
/**
 *
 */
export default async function runOnStart() {
  await checkIfEnv();
}
