import { has, type Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { paymentLinks, PaymentLinkSchema } from "../../db/schema";
import { db } from "../../db/db";
import { eq } from "drizzle-orm";

export function editPaymentLinkEndpoint(mini: Mini<Loggedin>) {
  console.log(mini.form.formJson);
  const result = PaymentLinkSchema.safeParse(mini.form.formJson);
  if (result.data) {
    if (!result.data.id && !result.data.amount) {
      return mini.json`{"success":false,
        "error":{"issues":[{
          "code":"id_or_amount",
          "type":"string",
          "message":"if there is no id in the request, amount need to be set",
          "path":["primaryAddress"]}],"name":"logic error"}}`;
    }
    const insertedRow = db
      .insert(paymentLinks)
      .values(result.data)
      .onConflictDoUpdate({ target: paymentLinks.id, set: result.data })
      .returning()
      .get();
    return mini.json`${insertedRow}`;
  }
  return mini.json`${result}`;
}
export function deletePaymentLinkEndpoint(mini: Mini<Loggedin>) {
  if (
    has(mini.form.formJson, "paymentLinkId") &&
    typeof mini.form.formJson.paymentLinkId === "number"
  ) {
    db.delete(paymentLinks)
      .where(eq(paymentLinks.id, mini.form.formJson.paymentLinkId))
      .run();
  }
  return mini.json`{"success": true}`;
}
