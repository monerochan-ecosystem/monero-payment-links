import { url, head, commonHead, cssReset } from "@spirobel/mininext";
import { LoginCheck, LoginCheckPostJson } from "./users/loginLogout";
import { dashBoardIndex } from "./dashboard";
import { addWalletEndpoint } from "./dashboard/addWallet";
head((mini) => mini.html`<title>Monero Payment Links</title>${commonHead}`);
url.set("/", LoginCheck(dashBoardIndex));
url.set("addWallet", LoginCheckPostJson(addWalletEndpoint));

export default url.install;
