import { loginGet, loginPost, loginSkeleton } from "./dashboard/login";

const routes = {
  ...loginSkeleton.static_routes,
  "/login": {
    GET: loginGet,
    POST: loginPost,
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
