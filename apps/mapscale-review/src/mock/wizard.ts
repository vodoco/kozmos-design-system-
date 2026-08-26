/**
 * The Building wizard's contract (v9 section 10059:102926 — the five steps: Metadata · Level
 * Manager · Floor-plan Alignment · Fine-tune Building Placement · Preview). Copy is lifted from
 * the frames; the creation-review data feeds the per-level review (decision: the wizard's review
 * confirms MapScale's guesses — there is no published baseline to diff, so the
 * changelog/traffic-light only arms from the second floor-plan onward).
 */

import { SIMILARITY_WARN, type Change } from "./diff";

export const WIZARD_STEPS = [
  {
    key: "metadata",
    n: 1,
    title: "Metadata",
    blurb:
      "Provide essential information about the building such as name and identifiers.",
  },
  {
    key: "levels",
    n: 2,
    title: "Level Manager",
    blurb:
      "Manage and organize the different levels of the building. Upload one or more floorplan files to create levels for your building.",
  },
  {
    key: "align",
    n: 3,
    title: "Floor-plan Alignment",
    blurb:
      "Align and adjust the uploaded floor plans to ensure they are correctly positioned relative to each other.",
  },
  {
    key: "finetune",
    n: 4,
    title: "Fine-tune Building Placement",
    blurb:
      "Select one of the floor plans and accurately place and orient the building on the globe for georeferencing.",
  },
  {
    key: "preview",
    n: 5,
    title: "Preview",
    blurb:
      "AI Mapping has created meaningful indoor maps. Review and finalize before publishing.",
  },
] as const;

export type WizardStepKey = (typeof WIZARD_STEPS)[number]["key"];

/** The Level Manager dropzone's own words (frame 18833:214839). */
export const LEVEL_DROP_COPY = {
  title: "Drag & Drop or browse",
  detail:
    "to upload one or more floor-plan files to create levels for your building.",
  types: "Supported File Types: GeoJSON & DWG/DXF, PDF (experimental)",
};

/** Alignment step copy (band at y≈4020 of the 16384px section render). */
export const ALIGN_COPY = {
  reference: "Reference Level",
  referenceHint: "Choose a reference level for other levels to align to.",
  toAlign: "Level to Align",
  toAlignHint: "Choose a level to align with your reference level.",
  chip: "Floor-plan Alignment",
  confirmTip: "Confirm or edit the alignment of floorplans",
  gateTip:
    "To be able to proceed to the next step please make sure all floorplans are aligned to eachother.",
  skip: "Skip this step for now",
};

/** Fine-tune (2Dot Align georeference) copy. */
export const FINETUNE_COPY = {
  chip: "Fine-tune Building Placement",
  toast: "Grab anchors to align floorplan on Earth.",
  anchorsTitle: "Anchor Placement Options",
  anchorsDetail:
    "Adjust your anchors' positions to align the floor-plan data on Earth.",
  pinned: "Anchors Pinned on the Floorplan",
  referenceHint:
    'To choose a reference level, go to "Floor-plan Alignment" and update it there.',
  skip: "Skip this step for now",
};

/** The Preview step's three tiles. The NUMBERS are derived per level — only the words live here. */
export const PREVIEW_LABELS = {
  surfaceUnit: "m²",
  surfaceLabel: "Mapped Surface",
  durationLabel: "Total Duration",
  confidenceLabel: "Confidence Level",
};

/* ── what MapScale left on each level ─────────────────────────────────────── */

/**
 * **Issues belong to levels** (Olcay, 2026-08-11 — the one structural change §18 asked for).
 *
 * Every seeded issue used to carry the same hardcoded `where: "4F · Departures Level"`, which made
 * the wizard's review a single flat list about a floor that may not even exist in the building
 * being created. A `levelIndex` is what makes per-level counts, per-level state and derived
 * building totals possible at all — everything else here falls out of it.
 */
export interface CreationIssue {
  id: string;
  group: "metadata" | "feature-type";
  name: string;
  category: string;
  levelIndex: number;
  /**
   * MapScale's own confidence in this guess, 0–1.
   *
   * **The threshold is already in the repo**: `SIMILARITY_WARN` (0.7) is what turns a low-confidence
   * match into a warning in the *update* flow, and a guess below it is what becomes an issue here.
   * So "high-confidence levels don't require review" and "a low-similarity change is a warning" are
   * one rule with one knob, not two parallel inventions.
   */
  confidence: number;
}

/**
 * The guesses MapScale makes — the frame's own five metadata items and two feature-type ones
 * (10059:102926's "Resolve Potential Issues" page). A catalogue, not a list: levels draw from it,
 * so no two levels in a building's first pass show the same name.
 */
const ISSUE_CATALOGUE: {
  group: CreationIssue["group"];
  name: string;
  category: string;
  confidence: number;
}[] = [
  {
    group: "metadata",
    name: "Fast-Track Security Checkpoint Alpha",
    category: "Aviation Services",
    confidence: 0.52,
  },
  {
    group: "metadata",
    name: "Baggage Claim Assistance Desk B",
    category: "Aviation Services",
    confidence: 0.61,
  },
  {
    group: "metadata",
    name: "Passport Control Fast Lane - International Gates",
    category: "Customs And Immigration",
    confidence: 0.44,
  },
  {
    group: "metadata",
    name: "Airline Lounge Reception - Elite Members",
    category: "Aviation Services",
    confidence: 0.58,
  },
  {
    group: "metadata",
    name: "Starbucks",
    category: "Coffee Shops",
    confidence: 0.66,
  },
  {
    group: "feature-type",
    name: "Unlabeled polygon near Gate B14",
    category: "Unknown",
    confidence: 0.31,
  },
  {
    group: "feature-type",
    name: "Duplicate wall segment, north concourse",
    category: "Structure",
    confidence: 0.49,
  },
];

/**
 * What a MapScale run leaves on one level, cycled by the level's **ordinal in the building**
 * (bottom-up), not by its index — a building's levels can be numbered anything.
 *
 * The pattern is chosen so a five-level building reproduces the frame's three headline numbers
 * exactly — 48,553 m², 45 min, 92% — with every one of them now *derived*: the surface is the sum,
 * the duration is the sum, and the confidence is the **area-weighted** mean (§18's assumption: a
 * 200 m² plant room must not drag down a 40,000 m² concourse). Change a level and all three move,
 * which is the whole point of the change; they used to be three string constants.
 *
 * `issues` is how many of the level's guesses fall below `SIMILARITY_WARN`. The third entry is
 * **zero on purpose** — a level with nothing to confirm is creation's equivalent of Green
 * auto-publishing, and the demo needs one to show it being skipped rather than reviewed.
 */
const LEVEL_RESULTS = [
  { areaSqm: 12400, confidencePct: 89, issues: 3 },
  { areaSqm: 9850, confidencePct: 94, issues: 2 },
  { areaSqm: 7600, confidencePct: 97, issues: 0 },
  { areaSqm: 11200, confidencePct: 90, issues: 1 },
  { areaSqm: 7503, confidencePct: 92, issues: 1 },
];

/**
 * The one level whose run fails (cause C — the engine couldn't read the file).
 *
 * A **demo seam, not a rule**: the real trigger is the job's own validation failing, which the mock
 * has no way to know from a file name. It sits at the sixth level so the ordinary one-to-five-level
 * demos never trip it, and a six-file drop demonstrates the failure path on purpose.
 */
const FAILING_ORDINAL = 5;

export interface LevelResult {
  areaSqm: number;
  durationMin: number;
  confidencePct: number;
  /** True when MapScale couldn't process the file at all (red cause C). Nothing was mapped. */
  failed: boolean;
}

/** MapScale's per-level output. Deterministic in the level's ordinal — no clock, no randomness. */
export function levelResult(ordinal: number): LevelResult {
  if (ordinal === FAILING_ORDINAL)
    return { areaSqm: 0, durationMin: 0, confidencePct: 0, failed: true };
  const r = LEVEL_RESULTS[ordinal % LEVEL_RESULTS.length];
  return {
    areaSqm: r.areaSqm,
    // Bigger floors take longer — the divisor is tuned so the five-level case lands the frame's
    // 45 min. Derived rather than declared, like the other two tiles.
    durationMin: Math.max(1, Math.round(r.areaSqm / 1075)),
    confidencePct: r.confidencePct,
    failed: false,
  };
}

/** How many issues this level's run left behind. Zero means the level is genuinely Ready. */
export function levelIssueCount(ordinal: number): number {
  if (ordinal === FAILING_ORDINAL) return 0;
  return LEVEL_RESULTS[ordinal % LEVEL_RESULTS.length].issues;
}

/** Where this level's issues start in the catalogue, so a building's levels don't repeat names. */
function catalogueOffset(ordinal: number): number {
  let n = 0;
  for (let i = 0; i < ordinal; i++) n += levelIssueCount(i);
  return n;
}

/**
 * One level's issues.
 *
 * Ids are keyed by **level index** (`create-{index}-{n}`), which is what makes a decision survive
 * leaving the review and coming back — and, on Save, what lets the created level's editor find the
 * flags again through the store. Renumbering a level in the Level Manager after reviewing it
 * therefore resets that level's decisions: rare, and arguably right, since you have changed which
 * floor they were about.
 */
export function creationIssuesFor(
  ordinal: number,
  levelIndex: number,
): CreationIssue[] {
  const count = levelIssueCount(ordinal);
  const from = catalogueOffset(ordinal);
  return Array.from({ length: count }, (_, i) => {
    const t = ISSUE_CATALOGUE[(from + i) % ISSUE_CATALOGUE.length];
    return { id: `create-${levelIndex}-${i}`, levelIndex, ...t };
  });
}

/**
 * A level's issues as CHANGES, so the wizard's review IS the Manual Review screen (Olcay,
 * 2026-08-11: "it should be what we've built as user review — exactly the same"). Metadata guesses
 * ride as `metadata` rows, feature-type ones as `geometry`; every row wears the `low-confidence`
 * warning — that is what a guess below the floor is.
 *
 * The names are MapScale's own output for a NEW building, so they don't resolve on the demo map
 * (the same honest limit as reviewing a non-B2 level; `bindToFloor` re-points what it can).
 */
export function creationChangesFor(
  level: { index: number; short: string; long: string },
  ordinal: number,
): Change[] {
  return creationIssuesFor(ordinal, level.index).map((i) => ({
    id: i.id,
    name: i.name,
    type:
      i.group === "metadata" ? ("metadata" as const) : ("geometry" as const),
    kind: i.category.toLowerCase().replace(/\s+/g, "-"),
    detail: `${i.category} · ${level.short} · ${level.long}`,
    details:
      i.group === "metadata"
        ? [
            `MapScale guessed the name — confirm or correct it.`,
            `Confidence ${Math.round(i.confidence * 100)}% (below the ${Math.round(SIMILARITY_WARN * 100)}% floor).`,
          ]
        : [
            `MapScale couldn't classify this feature — confirm what it is.`,
            `Confidence ${Math.round(i.confidence * 100)}% (below the ${Math.round(SIMILARITY_WARN * 100)}% floor).`,
          ],
    warning: "low-confidence" as const,
  }));
}

/* ── the building's own numbers, summed from its levels ───────────────────── */

export interface BuildingStats {
  surfaceSqm: number;
  /** Formatted with thousands separators, the way the tile shows it. */
  surface: string;
  durationMin: number;
  duration: string;
  confidencePct: number;
  confidence: string;
}

/**
 * The three Preview tiles — **derived sums, not constants** (§18).
 *
 * Failed levels are excluded from all three: nothing was mapped, so counting a zero would drag the
 * building's confidence down for a floor MapScale never read.
 */
export function buildingStats(ordinals: number[]): BuildingStats {
  const rs = ordinals.map(levelResult).filter((r) => !r.failed);
  const surfaceSqm = rs.reduce((n, r) => n + r.areaSqm, 0);
  const durationMin = rs.reduce((n, r) => n + r.durationMin, 0);
  const confidencePct = surfaceSqm
    ? Math.round(
        rs.reduce((n, r) => n + r.areaSqm * r.confidencePct, 0) / surfaceSqm,
      )
    : 0;
  return {
    surfaceSqm,
    surface: surfaceSqm.toLocaleString("en-US"),
    durationMin,
    duration:
      durationMin >= 60
        ? `${Math.floor(durationMin / 60)} h ${durationMin % 60} min`
        : `${durationMin} min`,
    confidencePct,
    confidence: `${confidencePct}%`,
  };
}

/* ── per-level review state ───────────────────────────────────────────────── */

/**
 * What a level is waiting for — **the editor's vocabulary, not a new one** (§18).
 *
 * `in-review` is deliberately the same word the update flow uses for a part-way save, and for the
 * same reason: Olcay ruled it explicitly — *"similar to draft but we don't want to say draft"*.
 * `ready` is kept but has to be **earned**: it now means genuinely zero issues, where it used to be
 * printed on every finished level beside the note "Ready — review in Preview" — a level whose
 * MapScale guesses nobody had confirmed, pointing at a Preview that didn't distinguish levels.
 */
export type LevelReviewState =
  | "mapping"
  | "failed"
  | "ready"
  | "awaiting"
  | "in-review"
  | "reviewed";

export function levelStateLabel(
  state: LevelReviewState,
  issues: number,
  edited: number,
): string {
  switch (state) {
    case "mapping":
      return "Mapping";
    case "failed":
      return "Couldn't process this floor-plan";
    case "ready":
      return "Ready — no issues found";
    case "awaiting":
      return `Awaiting your review · ${issues} issue${issues === 1 ? "" : "s"}`;
    case "in-review":
      return "In review";
    case "reviewed":
      // ⚠️ **`flagged` until 2026-08-25.** It counted rows deferred; this counts rows *fixed*, which
      // is the opposite kind of fact — worth saying because the level went live carrying somebody's
      // own values, not because anything is outstanding.
      return edited ? `Reviewed · ${edited} edited` : "Reviewed";
  }
}

/** Turn "L3-EK-lounges.dwg" into a presentable level name. */
export function nameFromFile(file: string): string {
  const base = file
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .trim();
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}
