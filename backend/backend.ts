import { url, head, commonHead, cssReset } from "@spirobel/mininext";
import { LoginCheck } from "./users/loginLogout";
import { dashBoardIndex } from "./dashboard";
head((mini) => mini.html`<title>Monero Payment Links</title>${commonHead}`);
url.set("/", LoginCheck(dashBoardIndex));

export default url.install;
