import { router } from "./frontend /dashboard_router";
import { html, renderRoot } from "@spirobel/mininext";
const container = document.getElementById("container");
if (!container) throw new Error("Could not find container element");
renderRoot({
  component: () =>
    html`<div style="height: 100%; width: 100%;">${router.component}</div>`,
  container,
});
