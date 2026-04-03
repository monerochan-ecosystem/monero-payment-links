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
  };
  return routes;
}

const server = Bun.serve({
  port: 3003,
  routes: makeRoutes(),
});

globalThis.minireload = () => {
  server.reload({
    routes: makeRoutes(),
    port: 3003,
  });
};

console.log("Server running at http://localhost:3003");
