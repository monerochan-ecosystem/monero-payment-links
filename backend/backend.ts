import { url, head, commonHead, cssReset } from "@spirobel/mininext";
import { LoginCheck, LoginCheckPostJson } from "./users/loginLogout";
import { dashBoardIndex } from "./dashboard";
import { deleteWalletEndpoint, editWalletEndpoint } from "./dashboard/wallets";
import { paymentLinksEndpoint } from "./dashboard/paymentLinks";
import { transactions } from "./dashboard/transactions";
import {
  deletePaymentLinkEndpoint,
  editPaymentLinkEndpoint,
} from "./dashboard/editPaymentLinks";
head((mini) => mini.html`<title>Monero Payment Links</title>${commonHead}`);
url.set("wallets", LoginCheck(dashBoardIndex));
url.set("editWallet", LoginCheckPostJson(editWalletEndpoint));
url.set("deleteWallet", LoginCheckPostJson(deleteWalletEndpoint));

url.set("transactions", LoginCheck(transactions));
url.set("payment-links", LoginCheck(paymentLinksEndpoint));

url.set("editPaymentLink", LoginCheckPostJson(editPaymentLinkEndpoint));
url.set("deletePaymentLink", LoginCheckPostJson(deletePaymentLinkEndpoint));

export default url.install;
