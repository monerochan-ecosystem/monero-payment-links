import { eq } from "drizzle-orm";
import { db } from "../../db/db.ts";
import { sessionCookies, type NewSessionCookie } from "../../db/schema";
import { parse } from "cookie";

export function getSession(req: Request) {
  const sessionId = getSessionId(req);
  if (!sessionId) return;
  const cookie = db
    .select()
    .from(sessionCookies)
    .where(eq(sessionCookies.cookie, sessionId))
    .get();
  return cookie;
}
export function getSessionId(req: Request) {
  return parse(req.headers.get("Cookie") || "")["sessionId"] || null;
}

export async function deleteCookie(req: Request) {
  const sessionId = getSessionId(req);
  if (!sessionId) return;
  const deleted = db.transaction((tx) => {
    const cookie = tx
      .select()
      .from(sessionCookies)
      .where(eq(sessionCookies.cookie, sessionId))
      .get();
    if (!cookie?.id) return;
    return tx
      .delete(sessionCookies)
      .where(eq(sessionCookies.id, cookie.id))
      .returning()
      .get();
  });
}

export function createSession(accountType: NewSessionCookie["accountType"]) {
  const uuid = crypto.randomUUID();

  // Insert a new sessionCookie with the generated UUID as the cookie value for the given address
  return db
    .insert(sessionCookies)
    .values({ cookie: uuid, accountType })
    .returning()
    .get();
}
