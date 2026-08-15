import { getSession, type Identity } from "./session";
import { ablyTransport, hasRealtimeKey } from "./realtime";

/**
 * Who else is here, and where they are pointing.
 *
 * **Scoped to the LEVEL, never to the viewport** (Olcay, 2026-08-14: *"don't show cursor even
 * though same viewport but different levels"*). Two people looking at the same coordinates on
 * different floors are not looking at the same thing — an airport stacks its levels, so the same
 * latitude and longitude is a different room one floor down. A cursor drawn across that boundary
 * would be pointing at something the other person cannot see.
 *
 * **Positions travel as lng/lat, never as screen pixels.** Everyone is at a different zoom and a
 * different window size; a pixel is meaningful only inside the sender's viewport, and projecting
 * locally is what makes the cursor land on the same *door* rather than the same part of the screen.
 *
 * ## The transport is deliberately swappable, and today's is honest about its limit
 *
 * ⚠️ **Vercel's serverless model cannot hold a WebSocket open**, and the Pointr API has no realtime
 * surface at all (`pws` is the wayfinding/routing service, checked 2026-08-14). So real
 * cross-machine presence needs a hosted realtime service or a small always-on server — a
 * dependency decision, not a coding one.
 *
 * Rather than block the feature on that, everything below is written against a two-method
 * `Transport`, and the one that ships is `BroadcastChannel`: **presence works across tabs and
 * windows on one machine today**, which is enough to build and demonstrate the whole experience.
 * Swapping in Ably/Pusher/Liveblocks or a `ws` server later is one object, not a rewrite — the
 * model, the level-scoping, the expiry and the UI never learn where the messages came from.
 */

/** Where a person is, and what they are pointing at. */
export interface Peer {
  id: string;
  identity: Identity;
  /** Which floor they are on. Presence is compared on this, and nothing else. */
  building?: string;
  level?: number;
  /**
   * The same place in words. Carried rather than looked up, because a viewer may not have loaded
   * the building a colleague is in — and "Ege is somewhere" is not worth showing.
   */
  buildingName?: string;
  levelName?: string;
  /** Map coordinates, so every viewer projects it into their own viewport. */
  lng?: number;
  lat?: number;
  /** Epoch ms of the last message from them — the basis of "still here". */
  at: number;
}

/** A message on the wire. Deliberately tiny: this is sent on every cursor move. */
type Wire =
  | { t: "hi"; p: Peer }
  | { t: "move"; id: string; lng: number; lat: number; at: number }
  | {
      t: "floor";
      id: string;
      building?: string;
      level?: number;
      buildingName?: string;
      levelName?: string;
      at: number;
    }
  | { t: "bye"; id: string };

export interface Transport {
  send(msg: Wire): void;
  close(): void;
}

/**
 * Same-machine transport. Real, useful, and clearly labelled — two tabs see each other, which is
 * how the level-scoping and the cursors were built and tested.
 */
function broadcastTransport(onMessage: (m: Wire) => void): Transport {
  if (typeof BroadcastChannel === "undefined")
    return { send: () => undefined, close: () => undefined };
  const ch = new BroadcastChannel("mapscale.presence");
  ch.onmessage = (e) => onMessage(e.data as Wire);
  return {
    send: (msg) => ch.postMessage(msg),
    close: () => ch.close(),
  };
}

/**
 * **Cross-machine if a key is configured, same-browser if not.**
 *
 * `BroadcastChannel` cannot cross a browser, let alone a machine — so two people in two browsers
 * see nothing, which is the API working as designed and not a fault to hunt. `realtime.ts` crosses
 * that gap over Ably's SSE/REST endpoints the moment `VITE_ABLY_KEY` exists.
 *
 * Announced once at startup, because a silent fallback is indistinguishable from a broken feature
 * — and this exact confusion has already cost real time.
 */
function makeTransport(onMessage: (m: Wire) => void): Transport {
  const realtime = ablyTransport(onMessage as (m: unknown) => void);
  if (realtime) {
    console.info("[presence] realtime: cross-machine (Ably)");
    return realtime;
  }
  console.info(
    "[presence] realtime: SAME BROWSER ONLY (BroadcastChannel). " +
      "Two browsers, or two machines, will not see each other. Set VITE_ABLY_KEY to cross that gap.",
  );
  return broadcastTransport(onMessage);
}

/** Whether this build can see people on other machines at all. Surfaced in the UI. */
export function isCrossMachine(): boolean {
  return hasRealtimeKey();
}

/**
 * How long a peer survives without a word. Long enough to ride out a tab throttling its timers
 * (browsers slow background tabs hard), short enough that a closed laptop stops haunting the map.
 */
const STALE_MS = 12_000;
const HEARTBEAT_MS = 4_000;
/** Cursor moves are throttled to this — 20/s is smooth and still a lot of messages. */
const MOVE_MS = 50;

/** This tab's own id. Per TAB, not per user: one person with two windows is genuinely two cursors. */
const selfId = `${Math.random().toString(36).slice(2)}-${Date.now().toString(36)}`;

let peers = new Map<string, Peer>();
const listeners = new Set<() => void>();
let transport: Transport | null = null;
let heartbeat: ReturnType<typeof setInterval> | null = null;
let lastMoveSent = 0;
let me: Peer | null = null;
/**
 * The floor the app asked for before presence had started.
 *
 * ⚠️ **Children mount before parents**, so `MapContent`'s floor effect runs before `App`'s
 * `startPresence` — the first (and often only) call to `setPresenceFloor` therefore arrived while
 * `me` was still null and was dropped, and because it only re-sends on CHANGE it never came back.
 * The symptom was the top bar calling a colleague "elsewhere" while their cursor was on the map.
 */
let pendingFloor: {
  building?: string;
  level?: number;
  buildingName?: string;
  levelName?: string;
} | null = null;
let version = 0;

function emit() {
  version++;
  listeners.forEach((l) => l());
}

function prune() {
  const cutoff = Date.now() - STALE_MS;
  let changed = false;
  for (const [id, p] of peers)
    if (p.at < cutoff) {
      peers.delete(id);
      changed = true;
    }
  if (changed) emit();
}

function onMessage(m: Wire) {
  if (!m || ("id" in m && m.id === selfId)) return; // never render your own cursor
  if (m.t === "hi") {
    if (m.p.id === selfId) return;
    /**
     * ⚠️ **Answer only somebody NEW.** This used to answer every `hi`, which never terminates:
     * A greets B, B answers, A answers the answer, B answers that — measured at **5,000 messages
     * in 500ms** from a single announce, each one calling `emit()` and re-rendering React. Two
     * signed-in tabs pegged the CPU and the app looked like it had failed to load.
     *
     * Replying only to a peer we have not met bounds it at three messages: greet, answer, silence.
     * It also makes the 4s heartbeat free, because a heartbeat is by definition from someone we
     * already know.
     */
    const isNew = !peers.has(m.p.id);
    peers.set(m.p.id, m.p);
    if (isNew && me) transport?.send({ t: "hi", p: { ...me, at: Date.now() } });
    emit();
  } else if (m.t === "move") {
    const p = peers.get(m.id);
    if (!p) return; // a mover we have never met: wait for its "hi"
    p.lng = m.lng;
    p.lat = m.lat;
    p.at = m.at;
    emit();
  } else if (m.t === "floor") {
    const p = peers.get(m.id);
    if (!p) return;
    p.building = m.building;
    p.level = m.level;
    p.buildingName = m.buildingName;
    p.levelName = m.levelName;
    p.at = m.at;
    emit();
  } else if (m.t === "bye") {
    if (peers.delete(m.id)) emit();
  }
}

/** Start announcing. Idempotent, and a no-op until somebody is signed in. */
export function startPresence() {
  if (transport) return;
  const s = getSession();
  if (!s) return;
  me = {
    id: selfId,
    identity: s.identity,
    at: Date.now(),
    ...(pendingFloor ?? {}),
  };
  pendingFloor = null;
  transport = makeTransport(onMessage);
  transport.send({ t: "hi", p: me });
  heartbeat = setInterval(() => {
    if (!me) return;
    me.at = Date.now();
    transport?.send({ t: "hi", p: me }); // "hi" doubles as the heartbeat
    prune();
  }, HEARTBEAT_MS);
  // Say goodbye on the way out, so nobody lingers for STALE_MS after closing a tab. Removed in
  // `stopPresence`, so a sign-out/sign-in cycle does not stack a second listener.
  window.addEventListener("pagehide", stopPresence);
}

export function stopPresence() {
  if (!transport) return;
  window.removeEventListener("pagehide", stopPresence);
  transport.send({ t: "bye", id: selfId });
  transport.close();
  transport = null;
  if (heartbeat) clearInterval(heartbeat);
  heartbeat = null;
  me = null;
  peers = new Map();
  emit();
}

/** Tell everyone which floor this tab is on. Cheap, and only sent when it actually changes. */
export function setPresenceFloor(
  building: string | undefined,
  level: number | undefined,
  buildingName?: string,
  levelName?: string,
) {
  if (!me) {
    pendingFloor = { building, level, buildingName, levelName };
    return;
  } // applied on start
  if (
    me.building === building &&
    me.level === level &&
    me.levelName === levelName
  )
    return;
  me.building = building;
  me.level = level;
  me.buildingName = buildingName;
  me.levelName = levelName;
  me.at = Date.now();
  transport?.send({
    t: "floor",
    id: selfId,
    building,
    level,
    buildingName,
    levelName,
    at: me.at,
  });
}

/** Report the cursor, in map coordinates. Throttled — this fires on every mouse move. */
export function setPresenceCursor(lng: number, lat: number) {
  if (!me) return;
  const now = Date.now();
  if (now - lastMoveSent < MOVE_MS) return;
  lastMoveSent = now;
  me.lng = lng;
  me.lat = lat;
  me.at = now;
  transport?.send({ t: "move", id: selfId, lng, lat, at: now });
}

export function subscribePresence(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

/**
 * **Follow** — go to where somebody is (Olcay, 2026-08-14: *"I can follow them ... go to where
 * they are as in site building and level"*).
 *
 * Routed through presence rather than through props because the two ends are far apart: the
 * control lives in the top bar (App's chrome) and the destination is Map Content's `target`.
 * Threading a callback down would make App the middleman for a fact it has no other reason to
 * know. This is the same reason `getMyFloor` lives here.
 */
let followRequest: { building: string; level: number; n: number } | null = null;
const followListeners = new Set<() => void>();

export function followPeer(p: Peer) {
  if (p.building === undefined || p.level === undefined) return;
  followRequest = {
    building: p.building,
    level: p.level,
    n: (followRequest?.n ?? 0) + 1,
  };
  followListeners.forEach((l) => l());
}

export function subscribeFollow(fn: () => void): () => void {
  followListeners.add(fn);
  return () => followListeners.delete(fn);
}

/** The nonce rises per request, so following the same person twice still fires. */
export function followVersion(): number {
  return followRequest?.n ?? 0;
}

export function getFollowRequest() {
  return followRequest;
}

/** A primitive for `useSyncExternalStore` — bumped on every change to the peer set. */
export function presenceVersion(): number {
  return version;
}

/**
 * The floor THIS tab is on. Exposed because two surfaces need it and only one of them is anywhere
 * near the map: the top bar has to say who is *with* you, and threading building/level up through
 * App to reach it would be a second source for a fact presence already holds.
 */
export function getMyFloor(): { building?: string; level?: number } {
  return { building: me?.building, level: me?.level };
}

/** Everyone currently online, ordered so the list doesn't reshuffle under the cursor. */
export function getPeers(): Peer[] {
  return [...peers.values()].sort((a, b) =>
    a.identity.name.localeCompare(b.identity.name),
  );
}

/**
 * The peers whose cursor should be drawn: same building, same level, and actually pointing at
 * something. Everyone else stays in the top bar, where being elsewhere is the useful fact.
 */
export function getPeersOnFloor(
  building: string | undefined,
  level: number | undefined,
): Peer[] {
  if (building === undefined || level === undefined) return [];
  return getPeers().filter(
    (p) =>
      p.building === building &&
      p.level === level &&
      p.lng !== undefined &&
      p.lat !== undefined,
  );
}

/**
 * A stable colour per person, so the same cursor is the same colour to everyone looking at it —
 * derived from the identity rather than assigned on arrival, which would differ per viewer.
 */
export function peerColour(p: Peer): string {
  /**
   * ⚠️ **Keyed on `userId` first.** This used to key on `email`, which was empty on every real
   * token (the address is in `upn` — see `identityFrom`) — so the key fell through to the shared
   * fallback name *"Signed in"* and **every person got the same colour**. The id is the one field
   * guaranteed to be present and guaranteed to differ.
   */
  const key = p.identity.userId || p.identity.email || p.identity.name || p.id;
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  const palette = [
    "#2FBF71",
    "#3B82F6",
    "#9C6EFF",
    "#D98C0D",
    "#E4488F",
    "#12A5B0",
  ];
  return palette[h % palette.length];
}
