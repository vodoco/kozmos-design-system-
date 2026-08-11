/**
 * S5 · SDK Configuration — the client-wide settings behind Auto-Map Updates (Figma `2487:776`).
 *
 * Until this file existed, three of these were compile-time constants in `diff.ts`
 * (`EXPERT_REVIEW_ENABLED`, `GRACE_DAYS`) with a comment saying "S5 wires it to real config".
 * This is that wiring: the same store pattern as `store.ts` (module state + subscribe, read
 * through `useSyncExternalStore`), so toggling Expert Review in Settings genuinely lifts the hold
 * off the level the mapping team is holding, and changing the grace period genuinely moves the
 * countdown in the tree tag and the review screen's fate strip.
 *
 * **Client-wide on purpose** (handoff §6 decision 6, re-confirmed as audit Q6): there is no
 * per-site or per-building grace period. The scoping in this file is US6's *notification
 * recipients* only — a different question from where the rules live.
 */

import { clearLevelVersions } from "./store";

/* ── the grace period ─────────────────────────────────────────────────────── */

/**
 * The user stories put the range at 0s–3 months. Seconds is the unit the API will want, and it is
 * the only unit in which "immediately" is expressible — a day-valued setting can't say it.
 */
export const GRACE_MIN_SECONDS = 0;
export const GRACE_MAX_SECONDS = 90 * 86400;
export const GRACE_DEFAULT_SECONDS = 7 * 86400;

const HOUR = 3600;
const DAY = 86400;

/** The offered steps. A free-text seconds field would be honest and unusable; these are the shape
    of the decision people actually make. */
export const GRACE_OPTIONS: { seconds: number; label: string }[] = [
  { seconds: 0, label: "Immediately" },
  { seconds: 1 * HOUR, label: "1 hour" },
  { seconds: 6 * HOUR, label: "6 hours" },
  { seconds: 12 * HOUR, label: "12 hours" },
  { seconds: 1 * DAY, label: "1 day" },
  { seconds: 2 * DAY, label: "2 days" },
  { seconds: 3 * DAY, label: "3 days" },
  { seconds: 7 * DAY, label: "7 days" },
  { seconds: 14 * DAY, label: "14 days" },
  { seconds: 30 * DAY, label: "30 days" },
  { seconds: 60 * DAY, label: "2 months" },
  { seconds: 90 * DAY, label: "3 months" },
];

export function graceLabel(seconds: number): string {
  return GRACE_OPTIONS.find((o) => o.seconds === seconds)?.label ?? `${Math.round(seconds / DAY)} days`;
}

/** Whole days, rounded up — what every countdown surface in the app speaks in. Sub-day periods
    round to 0, which is correct: they have no days left to show. */
export function graceDays(seconds: number): number {
  return Math.ceil(seconds / DAY);
}

export type GraceAdviceTone = "info" | "advice" | "warn";

/**
 * The stories ask for two pieces of guidance, and they pull in opposite directions — so this
 * returns the one that applies rather than a list. Nothing here blocks the choice: it is the
 * client's call, and a warning that refuses is a rule pretending to be advice.
 */
export function graceAdvice(seconds: number): { tone: GraceAdviceTone; text: string } | undefined {
  if (seconds === 0)
    return {
      tone: "warn",
      text:
        "Medium changes publish the moment MapScale finishes — nobody gets a chance to review " +
        "them first. Large changes are still never auto-published.",
    };
  if (seconds > 14 * DAY)
    return {
      tone: "warn",
      text:
        "Longer than two weeks means updated maps sit unpublished for a long time, and reviewers " +
        "tend to forget what the change was about. We'd suggest a week or less.",
    };
  if (seconds > 7 * DAY)
    return { tone: "advice", text: "We'd suggest a week or less, so reviews stay fresh." };
  return undefined;
}

/* ── US6 · notification recipients ────────────────────────────────────────── */

/**
 * Who gets told, and at what breadth. The three levels are the story's own
 * (Client / Site / Building) and they are additive, not exclusive: a client-level recipient hears
 * about every site, and adding them to one building as well changes nothing. The UI says so
 * rather than silently deduplicating.
 */
export type ScopeLevel = "client" | "site" | "building";

export interface NotifyScope {
  level: ScopeLevel;
  /** Building/site id. Absent at client level, which has exactly one instance. */
  id?: string;
  name: string;
}

export function scopeKey(s: NotifyScope): string {
  return `${s.level}:${s.id ?? "*"}`;
}

export interface Recipient {
  id: string;
  name: string;
  email: string;
}

/**
 * The signed-in user. `adminOf` lists the scope keys where they hold Admin — the right US6 gates
 * six of its seven criteria on.
 *
 * **This persona is a Site Admin, not a Client Admin, and that is a deliberate demo choice.**
 * Client Admin is the tidier story, but `canAdminister` (correctly) treats it as implying every
 * level beneath it, so a client admin never meets the restriction and the prototype would only
 * ever show the happy path. As a site admin you can see all three states in one screen:
 *   · Client   — restricted, and the one place self-removal is exercisable (they're on that list)
 *   · Site     — full control
 *   · Building — full control on Terminal 3 and Concourse A, restricted on Concourse C
 *
 * To demo as a client admin instead, add `"client:*"` to this array — nothing else changes.
 */
export const CURRENT_USER: Recipient & { adminOf: string[] } = {
  id: "u-olcay",
  name: "Olcay Kurtulus",
  email: "olcay@vodo.co",
  adminOf: [
    "site:c1126cb8-a192-4bd3-90f5-08fb70278862",
    "building:51dd37d1-c2bc-4d9e-8e22-2ea1a15a626c",
    "building:c782c844-c9f0-4b02-884b-4cfa8ec9dab6",
    // note: no Concourse C (420b008e…) — that scope reads as view-only
  ],
};

/** The people you can pick from — the client's user list, in the real thing. */
export const DIRECTORY: Recipient[] = [
  CURRENT_USER,
  { id: "u-ege", name: "Ege Yılmaz", email: "ege@pointr.tech" },
  { id: "u-sara", name: "Sara Haddad", email: "sara.haddad@dubaiairports.ae" },
  { id: "u-marcus", name: "Marcus Bell", email: "m.bell@dubaiairports.ae" },
  { id: "u-priya", name: "Priya Raman", email: "priya.raman@dubaiairports.ae" },
  { id: "u-ops", name: "Airport Ops", email: "ops-maps@dubaiairports.ae" },
];

/**
 * Can the signed-in user assign or remove *other* people at this scope? US6 gates every one of
 * its six assign/remove criteria on Admin access at that level.
 *
 * Client Admin implies the levels beneath it — an admin of the whole client who couldn't manage
 * one building's recipients would be a bug, not a safeguard.
 */
export function canAdminister(scope: NotifyScope): boolean {
  if (CURRENT_USER.adminOf.includes("client:*")) return true;
  return CURRENT_USER.adminOf.includes(scopeKey(scope));
}

/**
 * US6's seventh criterion — "Any user may remove themselves from receiving map update
 * notifications" — has no Admin condition on it, and it is the only criterion that doesn't.
 * So it gets its own predicate rather than an `||` buried in the button.
 */
export function canRemove(scope: NotifyScope, recipientId: string): boolean {
  return canAdminister(scope) || recipientId === CURRENT_USER.id;
}

export const NO_ADMIN_REASON = "You need Admin access at this level to change who is notified here.";
export const SELF_REMOVE_NOTE = "You can always remove yourself, wherever you were added.";

/* ── the store ────────────────────────────────────────────────────────────── */

export interface Settings {
  /** The master switch. Off = floor-plans still process, but nothing publishes on its own. */
  autoUpdates: boolean;
  /** MAP-566's config flag, default on (Ege's Jira comment). Off = changes apply by magnitude
      with no per-change pass. */
  manualReview: boolean;
  /** Does Pointr's mapping team correct the result before the customer sees it? (§6 decision 4) */
  expertReview: boolean;
  graceSeconds: number;
  /** Recipients per scope key. */
  recipients: Record<string, string[]>;
}

const SITE_ID = "c1126cb8-a192-4bd3-90f5-08fb70278862";

let settings: Settings = {
  autoUpdates: true,
  manualReview: true,
  expertReview: true,
  graceSeconds: GRACE_DEFAULT_SECONDS,
  recipients: {
    "client:*": ["u-olcay", "u-ege"],
    [`site:${SITE_ID}`]: ["u-sara"],
    "building:51dd37d1-c2bc-4d9e-8e22-2ea1a15a626c": ["u-marcus", "u-priya"],
    "building:c782c844-c9f0-4b02-884b-4cfa8ec9dab6": ["u-ops"],
    "building:420b008e-9ac9-4d66-bbc6-c2639c1e3f6d": ["u-sara"],
  },
};

const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

/** Stable between mutations — what `useSyncExternalStore` requires of a snapshot. */
export function getSettings(): Settings {
  return settings;
}

export function subscribeSettings(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function setSetting<K extends keyof Settings>(key: K, value: Settings[K]) {
  if (settings[key] === value) return;
  settings = { ...settings, [key]: value };
  // Expert Review changes what the level seeds mean, so cached timelines have to be re-derived —
  // see `clearLevelVersions`. Nothing else here does.
  if (key === "expertReview") clearLevelVersions();
  emit();
}

export function addRecipient(scope: NotifyScope, recipientId: string) {
  const key = scopeKey(scope);
  const current = settings.recipients[key] ?? [];
  if (current.includes(recipientId)) return;
  settings = { ...settings, recipients: { ...settings.recipients, [key]: [...current, recipientId] } };
  emit();
}

export function removeRecipient(scope: NotifyScope, recipientId: string) {
  const key = scopeKey(scope);
  const current = settings.recipients[key] ?? [];
  if (!current.includes(recipientId)) return;
  settings = {
    ...settings,
    recipients: { ...settings.recipients, [key]: current.filter((id) => id !== recipientId) },
  };
  emit();
}

export function recipientsAt(scope: NotifyScope): Recipient[] {
  const ids = settings.recipients[scopeKey(scope)] ?? [];
  return ids.map((id) => DIRECTORY.find((r) => r.id === id)).filter((r): r is Recipient => !!r);
}

/**
 * Everyone who would actually be emailed about a change in this building — the reason the three
 * levels exist at all. Client and site recipients inherit down, so the building's own list is
 * never the whole answer, and a screen that showed only it would badly understate the blast
 * radius of a change.
 */
export function effectiveRecipients(buildingId: string, buildingName: string): {
  recipient: Recipient;
  via: ScopeLevel;
}[] {
  const out: { recipient: Recipient; via: ScopeLevel }[] = [];
  const seen = new Set<string>();
  const push = (list: Recipient[], via: ScopeLevel) => {
    for (const r of list) {
      if (seen.has(r.id)) continue;
      seen.add(r.id);
      out.push({ recipient: r, via });
    }
  };
  push(recipientsAt({ level: "client", name: "Client" }), "client");
  push(recipientsAt({ level: "site", id: SITE_ID, name: "Site" }), "site");
  push(recipientsAt({ level: "building", id: buildingId, name: buildingName }), "building");
  return out;
}
