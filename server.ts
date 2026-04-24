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
} from "./dashboard/backend/wallets";
import { dashBoardRoute, dashboardSkeleton } from "./dashboard/dashboard";
import {
  adminLoginGet,
  adminLoginPost,
  loginSkeleton,
} from "./dashboard/login";
export function makeRoutes() {
  const routes = {
    ...dashboardSkeleton.static_routes,
    ...loginSkeleton.static_routes,
    "/login": {
      GET: adminLoginGet,
      POST: adminLoginPost,
    },
    "/dashboard": {
      GET: dashBoardRoute,
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
  };
  return routes;
}

const server = Bun.serve({
  port: 3003,
  routes: { ...makeRoutes(), ...makeCheckoutRoutes() },
});

globalThis.minireload = () => {
  server.reload({
    routes: makeRoutes(),
    port: 3003,
  });
};

console.log("Server running at http://localhost:3003");
