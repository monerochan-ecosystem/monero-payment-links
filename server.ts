import { dashBoardRoute, dashboardSkeleton } from "./dashboard/dashboard";
import {
  adminLoginGet,
  adminLoginPost,
  loginSkeleton,
} from "./dashboard/login";

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
const server = Bun.serve({
  routes,
});

globalThis.minireload = () => {
  server.reload({
    routes,
  });
};

console.log("Server running at http://localhost:3000");
