/**
 * A real Pointr Cloud session — the first thing in this app that is not a mock.
 *
 * **Why it exists.** Everything the prototype wants next needs to know *who you are*: a flag with
 * a note is anonymous until it has an author, a comment thread is meaningless without one, and a
 * cursor with nobody behind it is a dot. Identity is the ingredient, and the platform already has
 * it — `POST /identity/clients/{cid}/auth/token` returns a JWT carrying email, user id and roles.
 *
 * **It talks to the real instance, directly.** The token endpoint answers CORS with
 * `access-control-allow-origin: *` and allows the `Authorization` header (measured, 2026-08-14),
 * so no proxy is needed. `expires_in` is 7200 and a refresh token comes back with it.
 *
 * ⚠️ **Deliberate limits, because this is a prototype on a publicly reachable URL:**
 *
 *   · The token lives in **`sessionStorage`, not `localStorage`** — it dies with the tab instead of
 *     persisting on a shared machine. A prototype is exactly where someone borrows a laptop.
 *   · The password is **never stored, never logged, and never put in a URL**. It exists for the
 *     duration of one fetch and is not held in state afterwards.
 *   · There is no "remember me". That is not an oversight.
 *
 * The safer shape — `client_credentials` with the secret in a serverless function — is written up
 * in the hand-off. This uses the password grant because it is what the real dashboard's login does
 * and what makes the prototype demonstrable; it is a QA instance, and the trade is recorded rather
 * than assumed.
 */
import { POINTR } from "../mock/pointrConfig";

/** What a signed-in person is, as far as this app is concerned. */
export interface Identity {
  /** The JWT's `email` claim — the only reliably present human-readable handle. */
  email: string;
  /** Display name, when the token carries one; falls back to the email's local part. */
  name: string;
  userId?: string;
  roles?: string;
  /** Initials for an avatar, derived rather than stored. */
  initials: string;
}

export interface Session {
  accessToken: string;
  refreshToken?: string;
  /** Absolute epoch ms, computed from `expires_in` at the moment the token arrived. */
  expiresAt: number;
  identity: Identity;
}

const KEY = "mapscale.session";

let current: Session | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

/**
 * Decode a JWT payload **without verifying it**, which is correct here and worth being explicit
 * about: the client cannot verify a signature it has no key for, and does not need to — the token
 * is only useful when the *server* accepts it. This reads the claims to put a name on screen.
 */
function claims(token: string): Record<string, unknown> {
  try {
    const part = token.split(".")[1];
    if (!part) return {};
    const json = atob(part.replace(/-/g, "+").replace(/_/g, "/"));
    // JWTs are UTF-8; atob gives latin-1, so a non-ASCII name needs re-decoding
    const bytes = Uint8Array.from(json, (c) => c.charCodeAt(0));
    return JSON.parse(new TextDecoder().decode(bytes));
  } catch {
    return {};
  }
}

function identityFrom(token: string): Identity {
  const c = claims(token);
  const email = String(c.email ?? c.unique_name ?? "");
  const given = String(c.given_name ?? "").trim();
  const family = String(c.family_name ?? "").trim();
  const full = [given, family].filter(Boolean).join(" ");
  const name = full || (email ? email.split("@")[0].replace(/[._-]+/g, " ") : "Signed in");
  const initials =
    (full ? full.split(/\s+/).map((w) => w[0]) : name.split(/\s+/).map((w) => w[0]))
      .slice(0, 2)
      .join("")
      .toUpperCase() || "?";
  return {
    email,
    name,
    userId: c.user_id ? String(c.user_id) : undefined,
    roles: c.roles ? String(c.roles) : undefined,
    initials,
  };
}

/** Restore a session left by an earlier render in this tab. Expired ones are dropped, not shown. */
function restore(): Session | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    if (!raw) return null;
    const s = JSON.parse(raw) as Session;
    if (!s?.accessToken || !s.expiresAt || s.expiresAt <= Date.now()) {
      sessionStorage.removeItem(KEY);
      return null;
    }
    return s;
  } catch {
    return null;
  }
}
current = restore();

function persist(s: Session | null) {
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s));
    else sessionStorage.removeItem(KEY);
  } catch {
    /* private mode — the session simply does not survive a reload */
  }
}

export function getSession(): Session | null {
  if (current && current.expiresAt <= Date.now()) signOut();
  return current;
}

export function subscribeSession(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/** A stable primitive for `useSyncExternalStore` — the token itself changes only on sign in/out. */
export function sessionKey(): string {
  return current ? current.accessToken.slice(-24) : "";
}

export class AuthError extends Error {
  // a plain field, not a constructor parameter property — `erasableSyntaxOnly` forbids those
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.status = status;
  }
}

/**
 * Exchange credentials for a token. Throws `AuthError` with a message fit to show a person —
 * the API's own `message` when it sends one, and something honest when it does not.
 */
export async function signIn(username: string, password: string): Promise<Session> {
  if (!POINTR.baseUrl || !POINTR.client)
    throw new AuthError("This build has no Pointr connection configured.", 0);

  const url = `${POINTR.baseUrl}/api/v10/identity/clients/${POINTR.client}/auth/token`;
  let res: Response;
  try {
    res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      // grant_type is the API's own vocabulary; username is the email, as the dashboard sends it
      body: JSON.stringify({ username, password, grant_type: "password" }),
    });
  } catch {
    // A network failure and a rejected password must not read the same — one is your fault, the
    // other is the connection's, and telling them apart is the difference between retrying and
    // checking your typing.
    throw new AuthError("Could not reach Pointr Cloud. Check your connection and try again.");
  }

  if (!res.ok) {
    let msg = "";
    try {
      msg = String(((await res.json()) as { message?: string })?.message ?? "");
    } catch {
      /* an error body that isn't JSON tells us nothing extra */
    }
    if (res.status === 400 || res.status === 401)
      throw new AuthError(msg || "That email and password did not match.", res.status);
    throw new AuthError(msg || `Sign in failed (${res.status}).`, res.status);
  }

  const body = (await res.json()) as {
    access_token?: string;
    refresh_token?: string;
    expires_in?: number;
  };
  if (!body.access_token) throw new AuthError("Pointr Cloud returned no token.");

  const session: Session = {
    accessToken: body.access_token,
    refreshToken: body.refresh_token,
    // a minute of headroom, so a request issued just under the wire isn't sent already stale
    expiresAt: Date.now() + Math.max(60, (body.expires_in ?? 7200) - 60) * 1000,
    identity: identityFrom(body.access_token),
  };
  current = session;
  persist(session);
  emit();
  return session;
}

export function signOut() {
  current = null;
  persist(null);
  emit();
}

/**
 * `fetch` with the session's bearer token attached — the one door every authenticated call should
 * go through, so a 401 has a single place to be understood.
 */
export async function authFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const s = getSession();
  const headers = new Headers(init.headers);
  if (s) headers.set("Authorization", `Bearer ${s.accessToken}`);
  const res = await fetch(path.startsWith("http") ? path : `${POINTR.baseUrl}${path}`, {
    ...init,
    headers,
  });
  // The token expired mid-session, or was revoked. Drop it: continuing to send it would fail every
  // request in the same silent way, and the screen would be full of empty states with no reason.
  if (res.status === 401) signOut();
  return res;
}
