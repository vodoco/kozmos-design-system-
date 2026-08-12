/**
 * The taxonomy, as much of it as this prototype needs: which **class** a feature type belongs to,
 * how to say its name, and which sprite draws it.
 *
 * **Grounded, not invented.** The Pointr taxonomy gives every `(mainType, subType)` pair a `class`
 * — `poi` · `structural` · `virtual` · `system` · `interior-asset` — and that is exactly the
 * grouping the real dashboard shows under a level (Olcay's Harrods screenshots: *POI*,
 * *Structural*, *Virtual*). Rows below were read from the taxonomy service itself, not guessed.
 *
 * ⚠️ **Two things the lookup taught us, both easy to get wrong:**
 *
 * 1. **Class depends on the PAIR, not on `mainType`.** `circulation-space/walkway` is
 *    *structural*, while `circulation-space/elevator-lobby` is *poi*. So `SUBTYPE_CLASS` overrides
 *    `MAIN_CLASS`, never the other way round.
 * 2. **There are five classes, not the three the dashboard shows.** `system` (wayfinding nodes) and
 *    `interior-asset` (loose furniture) are real and simply aren't drawn as groups there.
 *
 * ⚠️ **This table covers the types the demo building actually contains.** It is a cache of a
 * service the app can't reach at runtime, so an unknown type falls back to `poi` rather than
 * vanishing — a level is better off showing a feature under a slightly wrong heading than not at
 * all. A full pass against the taxonomy service is the proper fix when this stops being a mock.
 */

export type FeatureClass = "poi" | "structural" | "virtual" | "system" | "interior-asset";

/** Read from the taxonomy service (`class` per mainType, where the whole mainType agrees). */
const MAIN_CLASS: Record<string, FeatureClass> = {
  wall: "structural",
  transition: "structural",
  "entrance-exit": "structural",
  "circulation-space": "structural",
  "virtual-obstacle": "virtual",
  "wayfinding-network": "system",
  furniture: "interior-asset",
  equipment: "poi",
  "operational-space": "poi",
  "retail-space": "poi",
  "food-beverage-space": "poi",
  "service-space": "poi",
  "amenity-space": "poi",
  "medical-space": "poi",
  "security-space": "poi",
  "social-space": "poi",
  "work-space": "poi",
  "faith-worship-space": "poi",
  "transportation-space": "poi",
  "restroom-space": "poi",
  "wellness-space": "poi",
  "activity-space": "poi",
  "entertainment-space": "poi",
  "parking-space": "poi",
  section: "poi",
};

/** Where a subType disagrees with its mainType — see the warning above. */
const SUBTYPE_CLASS: Record<string, FeatureClass> = {
  "circulation-space/elevator-lobby": "poi",
};

export function classOf(mainType: string, subType?: string): FeatureClass {
  if (subType && SUBTYPE_CLASS[`${mainType}/${subType}`]) return SUBTYPE_CLASS[`${mainType}/${subType}`];
  return MAIN_CLASS[mainType] ?? "poi";
}

/** The order and words the dashboard uses. `system` is hidden — it is plumbing, not content. */
export const CLASS_ORDER: FeatureClass[] = ["poi", "structural", "interior-asset", "virtual"];
export const CLASS_LABEL: Record<FeatureClass, string> = {
  poi: "POI",
  structural: "Structural",
  "interior-asset": "Interior",
  virtual: "Virtual",
  system: "System",
};

/**
 * `bag-drop-checkin` → `Bag Drop Checkin`. The taxonomy is kebab-case throughout and the dashboard
 * shows Title Case, so this is the whole of the transformation — no lookup table to drift.
 */
export function typeLabel(slug: string): string {
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/**
 * The taxonomy's own sprite sheet, which is public and versioned.
 *
 * Icons are named for the **subType** where one exists and the **mainType** otherwise — checked
 * against the live sheet: 22 of 27 types seen on the demo floor hit directly, and the rest fall
 * back cleanly (`wall`, `section` and `furniture` have no icon of their own).
 */
export const SPRITE_BASE =
  "https://pointrmapstorage.blob.core.windows.net/taxonomy/10.upcoming-rc/icons/sprites/sprite";

export interface SpriteEntry { x: number; y: number; width: number; height: number; pixelRatio?: number }
export type SpriteSheet = Record<string, SpriteEntry>;

/** Which sprite draws this type — subType first, then mainType, then nothing. */
export function spriteName(sheet: SpriteSheet | null, mainType: string, subType?: string): string | null {
  if (!sheet) return null;
  if (subType && sheet[subType]) return subType;
  if (sheet[mainType]) return mainType;
  return null;
}

/* ── what the map reports ──────────────────────────────────────────────────── */

/** One row under a level: a feature type and how many of it the floor has. */
export interface LevelTypeCount {
  mainType: string;
  subType?: string;
  count: number;
}

export interface ClassGroup {
  cls: FeatureClass;
  total: number;
  rows: LevelTypeCount[];
}

/**
 * Group the map's raw per-type counts the way the dashboard does.
 *
 * Rows are ordered by count, biggest first: a floor with 485 walls and 1 vending machine is
 * describing itself, and alphabetical order would bury that.
 */
/**
 * The words for a row — and **its mainType too when the label alone would be ambiguous**.
 *
 * `amenity-space/office` and `service-space/office` are different things that both render as
 * "Office", and the demo floor has both: the tree showed *Office 10* directly above *Office 8*,
 * which reads as a bug. Qualified only where it collides, so the common case stays short.
 */
export function rowLabel(row: LevelTypeCount, all: LevelTypeCount[]): string {
  const base = typeLabel(row.subType || row.mainType);
  const clash = all.some(
    (o) => o !== row && typeLabel(o.subType || o.mainType) === base && o.mainType !== row.mainType,
  );
  return clash ? `${base} · ${typeLabel(row.mainType)}` : base;
}

export function groupByClass(counts: LevelTypeCount[]): ClassGroup[] {
  const byClass = new Map<FeatureClass, LevelTypeCount[]>();
  for (const c of counts) {
    const cls = classOf(c.mainType, c.subType);
    if (cls === "system") continue;                 // plumbing, not content
    const list = byClass.get(cls) ?? [];
    list.push(c);
    byClass.set(cls, list);
  }
  return CLASS_ORDER.filter((cls) => byClass.has(cls)).map((cls) => {
    const rows = (byClass.get(cls) ?? []).sort((a, b) => b.count - a.count);
    return { cls, total: rows.reduce((n, r) => n + r.count, 0), rows };
  });
}
