import { html } from "@spirobel/mininext";
import { insertAdminSessionCookie } from "./db";
import { getAdminSecret } from "./dashboard/adminSecret";

const loginSkeleton = await html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Admin Login - Monero Payment Links</title>
      <style>
        body {
          font-family: sans-serif;
          text-align: center;
          padding: 80px;
          background: #f4f4f4;
        }
        form {
          max-width: 340px;
          margin: 0 auto;
          background: white;
          padding: 40px;
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        input {
          width: 100%;
          padding: 12px;
          margin: 15px 0;
          font-size: 1.1rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        button {
          padding: 14px 32px;
          font-size: 1.2rem;
          background: #000;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
        }
        .error {
          color: red;
          margin: 10px 0;
        }
      </style>
    </head>
    <body>
      <h1>Admin Login</h1>
      <div id="error">${null}</div>
      <form method="POST" action="/login">
        <input
          type="password"
          name="password"
          placeholder="Enter admin password"
          required
          autofocus
        />
        <button type="submit">Login</button>
      </form>
    </body>
  </html>`.build();

export async function loginGet(req: Request) {
  const url = new URL(req.url);
  const hasError = url.searchParams.get("error") === "1";
  const errorHtml = hasError
    ? html`<div id="error">
        <p class="error">Incorrect password. Try again.</p>
      </div>`
    : html`<div id="error"></div>`;
  const filled = loginSkeleton.fill(errorHtml);
  return new Response(filled);
}

export async function loginPost(req: Request) {
  const formData = await req.formData();
  const password = formData.get("password") as string;
  if (!password || password !== (await getAdminSecret())) {
    const headers = new Headers();
    headers.set("Location", "/login?error=1");
    return new Response(null, { status: 303, headers });
  }

  const token = crypto.randomUUID();

  const insertResult = insertAdminSessionCookie(token);
  const result = await insertResult;
  const id = result.at(0)?.id;

  if (!id) {
    return new Response("Database error", { status: 500 });
  }

  const headers = new Headers();
  headers.set(
    "Set-Cookie",
    `session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`,
  );
  headers.set("Location", "/dashboard"); // redirect after login

  return new Response(null, { status: 303, headers });
}
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
