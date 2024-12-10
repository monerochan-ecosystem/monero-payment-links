import { url, head, commonHead, cssReset } from "@spirobel/mininext";
import { LoginCheck, LoginCheckPostJson } from "./users/loginLogout";
import { dashBoardIndex } from "./dashboard";
import { deleteWalletEndpoint, editWalletEndpoint } from "./dashboard/wallets";
head((mini) => mini.html`<title>Monero Payment Links</title>${commonHead}`);
url.set("/", LoginCheck(dashBoardIndex));
url.set("editWallet", LoginCheckPostJson(editWalletEndpoint));
url.set("deleteWallet", LoginCheckPostJson(deleteWalletEndpoint));

export default url.install;
