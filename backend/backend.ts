import { url, head, commonHead, cssReset } from "@spirobel/mininext";
import { LoginCheck } from "./users/loginLogout";
head((mini) => mini.html`<title>hello hello</title>${commonHead}`);
url.set(
  "/",
  LoginCheck((mini) => {
    return mini.html`<h1>Hello world</h1>`;
  })
);

export default url.install;
