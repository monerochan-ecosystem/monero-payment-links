import { html } from "@spirobel/mininext";
import { checkAdminAndRedirect } from "./login";
import { mainStyles } from "./styles/common";

export const dashboardSkeleton = await html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Admin Dashboard - Monero Payment Links</title>
    </head>
    <body>
      ${mainStyles}
      <script type="module" src="./frontend_main.ts"></script>
      <div id="container"></div>
    </body>
  </html> `.build();
export async function dashBoardRoute(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req);
  if (adminRedirect) return adminRedirect;
  return new Response(dashboardSkeleton.fill());
}
