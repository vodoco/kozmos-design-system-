/**
 * US6 · S7 — the notification feed behind the bell (Figma `2495:463`).
 *
 * **Derived, never authored.** The obvious way to build this screen is a hand-written list of five
 * plausible rows, and it is the wrong way for the same reason the tree tags and the editor's
 * status card are keyed off one seed: a bell saying "Departures Floor needs your review" beside a
 * tree that says the level is rejected is worse than no bell at all. So the feed is a projection
 * of `seedVersions()` over `SITE_SNAPSHOT` — the same function the editor seeds its phase from —
 * and a level can only ever be in the feed in the state it is actually in.
 *
 * The cost of that choice is that the rows are as interesting as the seeds are, and no more. The
 * Figma frame draws five rows because it was free to; this produces one per notify-worthy level
 * across the three real buildings, which happens to be more.
 */

import {
  BAND,
  seedVersions,
  type LevelVersion,
  type RedCause,
  type VersionState,
} from "./diff";
import { SITE_SNAPSHOT } from "./site";
import { getSettings, graceDays } from "./settings";
import { getLevelVersions, getReviewOutcome, levelKey } from "./store";

/* ── what a notification is ───────────────────────────────────────────────── */

/**
 * The *event*, not the level's state — they differ in one important place: a level sitting at
 * `needs-review` produces a `new-version` event when it lands and a `grace` event as its deadline
 * approaches. Both are real things a person gets emailed about.
 */
export type NotifKind =
  | "new-version"
  | "grace"
  | "expert-review"
  | "auto-published"
  | "needs-decision"
  | "rejected"
  | "failed";

export interface Notification {
  id: string;
  kind: NotifKind;
  title: string;
  /** The middle line: where it happened, then the facts, then when. Assembled from parts so no
      row can name a level one way and a % another. */
  meta: string;
  /** The link at the bottom of the row. Absent where there is genuinely nothing to do. */
  action?: { label: string; to: "review" | "level" };
  buildingId: string;
  buildingName: string;
  levelIndex: number;
  levelShort: string;
  levelName: string;
  ago: string;
  /** Sort key — smaller is more recent. The mock has no clock (see `LevelVersion.at`). */
  recency: number;
}

/**
 * Row colour.
 *
 * Deliberately NOT the frame's palette. `2495:463` draws Expert Review with a **purple dot**, and
 * that purple is `#9C6EFF` — reserved by design law (§3) for User Override. The identical
 * collision was found and fixed once already, on the API source dot in the editor. Expert review
 * takes the theme blue instead.
 *
 * Amber is likewise kept for magnitude alone. The expert hold is drawn in amber elsewhere in the
 * app, and that is defensible there because a held level has no % yet, so the two can never be on
 * screen together — but a notification *list* puts them side by side, which is exactly the case
 * the exception was justified against.
 */
export const NOTIF_TONE: Record<NotifKind, { dot: string; tint: string }> = {
  "new-version": { dot: "#0b369c", tint: "#eef3ff" },
  grace: { dot: BAND.medium.ink, tint: BAND.medium.tint },
  "expert-review": { dot: "#0b369c", tint: "#eef3ff" },
  "auto-published": { dot: BAND.minor.ink, tint: BAND.minor.tint },
  "needs-decision": { dot: BAND.large.ink, tint: BAND.large.tint },
  rejected: { dot: BAND.large.ink, tint: BAND.large.tint },
  failed: { dot: BAND.large.ink, tint: BAND.large.tint },
};

/** How near the deadline counts as "soon" — below this the grace row changes its own title. */
const GRACE_SOON_DAYS = 2;

/**
 * The mock has no clock, so recency is a fixed ordering rather than arithmetic on `at`. Keyed by
 * event kind, which is also roughly the order these things happen in.
 */
const AGE: Record<NotifKind, { ago: string; recency: number }> = {
  "new-version": { ago: "2h ago", recency: 1 },
  grace: { ago: "8h ago", recency: 2 },
  "expert-review": { ago: "1d ago", recency: 3 },
  rejected: { ago: "1d ago", recency: 4 },
  "needs-decision": { ago: "2d ago", recency: 5 },
  failed: { ago: "2d ago", recency: 6 },
  "auto-published": { ago: "3d ago", recency: 7 },
};

/* ── the projection ───────────────────────────────────────────────────────── */

function forVersion(
  v: LevelVersion,
  b: { id: string; name: string },
  l: { index: number; short: string; long: string },
): Notification | undefined {
  const where = `${b.name} · ${l.short} ${l.long}`;
  const at = (k: NotifKind) => AGE[k];
  const base = {
    buildingId: b.id,
    buildingName: b.name,
    levelIndex: l.index,
    levelShort: l.short,
    levelName: l.long,
  };
  const id = `${b.id}:${l.index}:${v.n}`;

  const state: VersionState = v.state;
  const cause: RedCause | undefined = v.redCause;

  if (state === "needs-review") {
    // A level in the grace period generates both events over its life. Which one the feed shows
    // depends on how much of the period is left — the same number the tree tag and the review
    // screen's fate strip read, so all three move together when Settings changes it.
    const left = graceDays(getSettings().graceSeconds);
    const elapsed = 1; // the demo is one day into every countdown
    const remaining = Math.max(0, left - elapsed);
    const soon = remaining <= GRACE_SOON_DAYS;
    if (soon) {
      const k: NotifKind = "grace";
      return {
        ...base, id, kind: k, ...at(k),
        title: remaining === 0 ? "Publishing today" : "Grace period ending soon",
        meta: `${where} · auto-publishes in ${remaining === 0 ? "under a day" : `${remaining} day${remaining === 1 ? "" : "s"}`}`,
        action: { label: "Review now", to: "review" },
      };
    }
    const k: NotifKind = "new-version";
    return {
      ...base, id, kind: k, ...at(k),
      title: v.source === "api" ? "New version received via API" : "New version uploaded",
      meta: `${where} · ${v.changePct ?? 0}% of floor area · publishes in ${remaining} days`,
      action: { label: "Review changes", to: "review" },
    };
  }

  if (state === "expert-review") {
    const k: NotifKind = "expert-review";
    return {
      ...base, id, kind: k, ...at(k),
      // Experts run BEFORE the customer (§6 decision 4), so this is not "your turn now" — the
      // job is still in flight. The frame's "Expert Review complete · View & publish" belongs to
      // the old after-the-customer ordering.
      title: "Pointr's Mapping Team is reviewing",
      meta: `${where} · you'll be notified when their corrections land`,
      action: { label: "Open level", to: "level" },
    };
  }

  if (state === "published" && v.changePct !== undefined && v.n > 2) {
    const k: NotifKind = "auto-published";
    return {
      ...base, id, kind: k, ...at(k),
      title: "Auto-published",
      // No action: it is live, it needed nobody, and offering a link would imply otherwise.
      meta: `${where} · minor change (${v.changePct}% of floor area) · published automatically`,
    };
  }

  if (state === "needs-decision" && cause === "cannot-match") {
    const k: NotifKind = "needs-decision";
    return {
      ...base, id, kind: k, ...at(k),
      title: "Needs your decision",
      meta: `${where} · MapScale couldn't match it to the published map · not auto-published`,
      action: { label: "Review changes", to: "review" },
    };
  }

  if (state === "rejected") {
    const k: NotifKind = "rejected";
    return {
      ...base, id, kind: k, ...at(k),
      // Decision 9. The frame still reads "Needs your decision · 62% of floor area · not
      // auto-published", which was true before a >50% change became an outright rejection —
      // there is no decision to make, so the action goes to the level, where a corrected file
      // is the way out.
      title: "Floor-plan rejected",
      meta: `${where} · ${v.changePct}% of floor area changed · check the file and upload a corrected one`,
      action: { label: "Open level", to: "level" },
    };
  }

  if (state === "failed") {
    const k: NotifKind = "failed";
    return {
      ...base, id, kind: k, ...at(k),
      title: "Couldn't process the floor plan",
      meta: `${where} · the file couldn't be read · nothing was published`,
      action: { label: "Open level", to: "level" },
    };
  }

  return undefined;
}

/**
 * The whole site's feed, newest first. Recomputed on read rather than cached: it depends on
 * settings (the grace countdown), and a stale bell is the failure this file exists to prevent.
 */
export function buildFeed(): Notification[] {
  const out: Notification[] = [];
  for (const b of SITE_SNAPSHOT) {
    for (const l of b.levels) {
      const key = levelKey(b.id, l.index);
      /**
       * **The store first, the seed only as its fallback** — the same rule every other reader in
       * the app follows, and the one this file broke.
       *
       * Calling `seedVersions()` directly made the feed a projection of the *original* demo data
       * rather than of what has actually happened, so completing a review left the editor saying
       * "Published · reviewed by you" while the bell went on insisting the same level "publishes
       * in 6 days". Two surfaces contradicting each other about one level is precisely the failure
       * deriving this feed was supposed to make impossible.
       */
      const newest = getLevelVersions(key, () => seedVersions(l.short, l.index, b.id))[0];
      if (!newest) continue;
      /**
       * A level you have already engaged with drops out of the feed.
       *
       * Notifications are things wanting attention; a review you concluded had yours, and one you
       * saved part-way is held out of publishing so nothing is pending on it either. The tree tag
       * and the editor's card carry those states — the bell would only repeat them, and while
       * held it would repeat them *wrongly*, since the countdown it quotes is suspended.
       *
       * Version-matched, so a NEW upload to the same level notifies again: that outcome is about
       * a floor-plan which has since been replaced.
       */
      const handled = getReviewOutcome(key, newest.n);
      if (handled) continue;
      const n = forVersion(newest, b, l);
      if (n) out.push(n);
    }
  }
  return out.sort((a, b) => a.recency - b.recency || a.buildingName.localeCompare(b.buildingName));
}

/* ── read state ───────────────────────────────────────────────────────────── */

/**
 * Which notifications have been read. Kept out of the feed itself so the projection stays pure —
 * the feed is a view of the data, this is a view of the person.
 */
let read = new Set<string>();
const listeners = new Set<() => void>();

export function getRead(): Set<string> {
  return read;
}

export function subscribeRead(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function markRead(id: string) {
  if (read.has(id)) return;
  read = new Set(read).add(id);
  listeners.forEach((l) => l());
}

export function markAllRead(ids: string[]) {
  const next = new Set(read);
  let changed = false;
  for (const id of ids) if (!next.has(id)) { next.add(id); changed = true; }
  if (!changed) return;
  read = next;
  listeners.forEach((l) => l());
}
