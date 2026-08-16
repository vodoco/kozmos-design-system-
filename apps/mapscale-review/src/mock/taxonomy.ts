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

export type FeatureClass =
  | "poi"
  | "structural"
  | "virtual"
  | "system"
  | "interior-asset";

/** Read from the taxonomy service (`class` per mainType, where the whole mainType agrees). */
const MAIN_CLASS: Record<string, FeatureClass> = {
  wall: "structural",
  transition: "structural",
  "entrance-exit": "structural",
  "circulation-space": "structural",
  "virtual-obstacle": "virtual",
  /**
   * The three `system` types, and the reason this table now names all of them.
   *
   * Each belongs to its **own section of the dashboard** — the left rail's *Wayfinding Network*,
   * *Geofences* and *IoT Devices* — and none of them is map content. Read from the taxonomy
   * service, 2026-08-16, together with the layers that draw them:
   *
   * | type | subTypes | style layers |
   * |---|---|---|
   * | `wayfinding-network` | path-node · building-entrance-exit · custom-transition · elevator-node · escalator-node · stairs-node | `symbol_wayfinding-network_ptr` |
   * | `geofence` | gps-geofence · beacon-geofence | `fill_geofence_ptr` · `fill_geofence_hatch_ptr` · `symbol_geofence_ptr` |
   * | `positioning-device` | beacon | `symbol_positioning-device_ptr` |
   *
   * All three are `isPoi=false` and have **no sprite of their own**, so every one of them falls
   * through the icon cascade to `default-poi` — which is why a floor's several hundred path-nodes
   * and its geofence pins arrive as the same anonymous blue marker, in quantity.
   */
  "wayfinding-network": "system",
  geofence: "system",
  "positioning-device": "system",
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
  // `section` is a POI grouping, except where the area is a hole in the floor rather than a place
  // you can go — those two are structural.
  "section/construction": "structural",
  "section/no-access": "structural",
};

export function classOf(mainType: string, subType?: string): FeatureClass {
  if (subType && SUBTYPE_CLASS[`${mainType}/${subType}`])
    return SUBTYPE_CLASS[`${mainType}/${subType}`];
  return MAIN_CLASS[mainType] ?? "poi";
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
export const NON_EDITABLE_MAIN_TYPES: string[] = Object.entries(MAIN_CLASS)
  .filter(([, cls]) => cls !== "poi" && cls !== "interior-asset")
  .map(([mainType]) => mainType);

/**
 * The `mainType`s the map must NOT **draw** on Map Content — Olcay, 2026-08-16: *"Wayfinding
 * Network should show in when wayfinding network is selected. Geofences when geofence selected and
 * beacons when beacon selected."*
 *
 * ⚠️ **The tree and the map had disagreed about what map content IS.** `groupByClass` has always
 * dropped `system` — *plumbing, not content* — while the map went on drawing every one of them, so
 * a floor arrived with several hundred wayfinding path-nodes and its geofence zones painted over
 * the content the screen is actually for, none of which had a row anywhere in the panel beside it.
 * The tree was right. This is the same sentence said to the map.
 *
 * Derived from `MAIN_CLASS`, deliberately, exactly as `NON_EDITABLE_MAIN_TYPES` is: each of these
 * belongs to its own section of the left rail, and a section that becomes real takes its own type
 * **out** of this list rather than adding a lookup somewhere new.
 *
 * ⚠️ Not the same channel as `editabletypes`, and they must not be merged. That one says *may I
 * touch this?* and is the hook layer-locking will hang off; this one says *may I draw it at all?*
 * — and drawing is the stronger claim, because a hidden layer is not in `queryRenderedFeatures` at
 * all, so it cannot be hovered, clicked or selected either.
 */
export const SYSTEM_MAIN_TYPES: string[] = Object.entries(MAIN_CLASS)
  .filter(([, cls]) => cls === "system")
  .map(([mainType]) => mainType);

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
 * The taxonomy's `category` and `suggestedProperties` per type — the honest shape of a POI card.
 *
 * `suggestedProperties` is what the product expects a feature of this type to carry
 * (`food-beverage-space` → `cuisines · dietaryOptions · openingHours · priceRange …`). The vector
 * tiles carry none of them: they live in the **content API**, which this prototype does not call.
 * So the panel shows them as *expected and not loaded* rather than inventing values — the same
 * honesty as "as loaded" on the counts.
 *
 * ⚠️ **Keyed by `mainType`, and that is a measured simplification, not a shortcut.** Class depends
 * on the *pair* (see `SUBTYPE_CLASS`), but suggested properties are overwhelmingly constant across
 * a mainType's subTypes — all 17 `circulation-space` subTypes suggest the same three, all 18
 * `retail-space` subTypes the same six. Only the genuine exceptions are listed below. Read from the
 * taxonomy service, same as the class table, and carrying the same limit: **it is a cache of a
 * service the app can't reach at runtime.** An unknown type reports *no* suggestions rather than a
 * borrowed list — claiming a wall should have opening hours would be worse than saying nothing.
 *
 * ⚠️ **Plenty of types legitimately suggest NOTHING** — `wall`, `furniture`, `operational-space`,
 * `virtual-obstacle` all come back empty. That is a real answer ("this type expects no extra
 * properties"), not a gap in this table, and the panel says so in words.
 */
const MAIN_SUGGESTED: Record<string, string[]> = {
  "food-beverage-space": [
    "cuisines",
    "description",
    "dietaryOptions",
    "hasAlcoholService",
    "hasWifi",
    "isPetFriendly",
    "phoneNumber",
    "priceRange",
    "serviceOptions",
    "websiteUrl",
  ],
  "retail-space": [
    "description",
    "hasAssistance",
    "isAnchor",
    "isFeatured",
    "productTypes",
    "websiteUrl",
  ],
  "service-space": [
    "description",
    "hasAssistance",
    "openingHours",
    "phoneNumber",
    "serviceTypes",
    "websiteUrl",
  ],
  "restroom-space": [
    "genderDesignation",
    "hasChangingFacilities",
    "hasLockers",
    "hasRestrooms",
    "isFamilyFriendly",
    "isWheelchairAccessible",
  ],
  "amenity-space": ["hasAssistance", "openingHours", "serviceTypes"],
  "activity-space": [
    "accessRestrictions",
    "crowdLevel",
    "description",
    "hasChangingFacilities",
    "occupancyStatus",
    "openingHours",
    "sportTypes",
  ],
  "entrance-exit": [
    "description",
    "hasAssistance",
    "isWheelchairAccessible",
    "waitTime",
  ],
  "circulation-space": ["hasWifi", "isPetFriendly", "isWheelchairAccessible"],
  "faith-worship-space": ["description", "genderDesignation", "hasAssistance"],
  "entertainment-space": ["accessRestrictions", "description"],
  equipment: ["description", "languageSupport"],
  "social-space": ["description", "hasWifi"],
  transition: ["isWheelchairAccessible"],
  "transportation-space": ["hasAssistance"],
  "security-space": ["description"],
  "parking-space": ["description"],
  "wellness-space": ["genderDesignation"],
  "work-space": ["description"],
  // `section` groups a floor into named areas (Customs & Immigration, Food Court, Terminal). Missed
  // on the first sweep, which is how B2's *F&J Departure Hall Security Check-in* came to report
  // "isn't in the cached taxonomy" — spotted by Olcay, 2026-08-12.
  section: ["description", "hasRestrooms"],
  // Deliberately empty — the service returns no suggestions for these.
  wall: [],
  furniture: [],
  "operational-space": [],
  "medical-space": [],
  "virtual-obstacle": [],
  "wayfinding-network": [],
};

/** The handful of subTypes whose suggestions genuinely differ from their mainType's. */
const SUBTYPE_SUGGESTED: Record<string, string[]> = {
  "service-space/lounge": [
    "accessRestrictions",
    "description",
    "hasAssistance",
    "openingHours",
    "phoneNumber",
    "serviceTypes",
    "websiteUrl",
  ],
  "activity-space/play-area": [
    "accessRestrictions",
    "ageRestriction",
    "crowdLevel",
    "description",
    "hasChangingFacilities",
    "occupancyStatus",
    "openingHours",
    "sportTypes",
  ],
};

/** The taxonomy's own `category` — a second axis beside `class`, and the one a POI card names. */
const MAIN_CATEGORY: Record<string, string> = {
  "food-beverage-space": "COMMERCIAL",
  "retail-space": "COMMERCIAL",
  "service-space": "SERVICES",
  "transportation-space": "SERVICES",
  "parking-space": "SERVICES",
  "restroom-space": "FACILITIES",
  "amenity-space": "FACILITIES",
  equipment: "FACILITIES",
  "operational-space": "OPERATIONS",
  "activity-space": "RECREATION",
  "social-space": "RECREATION",
  "entertainment-space": "GATHERINGS",
  "medical-space": "CARE",
  "wellness-space": "CARE",
  "faith-worship-space": "WORK",
  "work-space": "WORK",
  "circulation-space": "ACCESS",
  transition: "ACCESS",
  "entrance-exit": "ACCESS",
  "security-space": "ACCESS",
  wall: "ACCESS",
  furniture: "ACCESS",
  "wayfinding-network": "ACCESS",
  "virtual-obstacle": "SYSTEM",
};

/**
 * Where a subType is filed under a different category from its mainType.
 *
 * `section` is the one that really needs this: the mainType has **no** category of its own, and its
 * subTypes scatter across four (a food court is COMMERCIAL, a terminal is SERVICES, customs is
 * ACCESS, an exhibit hall is GATHERINGS).
 */
const SUBTYPE_CATEGORY: Record<string, string> = {
  "retail-space/returns-desk": "OPERATIONS",
  "retail-space/personal-shopper-assist": "SERVICES",
  "amenity-space/pet-relief": "WORK",
  "restroom-space/mothers-room": "CARE",
  "restroom-space/baby-care-hygiene": "CARE",
  "section/customs-immigration": "ACCESS",
  "section/aisle": "ACCESS",
  "section/construction": "ACCESS",
  "section/no-access": "ACCESS",
  "section/food-court": "COMMERCIAL",
  "section/terminal": "SERVICES",
  "section/exhibit-hall": "GATHERINGS",
};

/**
 * What this type is expected to carry. `null` means *we don't know* (an unknown type); an **empty
 * array** means *the taxonomy suggests nothing*, which is a different and equally honest answer.
 *
 * ⚠️ The service sometimes suggests a **value**, not just a name — `transition/ramp` returns
 * `isWheelchairAccessible:true` and `escalator` returns `:false`. Names only here; a read-only card
 * naming the property is the useful half, and a "suggested default" is a claim about content this
 * prototype has no way to check.
 */
export function suggestedFor(
  mainType: string,
  subType?: string,
): string[] | null {
  if (subType && SUBTYPE_SUGGESTED[`${mainType}/${subType}`])
    return SUBTYPE_SUGGESTED[`${mainType}/${subType}`];
  return MAIN_SUGGESTED[mainType] ?? null;
}

export function categoryOf(mainType: string, subType?: string): string | null {
  if (subType && SUBTYPE_CATEGORY[`${mainType}/${subType}`])
    return SUBTYPE_CATEGORY[`${mainType}/${subType}`];
  return MAIN_CATEGORY[mainType] ?? null;
}

/**
 * `COMMERCIAL` → `Commercial`. The taxonomy shouts its categories; the dashboard doesn't.
 */
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
