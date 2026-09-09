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
 *    *structural*, while `circulation-space/elevator-lobby` is *poi* — which is why `classOf`
 *    takes both, and why a class filter has to filter ROWS. Four of the 43 mainTypes carry more
 *    than one class across their subtypes.
 * 2. **There are five classes, not the three the dashboard shows.** `system` (wayfinding nodes) and
 *    `interior-asset` (loose furniture) are real and simply aren't drawn as groups there.
 *
 * ⚠️ **Nothing here is a hand-kept table any more.** It reads `./taxonomyData`, which
 * `pnpm taxonomy:gen` writes from the published release. The judgements this app makes ON that data
 * — which mainTypes are not editable, which are system — stay here as explicit literals, because
 * they are product decisions and not readings. An unpublished type still falls back to `poi` rather
 * than vanishing: a level is better off showing a feature under a slightly wrong heading than not
 * at all.
 */

import { TYPES, TAXONOMY_VERSION, type TaxonomyType } from "./taxonomyData";
export { TAXONOMY_VERSION, TAXONOMY_SOURCE } from "./taxonomyData";

export type FeatureClass =
  | "poi"
  | "structural"
  | "virtual"
  | "system"
  | "interior-asset";

/**
 * **Every (mainType, subType) the taxonomy publishes, indexed two ways.**
 *
 * ⚠️ **This replaced three hand-kept caches on 2026-09-08** — class, category and suggested
 * properties, each a partial copy of the published taxonomy typed out by hand because the app
 * could not reach the service. They covered the 27 main types the demo floor happens to contain,
 * out of 43, and they were already wrong in places a reader could not see. `taxonomyData.ts` is
 * generated from the published file, so there is nothing left to drift.
 *
 * The two things the old caches taught, both still true and both now free:
 *
 * 1. **Class depends on the PAIR, not on `mainType`.** `circulation-space/walkway` is
 *    *structural* while `circulation-space/elevator-lobby` is *poi*, and `section` is split the
 *    same way. So the pair is looked up first and the main type is the fallback.
 * 2. **There are five classes, not the three the dashboard shows.** `system` and `interior-asset`
 *    are real and simply are not drawn as groups there.
 */
const BY_PAIR = new Map<string, TaxonomyType>();
const BY_MAIN = new Map<string, TaxonomyType>();
/** subType → its row, for the many call sites that hold a slug and no context. */
const BY_SLUG = new Map<string, TaxonomyType>();
for (const t of TYPES) {
  if (t.subType) BY_PAIR.set(`${t.mainType}/${t.subType}`, t);
  else BY_MAIN.set(t.mainType, t);
  const slug = t.subType || t.mainType;
  if (!BY_SLUG.has(slug)) BY_SLUG.set(slug, t);
}

/** The taxonomy row for a type, most specific first. `null` for a type it does not publish. */
export function typeRow(
  mainType: string,
  subType?: string,
): TaxonomyType | null {
  if (subType) {
    const pair = BY_PAIR.get(`${mainType}/${subType}`);
    if (pair) return pair;
  }
  return BY_MAIN.get(mainType) ?? null;
}

export function classOf(mainType: string, subType?: string): FeatureClass {
  const row = typeRow(mainType, subType);
  // An unknown type falls back to `poi` rather than vanishing — a level is better off showing a
  // feature under a slightly wrong heading than not at all.
  return (row?.class as FeatureClass) ?? "poi";
}

/** The order and words the dashboard uses. `system` is hidden — it is plumbing, not content. */
/**
 * The `mainType`s the map must NOT offer to edit — the floor plan itself rather than content
 * somebody curates (Olcay, 2026-08-14: hover highlight *"if editable"*).
 *
 * Expressed as the NEGATIVE set on purpose: `MAIN_CLASS` defaults anything it does not list to
 * `poi`, so the editable side is open-ended and cannot be enumerated, while this side is closed
 * and short. The map treats "has a fid and is not in here" as editable, which keeps the two in
 * step as the taxonomy grows.
 */
export const NON_EDITABLE_MAIN_TYPES: string[] = [
  "wall",
  "transition",
  "entrance-exit",
  "circulation-space",
  "virtual-obstacle",
  "wayfinding-network",
  "geofence",
  "positioning-device",
];

export const SYSTEM_MAIN_TYPES: string[] = [
  "wayfinding-network",
  "geofence",
  "positioning-device",
];

/**
 * ⚠️ **The taxonomy calls five more main types `system` than the list above does** — `blueprint`,
 * `building-outline`, `level-outline`, `site-outline` and `georeferencing-anchor`, plus `annotation`
 * which it splits between `system` and `virtual`. Adding them here would stop the map DRAWING
 * them, which is a product decision about what a floor looks like rather than a reading of the
 * taxonomy, so it is a question for the hand-off and not a change made in passing.
 */
export const TAXONOMY_SYSTEM_MAIN_TYPES: string[] = [
  ...new Set(TYPES.filter((t) => t.class === "system").map((t) => t.mainType)),
];

export const CLASS_ORDER: FeatureClass[] = [
  "poi",
  "structural",
  "interior-asset",
  "virtual",
];
export const CLASS_LABEL: Record<FeatureClass, string> = {
  poi: "POI",
  structural: "Structural",
  "interior-asset": "Interior",
  virtual: "Virtual",
  system: "System",
};

/**
 * **The taxonomy's own display name for a type slug**, with the mechanical kebab→Title Case rule
 * as the fallback for anything it does not publish.
 *
 * ⚠️ **41 of the 362 types were being mislabelled** by the mechanical rule alone — `atm` read as
 * *Atm*, `cctv` as *Cctv*, `mri-room` as *Mri Room*, `x-ray-room` as *X Ray Room*,
 * `food-beverage-space` as *Food Beverage Space*. The taxonomy has always carried the right words;
 * nothing here was reading them.
 *
 * A slug is enough: no two types in the taxonomy share a slug and disagree about its name (checked,
 * not assumed). Where the caller has the pair, `typeName` is the exact answer.
 */
export function typeLabel(slug: string): string {
  const row = BY_SLUG.get(slug);
  if (row?.displayName) return row.displayName;
  return slug
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ");
}

/** The display name for a type, given both halves — the precise form of `typeLabel`. */
export function typeName(mainType: string, subType?: string): string {
  const row = typeRow(mainType, subType);
  return row?.displayName || typeLabel(subType || mainType);
}

/** The taxonomy's own one-line explanation of a type — the ⓘ beside it in the picker. */
export function typeDescription(mainType: string, subType?: string): string {
  return typeRow(mainType, subType)?.description || "";
}

/**
 * **Every subType the taxonomy publishes for a main type**, in display order.
 *
 * ⚠️ **This is what the type picker offers now.** It used to offer only the subTypes the FLOOR
 * already contained, which meant a `section` on a floor with no other sections offered nothing at
 * all — the empty "—" in Olcay's screenshot of 2026-09-08. A content editor cannot classify a
 * feature from a list of what is already classified.
 */
export function subTypesOf(mainType: string): TaxonomyType[] {
  return TYPES.filter((t) => t.mainType === mainType && t.subType).sort(
    (a, b) => a.displayName.localeCompare(b.displayName),
  );
}

/**
 * Type search, over the name, the slug and the taxonomy's **`alsoKnownAs`** — so "food hall" finds
 * Food Court and "loo" finds a restroom. A list of 362 is only usable if you can type at it.
 */
export function searchTypes(rows: TaxonomyType[], q: string): TaxonomyType[] {
  const needle = q.trim().toLowerCase();
  if (!needle) return rows;
  /**
   * ⚠️ **Matched at word STARTS, not anywhere in the string.** A plain `includes` looked right
   * until a short word was typed: "loo" — which is genuinely one of the restroom's `alsoKnownAs`
   * — also returned Floor Outline, Blood Bank and Blood Draw, because "loo" sits inside "floor"
   * and "blood". Four of the five results were noise on a query aimed at one type.
   *
   * A multi-word needle ("food hall") is tested as a phrase instead, since its own space already
   * anchors it and splitting it would match each word separately.
   */
  const phrase = needle.includes(" ");
  const hit = (hay: string) => {
    const h = hay.toLowerCase();
    if (phrase) return h.includes(needle);
    return h.split(/[^a-z0-9]+/).some((w) => w.startsWith(needle));
  };
  return rows.filter(
    (t) =>
      hit(t.displayName) ||
      hit(t.subType || "") ||
      t.alsoKnownAs.some((a) => hit(a)),
  );
}

/** One `mainType` and the subtypes of it that survived the current filters. */
export interface TypeGroup {
  mainType: string;
  /** The taxonomy's own name for the mainType. */
  label: string;
  description: string;
  /** The class of the mainType's OWN row — not of its children, which may differ. */
  cls: FeatureClass;
  /**
   * Whether the mainType can be chosen on its own. 39 of the 43 publish a row with no subType;
   * the other four exist only as parents, and offering them would save a type that is not in the
   * taxonomy.
   */
  selectable: boolean;
  subTypes: TaxonomyType[];
}

/**
 * **The type picker's tree** — 43 groups over 362 rows, filtered by a query and a class.
 *
 * The picker is the one place a person meets the whole taxonomy, so the filtering rules matter more
 * than they look:
 *
 * ⚠️ **The class filter runs over ROWS, not mainTypes.** `circulation-space` holds both *poi* and
 * *structural* subtypes; filtering to Structural has to show that group with only its structural
 * children rather than all of it or none of it. Four mainTypes are mixed this way.
 *
 * ⚠️ **A query that matches a GROUP keeps all of its children.** Typing "retail" should open Retail
 * Space and show everything in it — filtering the children by the same needle would leave the group
 * that matched showing nothing, which reads as "no results" on the row you were aiming for.
 *
 * ⚠️ **System types are excluded by default.** They are written by the platform — a person picking
 * a type for a shop should not be offered `annotation`. `SYSTEM_MAIN_TYPES` is this app's judgement
 * and is deliberately not read from the taxonomy; see the note on it above.
 */
export function typeTree(opts?: {
  q?: string;
  cls?: FeatureClass | "all";
  includeSystem?: boolean;
}): TypeGroup[] {
  const q = (opts?.q ?? "").trim();
  const cls = opts?.cls ?? "all";
  const system = new Set(opts?.includeSystem ? [] : SYSTEM_MAIN_TYPES);

  const groups = new Map<string, TypeGroup>();
  for (const t of TYPES) {
    if (system.has(t.mainType)) continue;
    if (!groups.has(t.mainType))
      groups.set(t.mainType, {
        mainType: t.mainType,
        label: typeLabel(t.mainType),
        description: "",
        cls: "poi",
        selectable: false,
        subTypes: [],
      });
    const g = groups.get(t.mainType)!;
    if (t.subType) g.subTypes.push(t);
    else {
      // the mainType's own row: its name, its description, its class, and the fact it can be chosen
      g.label = t.displayName || g.label;
      g.description = t.description;
      g.cls = (t.class as FeatureClass) ?? "poi";
      g.selectable = true;
    }
  }

  const needle = q.toLowerCase();
  const out: TypeGroup[] = [];
  for (const g of groups.values()) {
    // A group matches on its own name or slug; its children match through `searchTypes`, which
    // also reads `alsoKnownAs` — "food hall" finds Food Court, "loo" finds a restroom.
    const groupMatches =
      !q ||
      g.label.toLowerCase().includes(needle) ||
      g.mainType.includes(needle);
    const inClass =
      cls === "all" ? g.subTypes : g.subTypes.filter((t) => t.class === cls);
    const kept = groupMatches ? inClass : searchTypes(inClass, q);
    const selfKept =
      g.selectable && (cls === "all" || g.cls === cls) && groupMatches;
    if (!kept.length && !selfKept) continue;
    out.push({
      ...g,
      selectable: selfKept,
      subTypes: kept
        .slice()
        .sort((a, b) => a.displayName.localeCompare(b.displayName)),
    });
  }
  return out.sort((a, b) => a.label.localeCompare(b.label));
}

/**
 * The taxonomy's own sprite sheet, which is public and versioned.
 *
 * Icons are named for the **subType** where one exists and the **mainType** otherwise — checked
 * against the live sheet: 22 of 27 types seen on the demo floor hit directly, and the rest fall
 * back cleanly (`wall`, `section` and `furniture` have no icon of their own).
 */
/**
 * ⚠️ **Pinned to the same release as the data, and derived rather than typed.** It used to read
 * `10.upcoming-rc` while `taxonomyData.ts` was pinned to 10.11.0 — a release candidate that can be
 * republished under its own name, so the artwork could change under a type list that could not.
 * That is the drift `pnpm taxonomy:gen` exists to prevent, sitting one constant away from it.
 *
 * Checked before switching: both sheets are 2046×588 with 633 frames and identical coordinates for
 * `restroom`, so the pin changes nothing today — which is the point at which it is safe to make.
 */
export const SPRITE_BASE = `https://pointrmapstorage.blob.core.windows.net/taxonomy/${TAXONOMY_VERSION}/icons/sprites/sprite`;

export interface SpriteEntry {
  x: number;
  y: number;
  width: number;
  height: number;
  pixelRatio?: number;
}
export type SpriteSheet = Record<string, SpriteEntry>;

/**
 * Which sprite draws this type — subType, then mainType, then **nothing**.
 *
 * ⚠️ **The sheet has no generic marker.** Asked for one (Olcay, 2026-08-12), I checked: all 408 of
 * its 32×32 frames are specific type glyphs, and the nearest candidate — `landmark-attraction` —
 * is a landmark icon, not a neutral one. Labelling a wall with it would be worse than labelling it
 * with nothing. So a type with no icon of its own falls back to the DS's `marker-pin-01`, which is
 * genuinely neutral; `wall`, `section` and `furniture` are the ones that need it.
 */
export function spriteName(
  sheet: SpriteSheet | null,
  mainType: string,
  subType?: string,
): string | null {
  if (!sheet) return null;
  if (subType && sheet[subType]) return subType;
  if (sheet[mainType]) return mainType;
  return null;
}

/* ── what a type is EXPECTED to carry ──────────────────────────────────────── */

/**
 * **What this type is expected to carry**, and **which category it belongs to** — both read
 * straight off the published taxonomy now (`taxonomyData.ts`), where they used to be hand-typed
 * caches covering the 27 main types the demo floor happens to contain out of 43.
 *
 * `suggestedProperties` is what the product expects a feature of this type to carry
 * (`food-beverage-space` → `cuisines · dietaryOptions · openingHours · priceRange …`). The vector
 * tiles carry none of them: they live in the **content API**, which this prototype does not call.
 * So the panel shows them as *expected and not loaded* rather than inventing values — the same
 * honesty as "as loaded" on the counts.
 *
 * ⚠️ **Plenty of types legitimately suggest NOTHING** — `wall`, `furniture`, `operational-space`,
 * `virtual-obstacle` all come back empty. That is a real answer ("this type expects no extra
 * properties"), not a gap, and the panel says so in words.
 *
 * ⚠️ **The taxonomy sometimes suggests a VALUE, not just a name** — `transition/ramp` carries
 * `isWheelchairAccessible: true`. Names only here; a read-only card naming the property is the
 * useful half, and a "suggested default" is a claim about content this prototype cannot check.
 */
export function suggestedFor(
  mainType: string,
  subType?: string,
): string[] | null {
  const row = typeRow(mainType, subType);
  return row ? row.suggested : null;
}

export function categoryOf(mainType: string, subType?: string): string | null {
  const row = typeRow(mainType, subType);
  return row?.category || null;
}

export function categoryLabel(cat: string): string {
  return cat.charAt(0) + cat.slice(1).toLowerCase();
}

/* ── what the map reports ──────────────────────────────────────────────────── */

/** One row under a level: a feature type and how many of it the floor has. */
export interface LevelTypeCount {
  mainType: string;
  subType?: string;
  count: number;
  /**
   * The individual features, capped by the map at 60 — `count` stays exact, so a type with more
   * says so rather than quietly showing a short list. An empty name is a real, unnamed feature:
   * walls and conveyor belts mostly have none, and hiding them would misreport the floor.
   *
   * `fid` is the SDK's own feature id, which is what lets a row centre the map on itself.
   */
  names?: { name: string; fid: string }[];
}

export interface ClassGroup {
  cls: FeatureClass;
  /**
   * The heading, already decided.
   *
   * It used to be looked up from `CLASS_LABEL[g.cls]` where the tree draws it, which works exactly
   * as long as every group IS a class. The Wayfinding Network section splits one class into two
   * headings — *Network* and *Transitions* — so the group has to be able to name itself.
   */
  label: string;
  total: number;
  rows: LevelTypeCount[];
}

/**
 * Which section of the left rail is on screen.
 *
 * Named for the `mainType` each section owns rather than for the rail's wording, because the type
 * is what both halves need: the map hides every system type **except** this one, and the tree lists
 * this one's rows. `content` owns no system type, so on Map Content all three stay hidden.
 */
export type MapSection =
  | "content"
  | "geofence"
  | "wayfinding-network"
  | "positioning-device";

/**
 * What the map may not draw for this section — Olcay, 2026-08-16: *"Wayfinding Network should show
 * in when wayfinding network is selected. Geofences when geofence selected and beacons when beacon
 * selected."*
 *
 * That sentence, whole, in one line: every system type except the one whose section you are in.
 */
export function hiddenForSection(section: MapSection): string[] {
  return SYSTEM_MAIN_TYPES.filter((t) => t !== section);
}

/**
 * The wayfinding network's one **network** subType. Everything else it has is a transition.
 *
 * Olcay, 2026-08-16: *"Wayfinding Network is a complicated structure with network nodes and
 * transition nodes."* The taxonomy bears that out and names the pieces: `path-node` is the network
 * itself, while `elevator-node`, `escalator-node`, `stairs-node`, `custom-transition` and
 * `building-entrance-exit` are all ways OFF this floor.
 *
 * Stated as "the network one", not as a list of the transitions, and that direction matters: a
 * transition subType added to the taxonomy tomorrow lands under *Transitions* by itself, which is
 * where it belongs. The reverse phrasing would quietly file it as network.
 */
export const NETWORK_SUBTYPE = "path-node";
export const isTransitionNode = (row: { mainType: string; subType?: string }) =>
  row.mainType === "wayfinding-network" && row.subType !== NETWORK_SUBTYPE;

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
    (o) =>
      o !== row &&
      typeLabel(o.subType || o.mainType) === base &&
      o.mainType !== row.mainType,
  );
  return clash ? `${base} · ${typeLabel(row.mainType)}` : base;
}

export function groupByClass(counts: LevelTypeCount[]): ClassGroup[] {
  const byClass = new Map<FeatureClass, LevelTypeCount[]>();
  for (const c of counts) {
    const cls = classOf(c.mainType, c.subType);
    if (cls === "system") continue; // plumbing, not content
    const list = byClass.get(cls) ?? [];
    list.push(c);
    byClass.set(cls, list);
  }
  return CLASS_ORDER.filter((cls) => byClass.has(cls)).map((cls) => {
    const rows = (byClass.get(cls) ?? []).sort((a, b) => b.count - a.count);
    return {
      cls,
      label: CLASS_LABEL[cls],
      total: rows.reduce((n, r) => n + r.count, 0),
      rows,
    };
  });
}

/** One group, from rows already chosen. Empty groups are dropped by the caller, not built here. */
function group(
  cls: FeatureClass,
  label: string,
  rows: LevelTypeCount[],
): ClassGroup {
  return {
    cls,
    label,
    rows: [...rows].sort((a, b) => b.count - a.count),
    total: rows.reduce((n, r) => n + r.count, 0),
  };
}

/**
 * The tree's groups for the section on screen.
 *
 * On **Map Content** this is `groupByClass` exactly as it always was — by taxonomy class, with the
 * system types dropped as plumbing.
 *
 * On a **system section** the tree lists that section's own rows, which are otherwise invisible
 * everywhere in the app. The wayfinding network gets two headings rather than one, because Olcay's
 * *"network nodes and transition nodes"* is a real distinction in the data and a flat list of six
 * subTypes buries it: a `path-node` is a step along this floor, and everything else is a way off it.
 */
export function groupForSection(
  counts: LevelTypeCount[],
  section: MapSection,
): ClassGroup[] {
  if (section === "content") return groupByClass(counts);
  const mine = counts.filter((c) => c.mainType === section);
  if (!mine.length) return [];
  if (section !== "wayfinding-network")
    return [group("system", CLASS_LABEL.system, mine)];
  const network = mine.filter((r) => !isTransitionNode(r));
  const transitions = mine.filter(isTransitionNode);
  return [
    network.length ? group("system", "Network", network) : null,
    transitions.length ? group("system", "Transitions", transitions) : null,
  ].filter((g): g is ClassGroup => !!g);
}
