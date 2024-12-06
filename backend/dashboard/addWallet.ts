import type { Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { WalletSchema } from "../../db/schema";

export function addWalletEndpoint(mini: Mini<Loggedin>) {
  console.log(mini.form.formJson);
  const result = WalletSchema.safeParse(mini.form.formJson);
  if (result.data) {
  }
  return mini.json`${result}`;
}
