import { html } from "@spirobel/mininext";
import { getSessionCookieByValue, insertAdminSessionCookie } from "../db";
import { getAdminSecret } from "./adminSecret";
import { getTheme } from "../theme/theme";

export const loginSkeleton = await html`<!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>Admin Login - Monero Payment Links</title>
      ${null}
    </head>
    <body>
      <div class="login-card">
        <h1>Admin Login</h1>
        <p class="subtitle">Enter your password to access the dashboard</p>
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
      </div>
    </body>
  </html>`.build();

export async function adminLoginGet(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req).catch((e) => {
    if (e.message !== "Not admin, but on /login route") {
      throw e;
    }
  });
  if (adminRedirect) return adminRedirect;
  const url = new URL(req.url);
  const hasError = url.searchParams.get("error") === "1";
  const errorHtml = hasError
    ? html`<div id="error">
        <p class="error">Incorrect password. Try again.</p>
      </div>`
    : html`<div id="error"></div>`;
  const theme = getTheme();
  const filled = loginSkeleton.fill(theme.loginStyles, errorHtml);
  return new Response(filled);
}

export async function adminLoginPost(req: Request) {
  const adminRedirect = await checkAdminAndRedirect(req).catch((e) => {
    if (e.message !== "Not admin, but on /login route") {
      throw e;
    }
  });
  if (adminRedirect) return adminRedirect;
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
    `admin_session=${token}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=2592000`,
  );
  headers.set("Location", "/dashboard"); // redirect after login

  return new Response(null, { status: 303, headers });
}
export function getCookieValue(req: Request, name: string): string | null {
  const header = req.headers.get("Cookie") || "";
  const parts = header.split(";");
  for (const part of parts) {
    const trimmed = part.trim();
    if (trimmed.startsWith(name + "=")) {
      return trimmed.slice(name.length + 1);
    }
  }
  return null;
}

export async function checkAdminAndRedirect(
  req: Request,
): Promise<Response | null> {
  const url = new URL(req.url);

  const adminCookie = getCookieValue(req, "admin_session");

  const isAdmin = await checkLoggedin(adminCookie);
  // in case we are admin and still on the login page we want to redirect to /dashboard
  if (isAdmin && url.pathname === "/login")
    return Response.redirect("/dashboard", 303);

  // in case we are not admin and not on the login page we want to redirect to /login
  if (!isAdmin && url.pathname !== "/login")
    return Response.redirect("/login", 303);

  if (isAdmin) return null; // if we are admin and not on the login page we don't want to redirect
  if (!isAdmin && url.pathname === "/login")
    throw new Error("Not admin, but on /login route");
  throw new Error("Not admin, not on /login route, not redirected");
}

export async function checkLoggedin(adminCookie: string | null) {
  if (!adminCookie) return false;
  const rows = await getSessionCookieByValue(adminCookie);
  return rows.length > 0;
}
