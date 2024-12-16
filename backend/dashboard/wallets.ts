import { has, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { wallets, WalletSchema } from "../../db/schema";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";

export function editWalletEndpoint(mini: Mini<Loggedin>) {
  console.log(mini.form.formJson);
  const result = WalletSchema.safeParse(mini.form.formJson);
  if (result.data) {
    if (
      !result.data.id &&
      (!result.data.primaryAddress || !result.data.secretViewKey)
    ) {
      return mini.json`{"success":false,
        "error":{"issues":[{
          "code":"id_or_primaryAdrress_plus_viewkey",
          "type":"string",
          "message":"if there is no id in the request, primary key and secretviewkey need to be set",
          "path":["primaryAddress"]}],"name":"logic error"}}`;
    }
    const insertedRow = db
      .insert(wallets)
      .values(result.data)
      .onConflictDoUpdate({ target: wallets.id, set: result.data })
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
