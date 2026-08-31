/**
 * **What an override PRINTS** — the changelog's own voice for a value the user replaced.
 *
 * This module imports **nothing**, deliberately: it is the one part of the override that is a
 * TABLE, and a table reads correct while being wrong in one cell. Keeping it dependency-free is
 * what lets `scratch/geometry.test.mjs` transpile and exercise it directly, the same way the map
 * shell's engines are exercised. `diff.ts` supplies the labels and the values; this decides the
 * sentence.
 *
 * **One rule, and it is the rule `Name` and `Type` already obeyed** (Olcay, 2026-08-26, ruling the
 * override onto the full property bag):
 *
 * > **Print the change when it fits; name it when it does not.**
 *
 * So widening the override *unified* the vocabulary instead of bolting a second one beside it:
 * `Name: "Costa" → "Costa Coffee"` and `Price Range: "$$" → "$$$"` are the same line.
 */

/** Longer than this on either side and the line names the act instead of printing it. */
export const FITS = 32;

/**
 * How a single value reads, and whether it wants quotes.
 *
 * ⚠️ **Quotes are for STRINGS only.** `Cuisines: “3 values”` is worse than useless — it looks like
 * the value is the literal text. Numbers, booleans and counts are bare.
 */
function fmt(v: unknown): { text: string; quoted: boolean } | null {
  if (v === undefined || v === null) return null;
  if (typeof v === "boolean") return { text: v ? "yes" : "no", quoted: false };
  if (typeof v === "number")
    return Number.isFinite(v) ? { text: String(v), quoted: false } : null;
  if (Array.isArray(v))
    return v.length
      ? { text: `${v.length} value${v.length === 1 ? "" : "s"}`, quoted: false }
      : null;
  if (typeof v === "string") {
    const t = v.trim();
    return t ? { text: t, quoted: true } : null;
  }
  // An object with no agreed rendering. Say that it changed rather than print "[object Object]".
  return { text: "", quoted: false };
}

const wrap = (f: { text: string; quoted: boolean }) =>
  f.quoted ? `“${f.text}”` : f.text;

/**
 * One line, or `null` when there is nothing to say.
 *
 * | case | line |
 * |---|---|
 * | nothing before, nothing after | *(no line)* |
 * | unchanged | *(no line)* |
 * | nothing before → a value | `Label: “new”`, or `Label added` if it does not fit |
 * | a value → nothing | `Label removed` |
 * | a value → another | `Label: “old” → “new”`, or `Label changed` if either does not fit |
 */
export function overrideLine(
  label: string,
  before: unknown,
  after: unknown,
): string | null {
  const a = fmt(before);
  const b = fmt(after);
  if (!a && !b) return null;
  if (a && b && a.text === b.text) return null;
  if (!a && b)
    return b.text && b.text.length <= FITS
      ? `${label}: ${wrap(b)}`
      : `${label} added`;
  if (a && !b) return `${label} removed`;
  const fits =
    a!.text.length > 0 &&
    b!.text.length > 0 &&
    a!.text.length <= FITS &&
    b!.text.length <= FITS;
  return fits ? `${label}: ${wrap(a!)} → ${wrap(b!)}` : `${label} changed`;
}

/**
 * The line a removal gets when an override keeps it (Olcay, 2026-08-26: *"allow editing a deleted
 * change"*). It **leads** the list, because it is the largest thing the override does — it is not
 * about a field at all, it is about whether the feature is on the floor.
 */
export const REMOVAL_OVERRIDDEN = "Removal overridden — the feature stays";

/**
 * **Three lines always; the rest behind the cap that is already there.**
 *
 * The row draws MapScale's own `details` behind a `Details ▼` cap and the override's uncapped —
 * safe at two lines, and not at eight once the override carries a whole property bag. Three is
 * exactly the identity set (a removal's own line, Name, Type, Boundary), so the common edit never
 * truncates: this is insurance, not a feature.
 *
 * ⚠️ The remainder is **not dropped** — it goes behind the cap in override ink, so it still reads
 * as yours. Putting the *whole* block behind the cap would be the failure the block exists to
 * prevent: an edited row that says nothing until you click.
 */
export const SHOWN_LINES = 3;

export function splitOverrideLines(lines: string[]): {
  shown: string[];
  capped: string[];
} {
  return {
    shown: lines.slice(0, SHOWN_LINES),
    capped: lines.slice(SHOWN_LINES),
  };
}

/**
 * **Every line an override prints, in reading order.**
 *
 * The order is fixed and it is what makes `SHOWN_LINES` safe: a removal's own line, then Name, then
 * Type, then the boundary, then the properties as the panel showed them. The first three or four are
 * the identity set — *what the feature IS* — so the common edit never reaches the cap.
 *
 * ⚠️ **The baseline is MapScale's DETECTED value, not the published one.** Reverting deletes the
 * override and what is underneath is the detected value by construction, so a line that diffed
 * against anything else would describe a change Revert does not undo. `before` carries the feature's
 * own bag for the properties, because a `Change` only knows about the name, the type and its own
 * summary.
 */
/** Structurally typed, so this module still imports nothing — see the note at the top. */
export interface OverrideLike {
  name?: string;
  kind?: string;
  geometry?: unknown;
  props?: Record<string, unknown>;
  removedProps?: string[];
  details?: string[];
}

export function overrideDetails(
  change: { type: string; name: string; kind?: string },
  o: OverrideLike,
  before: Record<string, unknown> | undefined,
  label: { type: (s: string) => string; prop: (s: string) => string },
): string[] {
  const out: string[] = [];
  // Whether anything at all was settled — a removal's line must not appear on an empty override.
  const touched =
    o.name !== undefined ||
    o.kind !== undefined ||
    o.geometry !== undefined ||
    !!(o.props && Object.keys(o.props).length) ||
    !!(o.removedProps && o.removedProps.length);
  if (change.type === "deleted" && touched) out.push(REMOVAL_OVERRIDDEN);

  /**
   * ⚠️ **Absent is not removed** — and this is the one cell that was wrong when the tests were
   * written. An override that simply did not touch the name has `o.name === undefined`, which
   * `overrideLine` reads as *the value went away* and prints `Name removed`. Every override that
   * changed anything else would have carried that line.
   *
   * It is the same distinction `FeaturePanel.save()` documents from the other side: **absent means
   * leave this alone**, and a removal has to be said out loud. So the field is only asked about when
   * the override actually settled it — an emptied string still reaches `overrideLine` and still
   * reads as removed, which is right, because clearing a field IS removing its value.
   */
  const name =
    o.name === undefined ? null : overrideLine("Name", change.name, o.name);
  if (name) out.push(name);
  const kind =
    o.kind === undefined
      ? null
      : overrideLine(
          "Type",
          change.kind ? label.type(change.kind) : undefined,
          label.type(o.kind),
        );
  if (kind) out.push(kind);

  // The boundary's own line is written where the geometry commits — it is the only one that knows
  // how many pieces resulted. Anything already recorded is kept in place, here.
  for (const d of o.details ?? []) if (d.startsWith("Boundary")) out.push(d);

  for (const [k, v] of Object.entries(o.props ?? {})) {
    const line = overrideLine(label.prop(k), before?.[k], v);
    if (line) out.push(line);
  }
  for (const k of o.removedProps ?? []) {
    if (before?.[k] === undefined) continue; // binning a field that was never set says nothing
    out.push(`${label.prop(k)} removed`);
  }
  return out;
}
