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
//import { mkdir } from "node:fs/promises";
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
    // debug: dump coordinator + cpu worker heaps while scanning
    // "/debug/heap-dumps": {
    //   GET: async () => {
    //     const wallets = getWallets();
    //     if (!wallets) {
    //       return Response.json({ error: "no wallets open" }, { status: 503 });
    //     }
    //     if (typeof (wallets as any).dumpWorkerHeaps !== "function") {
    //       return Response.json(
    //         { error: "dumpWorkerHeaps missing; rebuild monero-wallet-api" },
    //         { status: 500 },
    //       );
    //     }
    //     const dir = `${process.cwd()}/heap-dumps`;
    //     await mkdir(dir, { recursive: true });
    //     try {
    //       const paths = await (wallets as any).dumpWorkerHeaps(dir);
    //       return Response.json({ dir, paths });
    //     } catch (err) {
    //       return Response.json(
    //         {
    //           error: err instanceof Error ? err.message : String(err),
    //         },
    //         { status: 500 },
    //       );
    //     }
    //   },
    // },
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
