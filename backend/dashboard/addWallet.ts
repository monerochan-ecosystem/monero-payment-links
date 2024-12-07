import type { Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { wallets, WalletSchema } from "../../db/schema";
import { db } from "../../db/db";

export function addWalletEndpoint(mini: Mini<Loggedin>) {
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
