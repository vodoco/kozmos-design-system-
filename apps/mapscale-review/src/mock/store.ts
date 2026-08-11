/**
 * The in-memory store (Olcay's nod, 2026-08-10 late evening — the Building wizard forced it):
 * buildings created in the wizard must appear in the Map Content tree afterwards, which no
 * per-screen local state can do. Module-level with a subscribe, consumed via
 * `useSyncExternalStore` — deliberately tiny; the real thing is the platform's API.
 *
 * This is also the seam the multi-file-drop design (handoff standing item) plugs into later:
 * uploads to levels whose editors aren't open finally have somewhere to live.
 */

import type { Change, Decision, LevelVersion } from "./diff";

export interface StoredLevel {
  index: number;
  short: string;
  long: string;
  /** The floor-plan file this level was created from. */
  file: string;
}

export interface StoredBuilding {
  id: string;
  name: string;
  levels: StoredLevel[];
}

let buildings: StoredBuilding[] = [];
const listeners = new Set<() => void>();

export function addBuilding(b: StoredBuilding) {
  buildings = [...buildings, b];
  listeners.forEach((l) => l());
}

/** The edit-wizard's Save for a store building. SDK buildings have no store row to update —
    their edits don't persist in the mock (the same limit as the editor's metadata, D3). */
export function updateBuilding(b: StoredBuilding) {
  buildings = buildings.map((x) => (x.id === b.id ? b : x));
  listeners.forEach((l) => l());
}

/* ── the version timeline, per level ──────────────────────────────────────── */

/**
 * Every level's version list, keyed `buildingId:index`.
 *
 * This used to live in `LevelEditor`'s local state while `VersionHistory` re-seeded its own copy
 * from `seedVersions()` — so uploading in the editor and then opening the history showed a list
 * that stopped one version short, and a *Compare* on the version you were just looking at
 * silently redirected to a different one (fixed 2026-08-11). One list, two readers.
 *
 * Seeded lazily on first read so the seeds stay the single source of demo truth.
 */
const versionsByLevel = new Map<string, LevelVersion[]>();
const versionListeners = new Set<() => void>();

export function levelKey(buildingId: string | undefined, index: number): string {
  return `${buildingId ?? "?"}:${index}`;
}

export function getLevelVersions(
  key: string,
  seed: () => LevelVersion[],
): LevelVersion[] {
  let v = versionsByLevel.get(key);
  if (!v) {
    v = seed();
    versionsByLevel.set(key, v);
  }
  return v;
}

export function setLevelVersions(key: string, versions: LevelVersion[]) {
  versionsByLevel.set(key, versions);
  versionListeners.forEach((l) => l());
}

export function subscribeLevelVersions(fn: () => void): () => void {
  versionListeners.add(fn);
  return () => versionListeners.delete(fn);
}

/**
 * Drop every cached timeline so the next read re-seeds.
 *
 * Called when Settings flips Expert Review (S5), because that flag changes what `seedVersions()`
 * *means*: with it on, the held level's newest version is `expert-review`; with it off that
 * version was never held at all. Levels seeded before the toggle would otherwise keep contradicting
 * the setting — the tree still showing a hold the settings screen says doesn't exist.
 *
 * It does discard uploads made earlier in the session, which is the honest trade: this is a demo
 * seam, and a stale hold reads as a bug where a reset reads as a reset.
 */
export function clearLevelVersions() {
  if (versionsByLevel.size === 0) return;
  versionsByLevel.clear();
  versionListeners.forEach((l) => l());
}

/* ── concluded reviews ────────────────────────────────────────────────────── */

/**
 * What a finished Manual Review leaves behind, per level.
 *
 * Until 2026-08-11 the decisions lived in `ManualReview`'s own state and **died the moment you
 * saved** — you concluded a review, landed back on the level, and nothing anywhere remembered it.
 * Which made the flag meaningless: decision 2 chose Flag over Edit precisely because *"flag now,
 * keep flagged items visible to edit later"*, and there was no later.
 *
 * Keyed by level; `versionN` records which version was reviewed, so a newer upload doesn't inherit
 * an older review's conclusions.
 */
export interface ReviewOutcome {
  versionN: number;
  decisions: Record<string, Decision | undefined>;
  /** The changes exactly as reviewed — the editor draws the flagged ones on its own map. */
  changes: Change[];
  /** Did concluding it publish the level? (Amber does; red cause B only via Publish now.) */
  published: boolean;
}

const reviews = new Map<string, ReviewOutcome>();
const reviewListeners = new Set<() => void>();
/**
 * A counter, not `reviews.size` — re-reviewing the same level overwrites its entry and leaves the
 * size unchanged, which `useSyncExternalStore` would read as "nothing happened".
 */
let reviewsVersion = 0;

export function setReviewOutcome(key: string, outcome: ReviewOutcome) {
  reviews.set(key, outcome);
  reviewsVersion++;
  reviewListeners.forEach((l) => l());
}

/** Snapshot for `useSyncExternalStore` — a primitive, so it's stable between writes. */
export function getReviewCount(): number {
  return reviewsVersion;
}

export function getReviewOutcome(key: string): ReviewOutcome | undefined {
  return reviews.get(key);
}

export function subscribeReviews(fn: () => void): () => void {
  reviewListeners.add(fn);
  return () => reviewListeners.delete(fn);
}

/** Stable reference between mutations — what useSyncExternalStore requires of a snapshot. */
export function getCreatedBuildings(): StoredBuilding[] {
  return buildings;
}

export function subscribeCreatedBuildings(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
