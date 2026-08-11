/**
 * The Building wizard's contract (v9 section 10059:102926 — the five steps: Metadata · Level
 * Manager · Floor-plan Alignment · Fine-tune Building Placement · Preview). Copy is lifted from
 * the frames; the creation-review data feeds the Resolve Potential Issues page (decision: the
 * wizard's review confirms MapScale's guesses — there is no published baseline to diff, so the
 * changelog/traffic-light only arms from the second floor-plan onward).
 */

export const WIZARD_STEPS = [
  { key: "metadata", n: 1, title: "Metadata", blurb: "Provide essential information about the building such as name and identifiers." },
  { key: "levels", n: 2, title: "Level Manager", blurb: "Manage and organize the different levels of the building. Upload one or more floorplan files to create levels for your building." },
  { key: "align", n: 3, title: "Floor-plan Alignment", blurb: "Align and adjust the uploaded floor plans to ensure they are correctly positioned relative to each other." },
  { key: "finetune", n: 4, title: "Fine-tune Building Placement", blurb: "Select one of the floor plans and accurately place and orient the building on the globe for georeferencing." },
  { key: "preview", n: 5, title: "Preview", blurb: "AI Mapping has created meaningful indoor maps. Review and finalize before publishing." },
] as const;

export type WizardStepKey = (typeof WIZARD_STEPS)[number]["key"];

/** The Level Manager dropzone's own words (frame 18833:214839). */
export const LEVEL_DROP_COPY = {
  title: "Drag & Drop or browse",
  detail: "to upload one or more floor-plan files to create levels for your building.",
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
  gateTip: "To be able to proceed to the next step please make sure all floorplans are aligned to eachother.",
  skip: "Skip this step for now",
};

/** Fine-tune (2Dot Align georeference) copy. */
export const FINETUNE_COPY = {
  chip: "Fine-tune Building Placement",
  toast: "Grab anchors to align floorplan on Earth.",
  anchorsTitle: "Anchor Placement Options",
  anchorsDetail: "Adjust your anchors' positions to align the floor-plan data on Earth.",
  pinned: "Anchors Pinned on the Floorplan",
  referenceHint: "To choose a reference level, go to \"Floor-plan Alignment\" and update it there.",
  skip: "Skip this step for now",
};

/** The Preview step's MapScale result (v9's numbers, verbatim from the frame). */
export const PREVIEW_STATS = {
  surface: "48,553",
  surfaceUnit: "m²",
  surfaceLabel: "Mapped Surface",
  duration: "45 min",
  durationLabel: "Total Duration",
  confidence: "92%",
  confidenceLabel: "Confidence Level",
};

export interface CreationIssue {
  id: string;
  group: "metadata" | "feature-type";
  name: string;
  category: string;
  where: string;
  resolved?: boolean;
}

/**
 * "Resolve Potential Issues" — MapScale's guesses awaiting confirmation (the wizard's review
 * sequence). The five metadata items are the frame's own; counts scale from here.
 */
export const CREATION_ISSUES: CreationIssue[] = [
  { id: "i1", group: "metadata", name: "Fast-Track Security Checkpoint Alpha", category: "Aviation Services", where: "4F · Departures Level" },
  { id: "i2", group: "metadata", name: "Baggage Claim Assistance Desk B", category: "Aviation Services", where: "4F · Departures Level" },
  { id: "i3", group: "metadata", name: "Passport Control Fast Lane - International Gates", category: "Customs And Immigration", where: "4F · Departures Level" },
  { id: "i4", group: "metadata", name: "Airline Lounge Reception - Elite Members", category: "Aviation Services", where: "4F · Departures Level" },
  { id: "i5", group: "metadata", name: "Starbucks", category: "Coffee Shops", where: "4F · Departures Level" },
  { id: "i6", group: "feature-type", name: "Unlabeled polygon near Gate B14", category: "Unknown", where: "4F · Departures Level" },
  { id: "i7", group: "feature-type", name: "Duplicate wall segment, north concourse", category: "Structure", where: "4F · Departures Level" },
];

/**
 * How many issues the creation review actually lists. The v9 frame's headline says 32 against a
 * visible page of 5 — fine in a static mock-up, wrong here: the wizard counts down as you decide
 * rows, so a hard-coded 32 meant the banner could never reach zero however many you confirmed
 * (fixed 2026-08-11). The list is the truth; the headline follows it.
 */
export const ISSUES_TOTAL = CREATION_ISSUES.length;

/**
 * The creation issues as CHANGES, so the wizard's review IS the Manual Review screen (Olcay,
 * 2026-08-11: "it should be what we've built as user review — exactly the same"). Metadata
 * guesses ride as `metadata` rows, feature-type ones as `geometry`; every row wears the
 * `low-confidence` warning — that is what a guess is. The names are MapScale's own output for a
 * NEW building, so none resolve on the demo map (same honest limit as reviewing a non-B2 level).
 */
export function creationChanges(): import("./diff").Change[] {
  return CREATION_ISSUES.map((i) => ({
    id: `create-${i.id}`,
    name: i.name,
    type: i.group === "metadata" ? ("metadata" as const) : ("geometry" as const),
    kind: i.category.toLowerCase().replace(/\s+/g, "-"),
    detail: `${i.category} · ${i.where}`,
    details:
      i.group === "metadata"
        ? [`MapScale guessed the name — confirm or correct it.`]
        : [`MapScale couldn't classify this feature — confirm what it is.`],
    warning: "low-confidence" as const,
  }));
}

/** Turn "L3-EK-lounges.dwg" into a presentable level name. */
export function nameFromFile(file: string): string {
  const base = file.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ").trim();
  return base.replace(/\b\w/g, (c) => c.toUpperCase());
}
