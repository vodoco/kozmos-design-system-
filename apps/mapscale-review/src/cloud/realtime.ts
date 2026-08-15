import type { Transport } from "./presence";

/**
 * A **cross-machine** presence transport, over Ably's SSE and REST endpoints.
 *
 * **Why this exists.** `BroadcastChannel` — the default — is same-browser only, so two people in
 * two browsers can never see each other however many times the app is deployed. That is not a bug
 * to find; it is what that API is. Vercel's serverless model cannot hold a WebSocket open and the
 * Pointr platform has no realtime surface (`pws` is wayfinding), so crossing machines needs
 * something that does.
 *
 * **Zero dependencies, on purpose** — the same rule `api/feedback.mjs` follows. Ably ships an SDK;
 * this uses the raw endpoints instead, because the app deploys **prebuilt** and every dependency
 * added here is one more thing in a bundle that is already 800kB. Subscribing is an `EventSource`,
 * publishing is a `fetch`. That is the whole client.
 *
 * ## Turning it on
 *
 * Set **`VITE_ABLY_KEY`** and rebuild. Nothing else changes: `presence.ts` picks this up
 * automatically and every behaviour above it — level scoping, expiry, follow, the cursors — is
 * untouched, because none of it knows where messages come from.
 *
 *     # .env.local, and Vercel project env for the deployed build
 *     VITE_ABLY_KEY=xxxxx.yyyyy:zzzzzzzzzzzz
 *
 * Without it the app falls back to `BroadcastChannel` and says so in the console, so a build that
 * quietly lost its key does not look like a broken feature.
 *
 * ⚠️ **The key is in the client bundle, and therefore public** — the same truth as the Pointr
 * licence key, and it cannot be otherwise for a static site talking directly to a service. Make it
 * a **capability-limited key**: `subscribe` and `publish` on the one channel below, nothing else,
 * no `history`, no admin. Then the worst a reader can do is join a cursor channel. The alternative
 * — minting short-lived tokens from a serverless function — is the right answer for production and
 * is a small addition to `api/`, not a redesign.
 */

const CHANNEL = "mapscale-presence";
const KEY: string = import.meta.env.VITE_ABLY_KEY ?? "";

export function hasRealtimeKey(): boolean {
  return !!KEY;
}

/**
 * Ably's SSE stream, with REST publish. Returns `null` when no key is configured, which is the
 * signal for `presence.ts` to stay on `BroadcastChannel`.
 */
export function ablyTransport(
  onMessage: (m: unknown) => void,
): Transport | null {
  if (!KEY) return null;

  const sse = new EventSource(
    `https://realtime.ably.io/sse?channels=${encodeURIComponent(CHANNEL)}&v=1.2&key=${encodeURIComponent(KEY)}`,
  );
  sse.onmessage = (e) => {
    try {
      const envelope = JSON.parse(e.data) as { data?: string };
      if (envelope?.data) onMessage(JSON.parse(envelope.data));
    } catch {
      /* a frame we cannot parse is a frame we ignore — never take the stream down for one */
    }
  };
  /**
   * `EventSource` reconnects on its own, so an error is usually a blip and handling it by tearing
   * down would turn a hiccup into an outage. Logged once, not repeatedly, and not surfaced: a
   * cursor that pauses is not worth a banner.
   */
  let warned = false;
  sse.onerror = () => {
    if (warned) return;
    warned = true;
    console.warn(
      "[presence] realtime stream interrupted — EventSource will retry",
    );
  };

  return {
    send: (msg) => {
      // Fire and forget. A dropped cursor frame is replaced by the next one 50ms later, and
      // awaiting these would serialise the feed behind the slowest request.
      void fetch(
        `https://rest.ably.io/channels/${encodeURIComponent(CHANNEL)}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Basic ${btoa(KEY)}`,
          },
          body: JSON.stringify({ name: "p", data: JSON.stringify(msg) }),
          keepalive: true, // so the "bye" on pagehide actually leaves
        },
      ).catch(() => undefined);
    },
    close: () => sse.close(),
  };
}
