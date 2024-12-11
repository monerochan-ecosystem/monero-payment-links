import type { Mini } from "@spirobel/mininext";
import type { Loggedin } from "../users/loginLogout";
import { sidebar } from "./components/sidebar";
import { mainStyles } from ".";

export function paymentLinks(mini: Mini<Loggedin>) {
  return mini.html`${mainStyles}<div class="layout-container"> ${sidebar} hi payments</div>`;
}
