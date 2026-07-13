import { makeCheckoutRoutes } from "./checkout";
import {
  editPaymentLinkRoute,
  deletePaymentLinkRoute,
} from "./dashboard/backend/payment_links";
import {
  editWalletRoute,
  deleteWalletRoute,
  shareViewKeyRoute,
  updateNodeUrlRoute,
  updateThemeRoute,
} from "./dashboard/backend/wallets";
import { dashBoardRoute, dashboardSkeleton } from "./dashboard/dashboard";
import {
  adminLoginGet,
  adminLoginPost,
  loginSkeleton,
  getCookieValue,
  checkLoggedin,
} from "./dashboard/login";
import { serializeWallets, setServer, WS_TOPIC } from "./ws";
import { getWallets } from "./dashboard/backend/wallets";
import type { Server, ServerWebSocket } from "bun";
export function makeRoutes() {
  const routes = {
    ...dashboardSkeleton.static_routes,
    ...loginSkeleton.static_routes,
    ...makeCheckoutRoutes(),
    "/login": {
      GET: adminLoginGet,
      POST: adminLoginPost,
    },
    "/dashboard": {
      GET: dashBoardRoute,
    },
    "/ws": {
      GET: async (req: Request, server: Server<undefined>) => {
        const adminCookie = getCookieValue(req, "admin_session");
        if (!(await checkLoggedin(adminCookie))) {
          return new Response("unauthorized", { status: 401 });
        }
        if (server.upgrade(req)) {
          return;
        }
        return new Response("upgrade failed", { status: 500 });
      },
    },
    "/editPaymentLink": {
      POST: editPaymentLinkRoute,
    },
    "/deletePaymentLink": {
      POST: deletePaymentLinkRoute,
    },
    "/editWallet": {
      POST: editWalletRoute,
    },
    "/deleteWallet": {
      POST: deleteWalletRoute,
    },
    "/monerochan002/": {
      POST: shareViewKeyRoute,
    },
    "/updateNodeUrl": {
      POST: updateNodeUrlRoute,
    },
    "/updateTheme": {
      POST: updateThemeRoute,
    },
  };
  return routes;
}

const websocket = {
  open(ws: ServerWebSocket) {
    ws.subscribe(WS_TOPIC);
    ws.send(JSON.stringify(serializeWallets(getWallets())));
  },
  close(ws: ServerWebSocket) {
    ws.unsubscribe(WS_TOPIC);
  },
  message(_ws: ServerWebSocket, _message: string | Buffer) {
  },
};

const server = Bun.serve({
  port: 3003,
  routes: makeRoutes(),
  websocket,
});

setServer(server);

globalThis.minireload = () => {
  server.reload({
    routes: makeRoutes(),
    websocket,
  });
};

console.log("access dashboard at http://localhost:3003/dashboard");
