import { url, head, commonHead, cssReset } from "@spirobel/mininext";
import { LoginCheck, LoginCheckPostJson } from "./users/loginLogout";
import { dashBoardIndex } from "./dashboard";
import { deleteWalletEndpoint, editWalletEndpoint } from "./dashboard/wallets";
import { paymentLinks } from "./dashboard/paymentLinks";
head((mini) => mini.html`<title>Monero Payment Links</title>${commonHead}`);
url.set("wallets", LoginCheck(dashBoardIndex));
url.set("editWallet", LoginCheckPostJson(editWalletEndpoint));
url.set("deleteWallet", LoginCheckPostJson(deleteWalletEndpoint));

url.set("payment-links", LoginCheck(paymentLinks));

export default url.install;
