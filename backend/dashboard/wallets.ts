import { has, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { wallets, WalletSchema } from "../../db/schema";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";

export function editWalletEndpoint(mini: Mini<Loggedin>) {
  console.log(mini.form.formJson);
  const result = WalletSchema.safeParse(mini.form.formJson);
  if (result.data) {
    const insertedRow = db
      .insert(wallets)
      .values(result.data)
      .returning()
      .get();
    return mini.json`${insertedRow}`;
  }
  return mini.json`${result}`;
}
export function deleteWalletEndpoint(mini: Mini<Loggedin>) {
  if (
    has(mini.form.formJson, "walletId") &&
    typeof mini.form.formJson.walletId === "number"
  ) {
    db.delete(wallets).where(eq(wallets.id, mini.form.formJson.walletId)).run();
  }
  return mini.json`{"success": true}`;
}
