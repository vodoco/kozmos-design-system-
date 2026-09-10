import { Copy, Help, Star, StarFilled } from "./icons";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Button,
  Card,
  Icon,
  IconButton,
  Input,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
  Switch,
  Text,
} from "@kozmos/react";
import { PanelHeader, PANEL_PAD } from "./PanelHeader";
import { PersonaVisibility } from "./PersonaVisibility";
import { SectionHeading } from "./SectionHeading";
import { TypePicker } from "./TypePicker";
import {
  CLASS_LABEL,
  categoryLabel,
  categoryOf,
  classOf,
  suggestedFor,
  typeLabel,
} from "../mock/taxonomy";
import {
  TYPE_LABEL,
  isTruthy,
  propertyDef,
  propertyLabel,
  segmentRank,
  toArray,
  type PropertyDef,
  EDITABLE_PROPERTIES,
  valueLabel,
} from "../mock/properties";

/**
 * The POI properties panel (§19) — what a selected feature *is*, and now what it can be *made* to
 * be.
 *
 * **Floating over the map's LEFT edge, not a third column** (Olcay: *"floating panel … don't
 * resize map but center — offset the key element on the map"*, then *"I want it on the left side
 * floating"*). The map keeps its width and the *camera* makes room: `focusPadLeft` frames the
 * feature in the part of the map the panel doesn't cover.
 *
 * **Two modes, deliberately modelled on two different real screens** (Olcay, 2026-08-12, with the
 * dashboard's *Editing Map Content* panel and the SDK's POI-card contract attached — *"all
 * properties should be editable… maybe we can align with that a little using our design system"*):
 *
 * - **Reading is the SDK's POI card.** That card derives its sections from `properties` — 23
 *   sections out of 60 properties in the published contract — so this one does too: an array or
 *   enum becomes a titled chip group, a boolean becomes a chip only when it is *true*, a hyperlink
 *   becomes an action, and `description` gets the paragraph under the title. Nothing here is a
 *   hand-written list of fields; add `cuisines` in edit mode and a **Cuisines** section appears,
 *   for the same reason it appears on the real card.
 * - **Editing is the dashboard's *Editing Map Content*.** FID read-only with a copy button, the
 *   type selector, a required Name, **Featured**, then *+ Add additional field* with its
 *   **Suggested / Others** split and the value type printed beside each row — and every field
 *   removable by its own bin. Controls are chosen by the taxonomy's own `inputType`.
 *
 * ⚠️ **The identifiers are never editable.** `fid`/`bid`/`sid`/`lvl` say *which feature this is and
 * where it lives*; a text box around them offers to re-parent a feature into another building,
 * which is not an edit. The real panel agrees — its FID field is read-only with a copy button, and
 * that is exactly what is built here.
 *
 * ⚠️ **Two DS components that look right and are not**, worth knowing before reaching for them:
 * `POICard` is the *consumer wayfinding* card (hero image, `text-xl` heading, action footer) and
 * `Badge` is touch-sized at `h-11`. Both are scaled for the end-user SDK app, not a 340px dashboard
 * inspector. The DS has no dense property-list component, so the rows are the app's own, built from
 * DS type and tokens.
 */
export const FEATURE_PANEL_WIDTH = 360;
/** The inset from the map's edges — matched to the Map Settings control in the opposite corner. */
const PANEL_INSET = 12;

const MUTED = "var(--primitives-colors-background-600)";
/**
 * ⚠️ **This was `background-900` — `#17191c`, near-black in the light theme.** A token named
 * like a background doing a hairline's job, which is why every box in the panel had a hard
 * outline (Olcay, 2026-09-09: *"the input outlines should not be black"*). The same mistake was
 * already fixed once on the geometry toolbar's own border and not carried here.
 *
 * `background-500` is `#747b8b`, which is exactly what the design system's own `Input` uses for
 * its border (`border-[color:var(--primitives-colors-foreground-500)]`, and the two ramps meet
 * at 500). So a drawn box and a real input now agree instead of the drawn one being darker.
 */
const LINE = "var(--primitives-colors-background-500)";
const INK = "var(--review-ink)";

/** The tile properties that are identity, not content — shown, never edited. See the note above. */
const IDENTITY: { key: string; label: string }[] = [
  { key: "fid", label: "FID" },
  { key: "bid", label: "Building ID" },
  { key: "sid", label: "Site ID" },
  { key: "lvl", label: "Level index" },
];
/** Handled by their own dedicated controls rather than as generic properties. */
const RESERVED = new Set([
  "fid",
  "bid",
  "sid",
  "lvl",
  "name",
  "mainType",
  "subType",
  "mapPersonas",
  /**
   * ⚠️ **`isFeatured` has a control of its own beside Name**, the way the dashboard draws it — so
   * it must not ALSO appear as a generic property row or in the Add-field picker. The taxonomy
   * publishes it as a plain `switch` in the *Prominence* segment; making it a star next to the name
   * is this app's judgement about where a promotion flag belongs, not a reading.
   */
  "isFeatured",
]);

/** `copy-01` from the Pointr Icon Library (see `./icons`). */
function CopyGlyph() {
  return <Copy size={16} />;
}

function SectionTitle({ children }: { children: string }) {
  return (
    <Text
      style={{
        display: "block",
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: ".04em",
        textTransform: "uppercase",
        color: MUTED,
      }}
    >
      {children}
    </Text>
  );
}

/** A value chip — the SDK card's own unit for "one of a set". */
function ValueChip({ children, muted }: { children: string; muted?: boolean }) {
  return (
    <span
      style={{
        fontSize: 11.5,
        padding: "4px 9px",
        borderRadius: 999,
        border: `1px ${muted ? "dashed" : "solid"} ${LINE}`,
        background: muted
          ? "transparent"
          : "var(--primitives-colors-background-100)",
        color: muted ? MUTED : INK,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ── reading: the card, derived from properties ──────────────────────────────── */

/**
 * One derived section of the read view.
 *
 * Built by walking the property bag rather than a field list, which is what makes this *the same
 * shape* as the SDK card instead of a lookalike: the card has 23 sections because the feature has
 * 23 properties worth drawing, not because anybody enumerated them.
 */
function DerivedSections({ values }: { values: Record<string, unknown> }) {
  const sections = useMemo(() => {
    const out: { key: string; def: PropertyDef; chips: string[] }[] = [];
    for (const [key, v] of Object.entries(values)) {
      if (RESERVED.has(key)) continue;
      const def = propertyDef(key);
      // Booleans and hyperlinks are drawn elsewhere (stat chips / actions); text is a paragraph.
      if (def.valueType !== "array" && def.valueType !== "enum") continue;
      const chips = toArray(v);
      if (chips.length) out.push({ key, def, chips });
    }
    return out.sort(
      (a, b) => segmentRank(a.def.segment) - segmentRank(b.def.segment),
    );
  }, [values]);

  if (!sections.length) return null;
  return (
    <>
      {sections.map((s) => (
        <div key={s.key} style={{ marginTop: 16 }}>
          <Text
            style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 600,
              color: INK,
              marginBottom: 6,
            }}
          >
            {propertyLabel(s.key)}
          </Text>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
            {s.chips.map((c) => (
              <ValueChip key={c}>{c}</ValueChip>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/* ── editing several features at once ─────────────────────────────────────────
   Olcay, 2026-08-16: *"edit metadata panel would update based on the combined information (e.g.
   multiple values - or a value if same for both POIs) ... changing metadata or values would affect
   all selected."* */

/**
 * The value of a field the selected features **disagree** about.
 *
 * A sentinel rather than `undefined`, and this is the whole reason it exists: "they differ" and
 * "nobody has set it" have to stay distinguishable all the way to the save. Blank them together and
 * an untouched *Multiple values* field would be written back as empty to every feature in the
 * selection — silently erasing four descriptions because somebody renamed a room.
 *
 * ⚠️ Written as the **escape** `\u0000`, never as a literal NUL in the source — an invisible
 * control character in a file is a trap for every diff, editor and search that touches it. The
 * value survives the `JSON.stringify` comparisons the dirty check and the merge both use, and
 * can never collide with anything a person could type.
 */
export const MULTIPLE = "\u0000multiple";

/**
 * Fields that belong to one feature and are never merged — the panel shows the primary's.
 *
 * Wider than `IDENTITY` above, which is only the four the read view prints: `mainType` classifies
 * the feature and drives the icon and the sub-type list, and `mapPersonas` has no control here.
 * None of the three is editable, so merging them could only ever produce a sentinel nobody could
 * clear.
 */
const PER_FEATURE = new Set([
  "fid",
  "bid",
  "sid",
  "lvl",
  "mainType",
  "mapPersonas",
]);

/** What a differing field says where it has room to say it. */
const MULTI_LABEL = "Multiple values";

/**
 * The same thing where there is no placeholder to put it in — a switch has no third position, and
 * a chip row's emptiness would otherwise read as "none of them have any".
 */
function MultiHint() {
  return (
    <Text
      as="span"
      style={{
        marginLeft: 8,
        fontSize: 11,
        fontStyle: "italic",
        color: MUTED,
        // Never broken across two lines — "Multiple / values" reads as two separate words about
        // two separate things, which is the one thing this label must not do.
        whiteSpace: "nowrap",
      }}
    >
      {MULTI_LABEL}
    </Text>
  );
}

/**
 * One property bag standing for the whole selection: a shared value where they agree, `MULTIPLE`
 * where they do not.
 *
 * A key missing from one bag counts as a disagreement, because it is one — three features with a
 * description and one without do not share a description.
 */
export function mergeForEditing(
  bags: Record<string, unknown>[],
): Record<string, unknown> {
  if (bags.length <= 1) return bags[0] ?? {};
  const keys = new Set<string>();
  for (const b of bags) for (const k of Object.keys(b)) keys.add(k);
  const out: Record<string, unknown> = {};
  for (const k of keys) {
    if (PER_FEATURE.has(k)) {
      out[k] = bags[0][k];
      continue;
    }
    const first = JSON.stringify(bags[0][k] ?? null);
    out[k] = bags.every((b) => JSON.stringify(b[k] ?? null) === first)
      ? bags[0][k]
      : MULTIPLE;
  }
  return out;
}

/* ── editing: the dashboard's field editor ───────────────────────────────────── */

/**
 * What an object-valued property has in it, in one line. The taxonomy publishes no shape for these
 * beyond `object`, so this counts and names rather than pretending to parse a schema it does not
 * have.
 */
function summariseObject(key: string, v: unknown): string {
  if (v == null || v === "") return "Not set";
  if (typeof v !== "object") return String(v);
  const o = v as Record<string, unknown>;
  if (key === "openingHours") {
    const days = Object.keys(o).length;
    return days ? `${days} day${days === 1 ? "" : "s"} set` : "Not set";
  }
  if (key === "rating") {
    const score = o.value ?? o.score ?? o.rating;
    const count = o.count ?? o.total ?? o.votes;
    if (score != null)
      return count != null
        ? `${score} out of 5, from ${count} ratings`
        : `${score} out of 5`;
  }
  const n = Object.keys(o).length;
  return `${n} field${n === 1 ? "" : "s"}`;
}

/**
 * **A list of image URLs — `images` and `logo`.**
 *
 * ⑤ draws the head with its count, a row per image as thumbnail + URL + ✕, an add control, and a
 * footnote of constraints. ⚠️ **Those constraints — 2MB, JPG & PNG, 16:9 — are ⑤'s, not the
 * taxonomy's.** The taxonomy publishes only `image` and `maxCount`; the rest is a product decision
 * this file carries rather than invents, and it is marked here so nobody mistakes it for a reading.
 */
function ImageList({
  urls,
  single,
  max,
  note,
  onChange,
}: {
  urls: string[];
  /** `logo` holds one: adding replaces rather than appends. */
  single?: boolean;
  max?: number;
  note: string;
  onChange: (next: string[]) => void;
}) {
  const [typed, setTyped] = useState("");
  const full = !single && max != null && urls.length >= max;
  const commit = () => {
    const v = typed.trim();
    setTyped("");
    if (!v || urls.includes(v)) return;
    onChange(single ? [v] : full ? urls : [...urls, v]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {!single && max != null && (
        <Text style={{ alignSelf: "flex-end", fontSize: 9.5, color: MUTED }}>
          {urls.length} / {max}
        </Text>
      )}
      {urls.map((u) => (
        <div
          key={u}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            minWidth: 0,
          }}
        >
          {/**
           * A real thumbnail, not a grey box: the value IS an image URL, so showing it is the
           * cheapest way to see that a link is wrong. `onError` falls back to the placeholder ⑤
           * draws, because a broken image icon says less than an empty frame.
           */}
          <img
            src={u}
            alt=""
            /**
             * ⚠️ **`visibility: hidden` hid the frame as well as the broken glyph**, leaving a gap
             * where ⑤ draws a placeholder. Dropping the `src` instead keeps the element — and its
             * grey ground — and stops the browser drawing its broken-image icon. An empty frame says
             * "no preview"; a gap says nothing and a broken icon says "the app is broken".
             */
            onError={(e) => {
              e.currentTarget.removeAttribute("src");
            }}
            style={{
              flex: "0 0 auto",
              width: single ? 28 : 44,
              height: single ? 28 : 32,
              objectFit: "cover",
              borderRadius: 4,
              background: "var(--primitives-colors-background-100)",
            }}
          />
          <Text
            title={u}
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 10.5,
              color: INK,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {u}
          </Text>
          <button
            type="button"
            onClick={() => onChange(urls.filter((x) => x !== u))}
            aria-label={`Remove ${u}`}
            className="remove-field"
            style={{
              flex: "0 0 auto",
              display: "grid",
              placeItems: "center",
              width: 20,
              height: 20,
              padding: 0,
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            <Icon name="x-close" />
          </button>
        </div>
      ))}
      {/* At the cap the add control goes, and says why — ⑤'s own words. */}
      {full ? (
        <Text style={{ fontSize: 9.5, color: MUTED }}>
          Remove one to add another.
        </Text>
      ) : (
        <input
          value={typed}
          onChange={(e) => setTyped(e.target.value)}
          onKeyDown={(e) => {
            if (e.key !== "Enter") return;
            e.preventDefault();
            commit();
          }}
          onBlur={commit}
          aria-label={single ? "Logo URL" : "Add another image"}
          placeholder={
            single && urls.length
              ? "Paste a URL to replace it"
              : single
                ? "Paste the logo URL"
                : "Paste an image URL and press Enter"
          }
          style={{
            width: "100%",
            fontFamily: "inherit",
            fontSize: 11.5,
            color: INK,
            padding: "7px 10px",
            borderRadius: "var(--primitives-radius-lg, 8px)",
            border: `1px solid ${LINE}`,
            background: "transparent",
          }}
        />
      )}
      <Text style={{ fontSize: 9.5, color: MUTED }}>* {note}</Text>
    </div>
  );
}

/**
 * **The taxonomy's own one-line explanation, beside the field it explains.**
 *
 * 🔴 **The design has carried a ⓘ on every property since ⑤ and the panel had none.** All sixty
 * published properties have a description — checked, none blank — so the affordance always has
 * something to say, and the words are the taxonomy's rather than ours. A field called *Service
 * Options* is not self-explanatory; *"Which food service options are supported (eg. in-store dining,
 * takeout, takeaway)"* is.
 *
 * ⚠️ Not focusable. A form of twenty fields would otherwise take forty tab stops to cross — the same
 * arithmetic that made the type picker unusable. It is `title` on hover, and it is the same
 * `help-circle` the picker and the persona rows draw.
 */
function PropertyInfo({ def }: { def: PropertyDef }) {
  if (!def.description) return null;
  return (
    <span
      aria-hidden
      title={def.description}
      style={{
        flex: "0 0 auto",
        display: "grid",
        placeItems: "center",
        color: MUTED,
        cursor: "help",
      }}
    >
      <Help size={13} />
    </span>
  );
}

/**
 * **Featured** — the promotion flag, beside the name it promotes.
 *
 * A boxed star rather than a switch, because it sits on the title row where a switch would out-weigh
 * the field it stands next to, and because "featured" is a mark you put ON something. The taxonomy's
 * own words are the tooltip; `isFeatured` publishes *"Featured or sponsored"* and nothing here
 * paraphrases it.
 *
 * ⚠️ **A merged selection can disagree**, and the third state has to be visible or Update would
 * quietly set every feature to whichever way the box happened to look. `MULTIPLE` renders as neither
 * on nor off, and clicking commits a decision for all of them.
 */
function FeaturedToggle({
  value,
  onChange,
}: {
  value: unknown;
  onChange: (v: boolean) => void;
}) {
  const many = value === MULTIPLE;
  const on = !many && value === true;
  return (
    <button
      type="button"
      role="switch"
      aria-checked={many ? "mixed" : on}
      aria-label="Featured"
      title={propertyDef("isFeatured").description || "Featured or sponsored"}
      onClick={() => onChange(!on)}
      style={{
        flex: "0 0 auto",
        /**
         * ⚠️ **`display: grid` with `placeItems` and a `gap` centres each cell, not the pair.** The
         * word and the star were each centred in their own track, so they drifted apart as the
         * label wrapped. A flex column centres them as one block.
         */
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 3,
        width: 68,
        height: 44,
        padding: 0,
        borderRadius: "var(--primitives-radius-lg, 8px)",
        /**
         * ⚠️ **Amber, not the theme blue** (Olcay, 2026-09-09: *"featured star should be accent
         * color. yellowish."*). A featured place is not a selected place, and a blue star beside a
         * blue Update button read as "this control is on" rather than as a mark of prominence.
         * `emotional/alert` is the published amber ramp — 500 for the star, 300 for its border,
         * 0 for the ground.
         */
        border: `1px solid ${on ? "var(--primitives-colors-emotional-alert-300)" : LINE}`,
        background: on
          ? "var(--primitives-colors-emotional-alert-0)"
          : "transparent",
        color: on ? "var(--primitives-colors-emotional-alert-700)" : MUTED,
        cursor: "pointer",
      }}
    >
      {/* Caption and star share one centred column; the star carries the colour, the word stays
          readable — amber text on amber ground at 10px would not be. */}
      <span style={{ fontSize: 10, lineHeight: 1 }}>Featured</span>
      {/* ⚠️ `@kozmos/icons` publishes 42 names and none of them is a star — the same gap that left
          FID's copy glyph outside it. `./icons` carries the Pointr Library's own `star-01`
          (node 1007:10447) in both states. */}
      <span
        style={{
          display: "grid",
          placeItems: "center",
          color: on
            ? "var(--primitives-colors-emotional-alert-500)"
            : "inherit",
        }}
      >
        {on ? <StarFilled size={16} /> : <Star size={16} />}
      </span>
    </button>
  );
}

/** One editable property, drawn by the control its taxonomy `inputType` asks for. */
function PropertyField({
  def,
  value,
  onChange,
  onRemove,
}: {
  def: PropertyDef;
  value: unknown;
  onChange: (v: unknown) => void;
  onRemove: () => void;
}) {
  const label = propertyLabel(def.key);
  const [pick, setPick] = useState(false);
  /** The half-typed value in a free-text list (`tags`, `keywords`), before Enter commits it. */
  const [typed, setTyped] = useState("");
  /**
   * ⚠️ **A field the selection disagrees about shows as EMPTY with a placeholder, never as its
   * sentinel.** Every control below reads `shown` rather than `value`, so the sentinel exists only
   * between the merge and the save and is never something a person can see or type over by
   * accident. Typing replaces it outright, which is exactly "changing it affects all selected".
   */
  const many = value === MULTIPLE;
  const shown = many ? undefined : value;
  const chips = toArray(shown);

  /**
   * 🔴 **The bin was nudged down by a hard-coded 18px, and nothing lined up** (Olcay, 2026-09-09:
   * *"there are alignment issues — thrash can, featured title and star"*).
   *
   * No constant could have worked: measured in the browser, the caption above the control is **24px**
   * for a design-system `Input` (its own built-in label), **27px** for the captions this file draws,
   * and **35px** for the chip box. Three different heights, one offset.
   *
   * So the caption is drawn ONCE here — including for the `Input`, whose `label` prop is no longer
   * used — and the control and the bin share a flex row. The bin is then aligned by construction
   * rather than by a number, and the number is gone.
   */
  const inlineControl = def.valueType === "boolean";
  /**
   * Tall controls — a textarea, an image list, an opening-hours grid — take the bin at their TOP
   * row; short ones take it on their centre line. Both are correct and neither needs a number.
   */
  const tallControl =
    def.inputType === "textArea" || def.inputType === "custom";

  return (
    <div style={{ marginTop: 12 }}>
      {/* One caption for every branch. See the note above. */}
      {!inlineControl && (
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            marginBottom: 4,
          }}
        >
          <Text style={{ fontSize: 11, color: MUTED }}>
            {label}
            {many && <MultiHint />}
          </Text>
          <PropertyInfo def={def} />
        </span>
      )}
      <div
        style={{
          display: "flex",
          alignItems: tallControl ? "flex-start" : "center",
          gap: 8,
        }}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          {def.valueType === "boolean" ? (
            /**
             * **Label first, switch at the right edge** (Olcay, 2026-08-16: *"the toggles should be
             * on the right side not left"*).
             *
             * Not only a preference — it is what makes the column read. Every other field in this
             * panel puts its name at the left edge and its control below or beside it, so a leading
             * switch made the booleans the one row whose *text* started 44px in, and their labels
             * lined up with nothing. Right-aligned controls also share one edge down the form, which
             * is the thing that makes a settings list scannable.
             *
             * ⚠️ The DS `Switch`'s own `label` prop puts the label AFTER the control, so it is not
             * used here — the label is the app's, and the switch is given the row's far end.
             */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                padding: "6px 0",
              }}
            >
              <label
                htmlFor={`f-${def.key}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  fontSize: 13,
                  color: INK,
                  cursor: "pointer",
                  minWidth: 0,
                }}
              >
                {label}
                {/* A switch has no third position, so a disagreement is said beside the label
                  instead — and it reads OFF, which is the safe way round: nothing is written to
                  any feature until it is actually toggled. */}
                {many && <MultiHint />}
                <PropertyInfo def={def} />
              </label>
              {/**
               * ⚠️ **A span, because the DS wrapper is `w-full` and `wrapperClassName` cannot undo
               * it.** Passing `!w-auto` looked like the fix and did nothing: this app does not run
               * Tailwind over its own source, so a class it invents is never compiled and the
               * attribute lands on an element with no rule behind it. Measured, not assumed — the
               * wrapper was still 254px and the switch still sat where the label left it.
               *
               * Shrink-to-fit here resolves the inner `width: 100%` against the switch's own
               * max-content, so the control ends up its natural width at the row's right edge.
               */}
              <span style={{ display: "inline-flex", flex: "0 0 auto" }}>
                <Switch
                  checked={isTruthy(shown)}
                  onCheckedChange={(c: boolean) => onChange(c)}
                  id={`f-${def.key}`}
                />
              </span>
            </div>
          ) : def.valueType === "text" && def.inputType === "textArea" ? (
            <div>
              <textarea
                value={String(shown ?? "")}
                placeholder={many ? MULTI_LABEL : undefined}
                onChange={(e) => onChange(e.target.value)}
                rows={3}
                aria-label={label}
                style={{
                  width: "100%",
                  resize: "vertical",
                  fontFamily: "inherit",
                  fontSize: 13,
                  color: INK,
                  padding: "8px 10px",
                  borderRadius: "var(--primitives-radius-lg, 8px)",
                  border: `1px solid ${LINE}`,
                  background: "var(--primitives-colors-background-0, #fff)",
                }}
              />
            </div>
          ) : def.valueType === "enum" && def.options?.length ? (
            /**
             * **`enum` is ONE value** (Olcay, 2026-09-09: *"some of the inputs are single selection
             * and some are multi value — check properties document"*).
             *
             * 🔴 **Five properties were drawn as multi-value and are not.** `serviceOptions`,
             * `ageRestriction`, `genderDesignation`, `crowdLevel` and `occupancyStatus` are `enum`
             * with a closed list; they rendered as a chip row with `+ Add`, which offers to add a
             * second value to a field that holds one. The code underneath already replaced rather
             * than appended, so the control was promising something it then refused to do.
             *
             * A `Select` says it in the shape. The twelve `array` properties keep the chip row, which
             * is what genuinely takes many.
             */
            <div>
              <Select
                value={chips[0] ?? ""}
                onValueChange={(v) => onChange([v])}
              >
                <SelectTrigger aria-label={label}>
                  <SelectValue placeholder={many ? MULTI_LABEL : "—"} />
                </SelectTrigger>
                <SelectContent>
                  {def.options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {valueLabel(def.key, o)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : def.key === "priceRange" ? (
            /**
             * **Price range is four steps, not a number box.** The taxonomy calls it
             * `integer / custom` and leaves the control to us; ⑤ draws exactly this and the panel
             * was rendering a spinner you could type 97 into.
             */
            <div style={{ display: "flex", gap: 0 }}>
              {[1, 2, 3, 4].map((n) => {
                const on = Number(shown) === n;
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={on}
                    aria-label={`Price level ${n} of 4`}
                    onClick={() => onChange(on ? "" : n)}
                    style={{
                      flex: 1,
                      height: 34,
                      fontSize: 12.5,
                      fontFamily: "inherit",
                      cursor: "pointer",
                      color: on ? "#fff" : INK,
                      background: on
                        ? "var(--primitives-colors-theme-700)"
                        : "transparent",
                      border: `1px solid ${LINE}`,
                      borderLeftWidth: n === 1 ? 1 : 0,
                      borderTopLeftRadius: n === 1 ? 8 : 0,
                      borderBottomLeftRadius: n === 1 ? 8 : 0,
                      borderTopRightRadius: n === 4 ? 8 : 0,
                      borderBottomRightRadius: n === 4 ? 8 : 0,
                    }}
                  >
                    {"$".repeat(n)}
                  </button>
                );
              })}
            </div>
          ) : def.valueType === "image" ? (
            /**
             * **The two image properties, drawn the way ⑤ specifies them.**
             *
             * `images` takes many and publishes a cap; `logo` takes one. Both are `image / custom` —
             * the taxonomy names the shape and leaves the control to us — and both were falling
             * through to a plain text box.
             *
             * ⚠️ **The cap is read from the taxonomy, never typed here.** `maxCount` is 7 today and
             * had to be carried through `PropertyDef` to reach this line; a 7 written into a component
             * is a number nobody can trace and one that stops being true the day the release moves.
             *
             * ⚠️ **The prototype takes a URL, not a file.** There is nowhere to upload to, and a
             * disabled file picker would be a promise the app cannot keep. A URL is exactly what the
             * property holds.
             */
            <ImageList
              urls={chips}
              single={def.key === "logo"}
              max={def.maxCount}
              note={
                def.key === "logo"
                  ? "Max 1MB · JPG & PNG · 1:1"
                  : "Max 2MB · JPG & PNG · 16:9"
              }
              onChange={(next) =>
                onChange(def.key === "logo" ? (next[0] ?? "") : next)
              }
            />
          ) : def.valueType === "object" ? (
            /**
             * 🔴 **An object was editable as TEXT, and editing it destroyed it.** `openingHours` and
             * `rating` are `object / custom`; the generic branch put them in a text input, so a
             * feature carrying a real schedule showed `[object Object]` and one keystroke replaced a
             * week of opening times with a string.
             *
             * They are read-only here until they have the controls ⑤ draws for them — a schedule grid
             * and a rating line. Read-only is not the answer, but it is not a lie and it cannot lose
             * anybody's data; an editable box that corrupts on touch is both.
             */
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                minHeight: 34,
                padding: "6px 10px",
                borderRadius: "var(--primitives-radius-lg, 8px)",
                background: "var(--primitives-colors-background-50)",
              }}
            >
              <Text style={{ flex: 1, minWidth: 0, fontSize: 12, color: INK }}>
                {summariseObject(def.key, shown)}
              </Text>
              <Text style={{ fontSize: 10.5, color: MUTED }}>read-only</Text>
            </div>
          ) : def.valueType === "array" ? (
            /* Many values: the chips you have, plus a way to add another — a picker when the
             taxonomy publishes a closed list, free text when it does not. */
            <div>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  alignItems: "center",
                  padding: "7px 8px",
                  borderRadius: "var(--primitives-radius-lg, 8px)",
                  border: `1px solid ${LINE}`,
                  minHeight: 38,
                }}
              >
                {chips.map((c) => (
                  <span
                    key={c}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 4,
                      fontSize: 11.5,
                      padding: "3px 4px 3px 9px",
                      borderRadius: 999,
                      background: "var(--primitives-colors-background-100)",
                      color: INK,
                    }}
                  >
                    {c}
                    <button
                      onClick={() => onChange(chips.filter((x) => x !== c))}
                      aria-label={`Remove ${c}`}
                      style={{
                        border: "none",
                        background: "none",
                        cursor: "pointer",
                        color: MUTED,
                        lineHeight: 1,
                        padding: 2,
                      }}
                    >
                      ✕
                    </button>
                  </span>
                ))}
                {def.options?.length ? (
                  <Popover open={pick} onOpenChange={setPick}>
                    <PopoverTrigger asChild>
                      <button
                        aria-label={`Add ${label}`}
                        style={{
                          border: "none",
                          background: "none",
                          cursor: "pointer",
                          color: "var(--primitives-colors-theme-700)",
                          fontSize: 12,
                          padding: "2px 4px",
                        }}
                      >
                        + Add
                      </button>
                    </PopoverTrigger>
                    <PopoverContent
                      align="start"
                      style={{
                        width: 260,
                        padding: 4,
                        maxHeight: 260,
                        overflow: "auto",
                      }}
                    >
                      {def.options
                        .filter((o) => !chips.includes(o))
                        .map((o) => (
                          <button
                            key={o}
                            onClick={() => {
                              onChange([...chips, o]);
                              setPick(false);
                            }}
                            style={{
                              display: "block",
                              width: "100%",
                              textAlign: "left",
                              padding: "7px 10px",
                              border: "none",
                              background: "none",
                              cursor: "pointer",
                              fontSize: 12.5,
                              color: INK,
                              borderRadius: 6,
                            }}
                          >
                            {valueLabel(def.key, o)}
                          </button>
                        ))}
                    </PopoverContent>
                  </Popover>
                ) : (
                  /**
                   * 🔴 **`tags` and `keywords` publish NO list, and were falling through to a text
                   * input** — which rendered the array itself, so the panel showed a field containing
                   * the literal characters `[]`. They are `array / comboBox`: many values, typed
                   * rather than chosen. Enter commits one, and the chips above are the same chips the
                   * closed lists use.
                   */
                  <input
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key !== "Enter") return;
                      e.preventDefault();
                      const v = typed.trim();
                      // No duplicates, and no empty chip from a stray Enter.
                      if (v && !chips.includes(v)) onChange([...chips, v]);
                      setTyped("");
                    }}
                    onBlur={() => {
                      const v = typed.trim();
                      if (v && !chips.includes(v)) onChange([...chips, v]);
                      setTyped("");
                    }}
                    aria-label={`Add ${label}`}
                    placeholder={
                      chips.length ? "Add another…" : "Type and press Enter"
                    }
                    style={{
                      flex: 1,
                      minWidth: 110,
                      border: "none",
                      outline: "none",
                      background: "none",
                      fontFamily: "inherit",
                      fontSize: 12,
                      color: INK,
                      padding: "2px 4px",
                    }}
                  />
                )}
              </div>
            </div>
          ) : (
            <Input
              value={String(shown ?? "")}
              onChange={(e) => onChange(e.target.value)}
              type={def.valueType === "integer" ? "number" : "text"}
              placeholder={
                many
                  ? MULTI_LABEL
                  : def.valueType === "hyperlink"
                    ? "https://"
                    : undefined
              }
              aria-label={label}
            />
          )}
        </div>
        {/* The dashboard's own affordance: a field you added is a field you can take away. */}
        <IconButton
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label={`Remove ${label} field`}
          title="Remove field"
          // Red, not the themed blue the DS ghost paints. See `.remove-field` in index.css.
          className="remove-field"
          /**
           * ⚠️ **The glyph sat 30px inside the panel edge** (Olcay, 2026-09-09: *"bin icons could be
           * further to the right side"*). `IconButton` is `h-11 w-11` at every size, so a 16px trash
           * is centred in a 44px box and the 14px of padding either side reads as a gap between the
           * field and its own control.
           *
           * The negative margin lets the 44px TARGET hang into the panel's 20px gutter while the
           * glyph moves to the edge. Shrinking the button would have been the easy fix and the wrong
           * one — it is the only way to remove a field, and a 24px target in a dense list is a miss
           * waiting to happen.
           */
          style={{ flex: "0 0 auto", marginRight: -12 }}
        >
          <Icon name="trash-01" />
        </IconButton>
      </div>
    </div>
  );
}

/**
 * *+ Add additional field* — the dashboard's searchable picker, with the taxonomy's own
 * **Suggested / Others** split and the value type printed on the right of every row.
 *
 * "Suggested" is not a ranking: it is `suggestedProperties` for this exact `(mainType, subType)`,
 * i.e. what the product expects a feature of this type to carry. Everything else the vocabulary
 * knows sits under "Others", which is what stops the split from being a dead end.
 */
function AddFieldPicker({
  suggested,
  others,
  onAdd,
}: {
  suggested: string[];
  others: string[];
  onAdd: (key: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  // Matched on the printed name AND the raw key — a developer types `phoneNumber`, a content
  // editor types "phone", and both should land on the same row.
  const match = (k: string) => {
    if (!q) return true;
    const needle = q.toLowerCase();
    return (
      propertyLabel(k).toLowerCase().includes(needle) ||
      k.toLowerCase().includes(needle)
    );
  };
  const s = suggested.filter(match);
  const o = others.filter(match);

  const row = (k: string) => {
    const def = propertyDef(k);
    return (
      <button
        key={k}
        onClick={() => {
          onAdd(k);
          setOpen(false);
          setQ("");
        }}
        title={def.description}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          width: "100%",
          textAlign: "left",
          padding: "8px 10px",
          border: "none",
          background: "none",
          cursor: "pointer",
          borderRadius: 6,
        }}
      >
        <span style={{ flex: 1, minWidth: 0, fontSize: 12.5, color: INK }}>
          {propertyLabel(k)}
        </span>
        <span style={{ flex: "0 0 auto", fontSize: 11, color: MUTED }}>
          {TYPE_LABEL[def.valueType]}
        </span>
      </button>
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 14,
            padding: 0,
            border: "none",
            background: "none",
            cursor: "pointer",
            color: "var(--primitives-colors-theme-700)",
            fontSize: 13,
          }}
        >
          <Icon name="plus" /> Add additional field
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        style={{ width: 300, padding: 6, maxHeight: 320, overflow: "auto" }}
      >
        <div style={{ padding: 4 }}>
          <Input
            placeholder="Search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            aria-label="Search properties"
          />
        </div>
        {s.length > 0 && (
          <>
            <div
              style={{
                padding: "6px 10px",
                background: "var(--primitives-colors-background-100)",
                borderRadius: 4,
              }}
            >
              <SectionTitle>Suggested</SectionTitle>
            </div>
            {s.map(row)}
          </>
        )}
        {o.length > 0 && (
          <>
            <div
              style={{
                padding: "6px 10px",
                marginTop: 4,
                background: "var(--primitives-colors-background-100)",
                borderRadius: 4,
              }}
            >
              <SectionTitle>Others</SectionTitle>
            </div>
            {o.map(row)}
          </>
        )}
        {!s.length && !o.length && (
          <Text
            style={{
              display: "block",
              padding: 10,
              fontSize: 12,
              color: MUTED,
            }}
          >
            Nothing matches “{q}”.
          </Text>
        )}
      </PopoverContent>
    </Popover>
  );
}

export function FeaturePanel({
  props: p,
  icon,
  onDirtyChange,
  geometryDirty,
  onCommitGeometry,
  selection,
  onDeselect,
  recomposable,
  onEdited,
  onSaved,
  onCancelEdit,
  saveSignal,
  reviewNote,
  reviewFootnote,
  onClose,
}: {
  /** The tile's own property bag plus any local edits, exactly as the app holds it. */
  props: Record<string, unknown>;
  icon?: React.ReactNode;
  /**
   * Told whenever the panel gains or loses unsaved changes — the app guards feature switches with
   * it (Olcay: *"warn the user if they changed a POI then tried to select some other POI"*).
   */
  onDirtyChange?: (dirty: boolean, canSave: boolean) => void;
  /**
   * The shape is edited on the map, but committed HERE — geometry and properties are one edit, so
   * they share one Update and one Cancel rather than each growing their own pair.
   */
  geometryDirty?: boolean;
  onCommitGeometry?: () => void;
  /**
   * **Everything selected, primary first** (Olcay, 2026-08-16). One entry is the ordinary case and
   * changes nothing; more than one turns on the count strip, the *Multiple values* placeholders,
   * and a save that writes to all of them.
   *
   * The panel is given the whole list rather than just a number because it has to be able to *show*
   * which features they are — a count alone leaves you unable to check what you are about to edit.
   */
  selection?: {
    fid: string;
    name: string;
    typeLabel: string;
    /**
     * This feature's OWN `mapPersonas`. The merged bag cannot carry it: persona visibility
     * disagrees per persona, not per field, so the control needs each feature's list to know
     * which of the six are indeterminate.
     */
    mapPersonas?: unknown;
    /**
     * What happened to this row (Olcay, 2026-08-16: *"we should update the selected items section
     * for combination results - what's joined for what's removed"*).
     *
     * ⚠️ **Three fates, and they must not be conflated.** `selected` is the ordinary case, still
     * its own feature. `joined` means a Combine took its floor into this shape. `removed` means it
     * was standing *between* two of them — a wall, a threshold — and has been taken off the map.
     * Absent means selected, so nothing outside Combine has to think about it.
     */
    fate?: "joined" | "removed";
  }[];
  /**
   * A row's ✕. **What it means depends on the row's fate** — drop from the selection, take back out
   * of the combined shape (which recomputes the geometry), or put back on the map.
   */
  onDeselect?: (fid: string, fate?: "joined" | "removed") => void;
  /**
   * Can a joined row still be taken back out? False once the shape has been hand-edited since the
   * combine, because recomputing from fewer members would discard that work. The row says so rather
   * than offering a ✕ that would either lie or destroy something.
   */
  recomposable?: boolean;
  /**
   * An edit was saved. Carries the flag-clearing consequence (§18a) up. D3: nothing persists.
   *
   * ⚠️ `next` holds **only the fields the editor actually settled** — a field the selection
   * disagreed about and nobody touched is left out entirely, so it is not flattened onto every
   * feature. `removed` is the fields binned, which cannot be inferred from `next` for the same
   * reason: absent means "leave alone", and only this says "take it away".
   */
  onEdited?: (
    next: Record<string, unknown>,
    removed?: string[],
    /**
     * Persona decisions, applied per feature rather than merged into `next`. A persona left
     * indeterminate is in neither list and is therefore untouched — which is the only way to say
     * "leave this one as it is" across features that disagree (US4).
     */
    personaEdits?: Record<string, boolean>,
  ) => void;
  /**
   * Update finished — the panel is done and the screen should close it. Separate from `onEdited`
   * because they answer different questions: `onEdited` is *what changed*, and every surface that
   * reads `edits` cares; this is *the task is over*, which only the screen owning the panel cares
   * about. Carries the name so the confirmation can say which feature it means.
   */
  onSaved?: (name: string) => void;
  /**
   * **Cancel is the screen's to answer, not the panel's** (Olcay, 2026-08-15: *"Cancel edit should
   * close the panel completely and close all the geometry edit. Ask user to confirm if they changed
   * something"*).
   *
   * Cancel used to drop `editing` and leave the panel sitting there in its read view — with the
   * geometry toolbar still up, because the toolbar follows the panel. You had cancelled and nothing
   * looked cancelled. The panel cannot fix that itself: closing is the screen's job, and so is
   * asking before throwing work away, because the screen already owns that conversation for
   * feature switches and there should be exactly one of it.
   */
  onCancelEdit?: () => void;
  /**
   * Bumped by the screen to mean "save now, I am waiting on it" — the *Save changes* answer to the
   * unsaved-work overlay. The draft lives in here, so the save has to happen in here; the screen
   * can only ask.
   */
  saveSignal?: number;
  /**
   * **What saving means on THIS screen**, when it is not the plain answer.
   *
   * Map Content's Update writes the feature. Review & Finalise's writes an **override on a change**,
   * and for a removal it does something the default sentence cannot say at all — it stops the
   * deletion. So the subtitle is passed in rather than assumed, and it is the only string in this
   * panel that varies by where it is mounted.
   */
  reviewNote?: string;
  /**
   * ⚠️ The body's closing line is **misleading in a review** if left alone: *"nothing is written
   * back to Pointr Cloud"* is true, and it is not the whole truth once the override goes live when
   * the review completes. Both halves are said where this is passed.
   */
  reviewFootnote?: string;
  onClose: () => void;
}) {
  /**
   * **The panel opens in EDIT mode** (Olcay, 2026-08-14: *"click on a feature on the map and on
   * the listing should show the details panel in edit mode ... No need to add additional edit
   * button"*). Selecting a feature in a dashboard IS the intent to work on it; a read-only stop
   * with an Edit button in it was a step between the click and the thing the click was for.
   *
   * Safe because nothing commits until **Update**, which stays disabled until something actually
   * changes — so a look still costs nothing, exactly as it did before.
   */
  const [editing, setEditing] = useState(true);
  /**
   * ⚠️ **Live rows only.** After a Combine the list still carries the joined and removed features —
   * that is the point of it — but only one feature is actually being edited. Counting the whole
   * list would title the panel "3 features" and promise that a change here reaches all of them,
   * about two rows that no longer have an outline between them.
   */
  const liveRows = (selection ?? []).filter((s) => !s.fate);
  const multi = liveRows.length > 1;
  /** The strip appears whenever there is more than one row to report, whatever became of them. */
  const showStrip = (selection?.length ?? 0) > 1;
  /**
   * What the strip's one line says. Three counts, each named for what actually happened to it, and
   * only the ones that are non-zero — "3 selected · 0 removed" is noise pretending to be data.
   */
  const tally = useMemo(() => {
    const rows = selection ?? [];
    const kept = rows.filter((s) => !s.fate).length;
    const joined = rows.filter((s) => s.fate === "joined").length;
    const gone = rows.filter((s) => s.fate === "removed").length;
    const parts: string[] = [];
    // "selected" only while that is still true of them; once a combine has run they are one shape.
    if (kept) parts.push(joined ? `${kept} kept` : `${kept} features selected`);
    if (joined) parts.push(`${joined} joined`);
    if (gone) parts.push(`${gone} removed`);
    return parts.join(" · ");
  }, [selection]);
  /** The list of what is selected, collapsed by default — a count you can check when you want to. */
  const [listOpen, setListOpen] = useState(false);
  const [draft, setDraft] = useState<Record<string, unknown>>({});
  /** Personas the user has explicitly decided this session. Absent = leave alone. */
  const [personaEdits, setPersonaEdits] = useState<Record<string, boolean>>({});
  /** Which optional properties the editor is showing — those with values, plus what you add. */
  const [fields, setFields] = useState<string[]>([]);

  /**
   * Selecting a different feature must not carry the previous one's half-typed edit across — and it
   * lands in edit mode like the first one did, because that is what selecting now means.
   *
   * This is the only thing that seeds the draft. There used to be a `reset()` beside it saying the
   * same two lines, for Cancel to call; Cancel now closes the panel instead of emptying it in
   * place, so re-seeding on the way *in* is the whole story.
   */
  /**
   * ⚠️ **The seed key is the whole SELECTION, not the primary's fid.**
   *
   * Shift-clicking a second feature does not change which feature is primary, so keying on
   * `p.fid` alone left the draft holding the first feature's values while the merged bag beside it
   * said *Multiple values* — and Update would then have written those stale values to everything
   * selected. Any change to who is selected re-seeds.
   */
  const seed =
    (selection ?? []).map((s) => s.fid).join(",") || String(p.fid ?? "");
  useEffect(() => {
    setEditing(true);
    setDraft({ ...p });
    setPersonaEdits({});
    setFields(Object.keys(p).filter((k) => !RESERVED.has(k)));
    // Keyed on the seed alone: re-seeding on every property change would wipe a half-typed
    // edit. (No eslint-disable — this config has no `react-hooks/exhaustive-deps` rule, so
    // the directive is itself an error and fails the pre-commit hook.)
  }, [seed]);

  /**
   * Has anything actually been changed? Both halves count: a value edited, and a field added or
   * binned — removing a property is an edit even though no value was typed.
   *
   * This is what makes "opens in edit mode" safe. Update stays dark until there is something to
   * save, so selecting a feature to LOOK at it commits nothing and warns about nothing.
   */
  const dirty = useMemo(() => {
    const original = Object.keys(p).filter((k) => !RESERVED.has(k));
    if (
      fields.length !== original.length ||
      fields.some((f) => !original.includes(f))
    )
      return true;
    const keys = new Set([...Object.keys(p), ...Object.keys(draft)]);
    for (const k of keys)
      if (JSON.stringify(p[k]) !== JSON.stringify(draft[k])) return true;
    return Object.keys(personaEdits).length > 0;
  }, [p, draft, fields, personaEdits]);
  /**
   * The SHAPE counts as an edit too. Geometry lives on the map, but it is the same edit session, so
   * dragging a corner must light Update exactly as typing a name does — otherwise the only way to
   * save a reshaped outline would be to also change a property, which is absurd.
   */
  const anyDirty = dirty || !!geometryDirty;
  /**
   * ⚠️ **Exactly the condition on the Update button**, and it has to be, because *Save changes* in
   * the unsaved-work overlay runs the same `save()` from outside the panel. Without this the
   * overlay could save a feature with an empty **Name** — a required field the button itself
   * refuses — so the one route enforced the rule and the other quietly walked around it.
   */
  const canSave = anyDirty && !!String(draft.name ?? "").trim();
  useEffect(() => {
    onDirtyChange?.(anyDirty, canSave);
  }, [anyDirty, canSave, onDirtyChange]);
  // Leaving the panel must not leave the app believing an edit is still open.
  useEffect(() => () => onDirtyChange?.(false, false), [onDirtyChange]);

  /**
   * **The type as it stands right now** — the draft's while editing, the feature's while reading.
   *
   * 🔴 **This read `p` on both paths, and everything downstream was stale.** `suggestedFor` is per
   * `(mainType, subType)` PAIR, so re-typing a restroom as a Store left the *Suggested properties*
   * list, the Add-field picker's suggested bucket, the class and category in the header and the
   * *Unnamed …* fallback all describing the type the feature used to be — until you saved and the
   * panel re-mounted. The bug predates the new picker (changing a subType had the same effect) and
   * the picker made it reachable for mainTypes too, which is a bigger jump: Restroom Space and
   * Retail Space suggest almost nothing in common.
   *
   * ⚠️ `??` and not `||`: clearing the subType sets it to `""`, which must NOT fall back to the
   * saved value — that is exactly the state where the mainType alone is the answer.
   */
  const values = editing ? draft : p;
  const mainType = String(values.mainType ?? p.mainType ?? "");
  const rawSub = values.subType ?? p.subType;
  const subType = rawSub && rawSub !== MULTIPLE ? String(rawSub) : undefined;
  const name = p.name ? String(p.name) : "";
  const cls = classOf(mainType, subType);
  const category = categoryOf(mainType, subType);
  const suggested = suggestedFor(mainType, subType);
  const description = String(values.description ?? "");
  /**
   * Not-yet-added properties, split the way the picker shows them.
   *
   * ⚠️ **`others` was a hard-coded list of six** — description, websiteUrl, hasAssistance,
   * serviceTypes, openingHours, priceRange — out of the sixty the taxonomy publishes. So a room
   * could never be given a capacity, a restaurant could never be given its cuisines, and the picker
   * quietly implied those properties did not exist. It is now every editable property the taxonomy
   * has, in the taxonomy's own order, with the system-written ones (`isAccessible`, `travelTime`)
   * excluded because a content editor does not set them.
   */
  /**
   * **The fields, grouped into the sections that earn one** (Olcay, 2026-09-09: *"Sections should
   * look like PERSONA VISIBILITY for properties"*).
   *
   * This is candidate **B** from the Workbench, landing in the running panel. The rule is the one
   * that block argued for, and it is a rule rather than a list because which fields a feature
   * carries changes with the feature:
   *
   * ⚠️ **A heading is earned by grouping, not by existing.** The taxonomy has 31 segments and **23
   * of them hold exactly one property**, so segmenting by segment alone gives a column of headings
   * over single fields — five of which repeat the field's own name back at it (the heading CUISINES
   * over a field labelled Cuisines). A segment gets a heading here only when **two or more** of its
   * properties are actually present; the rest stay plain fields, which is what they already look
   * like.
   *
   * Order is the taxonomy's `segmentRank`, and singles keep their place in it rather than being
   * swept to the end — moving a field because its neighbours left is not something a person editing
   * a form should have to follow.
   */
  const sections = useMemo(() => {
    const rank = (k: string) => segmentRank(propertyDef(k).segment);
    const ordered = [...fields].sort((a, b) => rank(a) - rank(b));
    const out: {
      segment: string;
      heading: string | null;
      keys: string[];
      /** Follows a section and has no heading of its own — see the note below. */
      detach?: boolean;
    }[] = [];
    for (const k of ordered) {
      const seg = propertyDef(k).segment;
      const last = out[out.length - 1];
      if (last && last.segment === seg) last.keys.push(k);
      else out.push({ segment: seg, heading: null, keys: [k] });
    }
    for (const g of out)
      g.heading = g.keys.length > 1 ? g.segment.toUpperCase() : null;
    return out;
  }, [fields]);

  const canAdd = useMemo(() => {
    /**
     * ⚠️ **`RESERVED` was not consulted here**, so the picker offered properties that already have
     * a dedicated control — `isFeatured` sat in *Suggested* beside the star it duplicates, and
     * adding it would have drawn a second, disagreeing switch further down the panel. `fields` is
     * built with `RESERVED` filtered out, so a reserved key can never be in `have` either: it has
     * to be excluded explicitly on both sides.
     */
    const have = new Set(fields);
    const offer = (k: string) => !have.has(k) && !RESERVED.has(k);
    const sug = (suggested ?? []).filter(offer);
    const others = EDITABLE_PROPERTIES.map((d) => d.key).filter(
      (k) => offer(k) && !sug.includes(k),
    );
    return { sug, others };
  }, [fields, suggested]);

  /** Booleans that are true, and scalars worth a chip — the card's stat row. */
  const stats = useMemo(() => {
    const out: string[] = [];
    for (const [k, v] of Object.entries(values)) {
      if (RESERVED.has(k)) continue;
      const def = propertyDef(k);
      if (def.valueType === "boolean" && isTruthy(v))
        out.push(propertyLabel(k));
      else if (def.valueType === "integer" && v != null && v !== "")
        out.push(
          k === "priceRange"
            ? "$".repeat(Math.max(1, Math.min(4, Number(v) || 1)))
            : `${propertyLabel(k)} ${v}`,
        );
    }
    return out;
  }, [values]);

  const links = useMemo(
    () =>
      Object.entries(values)
        .filter(
          ([k, v]) =>
            !RESERVED.has(k) && propertyDef(k).valueType === "hyperlink" && v,
        )
        .map(([k, v]) => ({
          key: k,
          label: propertyDef(k).actionName ?? propertyLabel(k),
          href: String(v),
        })),
    [values],
  );

  /**
   * **Update saves and finishes.** (Olcay, 2026-08-15: *"update a feature should close the edit and
   * save the changes"*.) Selecting a feature IS edit mode here, so leaving the panel open after
   * Update left you in an edit you had already completed — with a primary button gone grey and
   * nothing left to do but hunt for the ✕. Saving is the end of the task, so it ends the task.
   *
   * The order matters: commit the shape and the fields FIRST, then hand over to `onSaved`, which
   * closes the panel. Closing tears the geometry editor down, and a teardown before the commit
   * would discard the outline it was about to save.
   */
  const save = () => {
    setEditing(false);
    // One Update commits both halves. The map keeps the shape and re-baselines, so the panel does
    // not stay dirty against an outline it has just saved.
    onCommitGeometry?.();
    /**
     * Only the keys the editor owns; identity — `fid`/`bid`/`sid`/`lvl` — is never in the draft's
     * gift.
     *
     * 🔴 **`mainType` and `isFeatured` were being dropped on the floor.** `fields` is built with
     * `RESERVED` filtered out, so anything with a control of its own — the type picker, the star —
     * never reached this object, and pressing Update discarded it without a word. `subType` was
     * listed here by hand and `mainType` was not, which was harmless only while the mainType could
     * not be changed; the new picker made it changeable and the change went nowhere.
     *
     * Listed explicitly rather than by subtracting from `RESERVED`, because the two sets are not
     * complements: `fid` is reserved AND not the editor's, `isFeatured` is reserved AND is.
     */
    const OWNED = ["name", "mainType", "subType", "isFeatured"] as const;
    const next: Record<string, unknown> = { name: draft.name ?? "" };
    for (const k of OWNED) if (k in draft) next[k] = draft[k];
    for (const k of fields) next[k] = draft[k];
    /**
     * ⚠️ **A field still showing its sentinel was never settled, so it is not saved.**
     *
     * This is the line that stops a multi-edit from flattening everything it did not touch:
     * rename four rooms and their four different descriptions must survive it. Dropped rather than
     * sent as `undefined`, because absent means "leave this alone" to the caller and `undefined`
     * would mean "make it empty".
     */
    for (const k of Object.keys(next)) if (next[k] === MULTIPLE) delete next[k];
    /**
     * Fields the editor binned. They cannot be read off `next` — absent there means "leave alone" —
     * so removal has to be said out loud, or taking a property away would silently do nothing to
     * every feature but the one whose bag happened to be shown.
     */
    const removed = Object.keys(p).filter(
      (k) => !RESERVED.has(k) && !fields.includes(k),
    );
    onEdited?.(
      next,
      removed,
      Object.keys(personaEdits).length ? personaEdits : undefined,
    );
    /**
     * What the confirmation calls this. With several selected the name is either shared or a
     * sentinel, and neither is worth announcing — the count is what happened.
     */
    const n = liveRows.length || 1;
    onSaved?.(n > 1 ? `${n} features` : String(draft.name ?? "").trim());
  };

  /**
   * The screen asking for a save. Guarded on a non-zero signal so the initial render never fires
   * one, and keyed on the signal alone — `save` is redefined every render, and depending on it
   * would save on every keystroke.
   */
  const saveRef = useRef(save);
  saveRef.current = save;
  const canSaveRef = useRef(canSave);
  canSaveRef.current = canSave;
  useEffect(() => {
    // Guarded, not assumed: the screen only offers *Save changes* when it can be done, but the
    // panel owns the rule and must not rely on the caller to have checked it.
    if (saveSignal && canSaveRef.current) saveRef.current();
  }, [saveSignal]);

  return (
    <Card
      style={{
        position: "absolute",
        top: PANEL_INSET,
        left: PANEL_INSET,
        bottom: PANEL_INSET,
        width: FEATURE_PANEL_WIDTH,
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
        zIndex: 5,
      }}
    >
      {/* The header is chrome, not content: its own non-scrolling block with PANEL_PAD, so the ✕
          can neither scroll away nor be pushed left by the scrollbar the body grows (§0). */}
      <div style={{ padding: PANEL_PAD, flex: "0 0 auto" }}>
        <PanelHeader
          // Its own column, so the name and the line beneath it share a left edge — see the note
          // on `leading`. It used to be folded into the title node, and only the title moved.
          leading={icon}
          title={
            /* Wraps, never truncates — a feature's name is the one thing here you can't
               reconstruct from anything else. */
            <Text
              style={{
                display: "block",
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.3,
                color: "var(--primitives-colors-theme-900)",
                overflowWrap: "anywhere",
              }}
            >
              {multi
                ? `${liveRows.length} features`
                : /**
                   * ⚠️ **Never the sentinel.** It leaked into the title on the bench the moment
                   * one live feature was left holding a merged bag, and a raw `\u0000multiple`
                   * on screen is the worst possible way to find out. Guarded here rather than
                   * only upstream: this is the one string a person always reads.
                   */
                  (editing && draft.name !== MULTIPLE
                    ? String(draft.name ?? "")
                    : name === MULTIPLE
                      ? ""
                      : name) || `Unnamed ${typeLabel(subType || mainType)}`}
            </Text>
          }
          subtitle={
            multi
              ? "Editing all of them — a change here is a change to every one."
              : editing
                ? (reviewNote ?? "You are editing this feature’s properties.")
                : [
                    CLASS_LABEL[cls],
                    category ? categoryLabel(category) : null,
                    typeLabel(subType || mainType),
                  ]
                    .filter(Boolean)
                    .join(" · ")
          }
          onClose={onClose}
          closeLabel="Close feature properties"
        />
      </div>

      <Separator />

      <div
        style={{
          overflow: "auto",
          flex: 1,
          minHeight: 0,
          padding: "14px 20px 16px",
        }}
      >
        {/**
         * **What is selected, and the way to check it** (Olcay, 2026-08-16: *"There should be an
         * indicator of multiple items selected and upon expand the items should be listed to show
         * which ones."*).
         *
         * Collapsed by default and at the very top of the body: a count is enough almost always,
         * and the moment it is not — you are about to rename all of them — the answer is one click
         * away rather than a trip back to the map to count outlines.
         *
         * Each row can drop itself out. Shift-clicking the outline does the same thing, but only if
         * you can still find it on screen; a selection you built by panning around cannot always be
         * unpicked the way it was picked.
         */}
        {showStrip && (
          <div
            style={{
              marginBottom: 16,
              borderRadius: 10,
              border: `1px solid ${LINE}`,
              background: "var(--primitives-colors-background-50, #f7f8fa)",
              overflow: "hidden",
            }}
          >
            <button
              type="button"
              onClick={() => setListOpen((o) => !o)}
              aria-expanded={listOpen}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                width: "100%",
                padding: "9px 12px",
                border: "none",
                background: "none",
                font: "inherit",
                fontSize: 12.5,
                color: INK,
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "inline-block",
                  transition: "transform .15s ease",
                  transform: listOpen ? "rotate(90deg)" : "none",
                  fontSize: 10,
                  color: MUTED,
                }}
              >
                ▶
              </span>
              {/* After a combine the count is not a selection any more — it is a report of what
                  the shape now consists of, and saying "selected" about a removed wall would be
                  plainly untrue. */}
              <span style={{ fontWeight: 500 }}>{tally}</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: MUTED }}>
                {listOpen ? "Hide" : "Show"}
              </span>
            </button>
            {listOpen && (
              <ul
                style={{
                  listStyle: "none",
                  margin: 0,
                  padding: "0 0 4px",
                  maxHeight: 180,
                  overflow: "auto",
                }}
              >
                {selection!.map((s, i) => (
                  <li
                    key={s.fid}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "5px 12px 5px 30px",
                    }}
                  >
                    <span style={{ minWidth: 0, flex: 1 }}>
                      <Text
                        style={{
                          display: "block",
                          fontSize: 12.5,
                          color: INK,
                          overflowWrap: "anywhere",
                        }}
                      >
                        <Text
                          as="span"
                          style={{
                            // A removed feature is struck through: it is on this list to say what
                            // happened to it, not because it is still there.
                            textDecoration:
                              s.fate === "removed" ? "line-through" : "none",
                            color: s.fate === "removed" ? MUTED : INK,
                          }}
                        >
                          {s.name || `Unnamed ${s.typeLabel}`}
                        </Text>
                        {/* What happened to it. The first row is the anchor — the panel's
                            identity, the shape the geometry tools act on, and the one Escape
                            leaves behind — which is why the list has an order at all. */}
                        <Text
                          as="span"
                          style={{
                            marginLeft: 6,
                            fontSize: 10.5,
                            color: MUTED,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {s.fate ?? (i === 0 ? "primary" : "")}
                        </Text>
                      </Text>
                      <Text
                        style={{ display: "block", fontSize: 11, color: MUTED }}
                      >
                        {s.typeLabel}
                      </Text>
                    </span>
                    {/**
                     * ⚠️ **Three meanings, one control.** Dropping a *selected* row changes only
                     * the selection; taking a *joined* one out **recomputes the shape**; putting a
                     * *removed* one back draws it over the combined room again — which is a
                     * coherent thing to want, and what was asked for.
                     *
                     * A joined row is only offered while the combine is still a composition. Once
                     * the shape has been hand-edited, recomputing from fewer members would throw
                     * that work away, so the control goes quiet and the title says why instead of
                     * doing it silently.
                     */}
                    <IconButton
                      variant="ghost"
                      size="sm"
                      disabled={s.fate === "joined" && !recomposable}
                      title={
                        s.fate === "joined"
                          ? recomposable
                            ? "Take this feature back out of the combined shape"
                            : "The shape has been edited since it was combined — undo to take this back out"
                          : s.fate === "removed"
                            ? "Put this back on the map, over the combined shape"
                            : "Remove from selection"
                      }
                      onClick={() => onDeselect?.(s.fid, s.fate)}
                      aria-label={
                        s.fate === "joined"
                          ? `Take ${s.name || "this feature"} back out of the combined shape`
                          : s.fate === "removed"
                            ? `Put ${s.name || "this feature"} back on the map`
                            : `Remove ${s.name || "this feature"} from the selection`
                      }
                    >
                      <span aria-hidden style={{ fontSize: 13 }}>
                        ✕
                      </span>
                    </IconButton>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {/*
          ⚠️ **A "Flagged during review" alert stood here until 2026-08-25.** It carried the
          reviewer's note in their own words, and the honest admission that a flag matched by name
          might belong to any of the features sharing it. Flagging is gone (Olcay: *"once review
          concluded the map becomes the current map"*), and with it the one state this panel could
          inherit from a finished review. A feature you open while browsing is simply a feature.
        */}
        {!editing ? (
          /* ── reading: the POI card, derived ─────────────────────────────────── */
          <>
            {/* No Edit button: the panel opens in edit mode, so there is nothing to switch INTO.
                Reading is what you get after saving, or on a feature the taxonomy will not edit. */}
            <SectionTitle>Details</SectionTitle>

            {description && (
              <Text
                style={{
                  display: "block",
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: INK,
                  marginTop: 8,
                }}
              >
                {description}
              </Text>
            )}

            {links.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {links.map((l) => (
                  <Button key={l.key} variant="outline" size="sm" asChild>
                    <a href={l.href} target="_blank" rel="noreferrer noopener">
                      {l.label}
                    </a>
                  </Button>
                ))}
              </div>
            )}

            {stats.length > 0 && (
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 6,
                  marginTop: 10,
                }}
              >
                {stats.map((s) => (
                  <ValueChip key={s}>{s}</ValueChip>
                ))}
              </div>
            )}

            <DerivedSections values={values} />

            {/* What this type SHOULD carry that nothing has filled in — the honest other half.
                It doubles as the reason to press Edit. */}
            <div style={{ marginTop: 20 }}>
              <SectionTitle>Expected for this type</SectionTitle>
              <div style={{ marginTop: 6 }}>
                {suggested == null ? (
                  <Text style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
                    This type isn’t in the cached taxonomy, so what it should
                    carry isn’t known here.
                  </Text>
                ) : suggested.length === 0 ? (
                  <Text style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
                    The taxonomy suggests no additional properties for this
                    type.
                  </Text>
                ) : (
                  <>
                    <Text
                      style={{
                        fontSize: 12,
                        color: MUTED,
                        lineHeight: 1.5,
                        display: "block",
                        marginBottom: 8,
                      }}
                    >
                      The taxonomy expects a{" "}
                      {typeLabel(subType || mainType).toLowerCase()} to carry
                      these. Values live in the content API, which this
                      prototype doesn’t call — so the unfilled ones are named,
                      not invented.
                    </Text>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {suggested.map((s) => (
                        <ValueChip key={s} muted={!values[s]}>
                          {propertyLabel(s)}
                        </ValueChip>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Identity last and quiet: the SDK card never shows an id, but a dashboard has to. */}
            <div style={{ marginTop: 22 }}>
              <SectionTitle>Identifiers</SectionTitle>
              <div style={{ marginTop: 4 }}>
                {IDENTITY.map((f, i) => (
                  <div key={f.key}>
                    {i > 0 && <Separator />}
                    <div style={{ padding: "8px 0" }}>
                      <Text
                        style={{
                          display: "block",
                          fontSize: 11,
                          lineHeight: "14px",
                          color: MUTED,
                        }}
                      >
                        {f.label}
                      </Text>
                      <Text
                        style={{
                          display: "block",
                          fontSize: 12.5,
                          lineHeight: "17px",
                          marginTop: 2,
                          color: INK,
                          // Long, space-free ids wrap rather than ellipsis away the half you need.
                          overflowWrap: "anywhere",
                        }}
                      >
                        {String(p[f.key] ?? "—")}
                      </Text>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          /* ── editing: the dashboard's field editor ──────────────────────────── */
          <>
            <Text
              style={{
                display: "block",
                fontSize: 12.5,
                color: MUTED,
                marginBottom: 12,
              }}
            >
              Provide essential information below.
            </Text>

            {/**
             * **FID — a value you can copy, not a field you can type in** (Olcay, 2026-09-09:
             * *"fid should not look like an input also it's height is larger than others, why?"*).
             *
             * ⚠️ **Both halves of that were true.** It had a 1px border and a tinted ground, which
             * is the shape of every editable input beside it, so it read as one — and it was
             * **60px** tall against the 44px of its neighbours, because an 8px/8px padded box wrapped
             * a 44px `IconButton` (`h-11 w-11` at every `size`, so `sm` buys nothing).
             *
             * Now: no border, a flat tint that says read-only, and a 24px copy control. A convenience
             * on a value nobody edits does not need a 44px primary target, and giving it one made the
             * identity row the tallest thing in the panel.
             */}
            <div>
              <Text
                style={{
                  display: "block",
                  fontSize: 11,
                  color: MUTED,
                  marginBottom: 4,
                }}
              >
                FID
              </Text>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "6px 8px 6px 10px",
                  minHeight: 32,
                  borderRadius: "var(--primitives-radius-lg, 8px)",
                  background: "var(--primitives-colors-background-50)",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 12,
                    color: INK,
                    overflowWrap: "anywhere",
                  }}
                >
                  {String(p.fid ?? "—")}
                </Text>
                <button
                  type="button"
                  aria-label="Copy FID"
                  title="Copy"
                  onClick={() =>
                    navigator.clipboard?.writeText(String(p.fid ?? ""))
                  }
                  style={{
                    flex: "0 0 auto",
                    display: "grid",
                    placeItems: "center",
                    width: 24,
                    height: 24,
                    padding: 0,
                    border: "none",
                    background: "none",
                    borderRadius: 6,
                    cursor: "pointer",
                    color: MUTED,
                  }}
                >
                  <CopyGlyph />
                </button>
              </div>
            </div>

            {/**
             * **Type** — one fact with two parts, in one control. See `TypePicker`.
             *
             * ⚠️ **This replaced a plain `Select` of subtypes with the mainType printed above it as
             * a separate caption**, which read as a label and a field rather than as one answer, and
             * which offered no way to change the mainType at all. The dashboard's own picker offers
             * the whole tree with a class pre-filter, so this does too.
             */}
            <div style={{ marginTop: 12 }}>
              <TypePicker
                mainType={String(draft.mainType ?? mainType)}
                subType={
                  draft.subType === MULTIPLE
                    ? undefined
                    : String(draft.subType ?? "") || undefined
                }
                multiple={draft.subType === MULTIPLE}
                onChange={(next) =>
                  setDraft((d) => ({
                    ...d,
                    mainType: next.mainType,
                    // Cleared rather than left behind: a subType from the old mainType is not a
                    // pair the taxonomy publishes, and saving it would invent a type.
                    subType: next.subType ?? "",
                  }))
                }
              />
            </div>

            {/**
             * **Name, and Featured beside it** — the dashboard's own anatomy, and the one the doc
             * at the top of this file has described since the beginning without it being built.
             *
             * `isFeatured` is a published taxonomy property (`switch`, segment *Prominence*,
             * *"Featured or sponsored"*). It is lifted out of the generic list because it is not a
             * fact about the place, it is a decision about how the place is shown — and because a
             * boolean that belongs to the title reads as part of the title, not as row nineteen.
             */}
            <div
              style={{
                display: "flex",
                alignItems: "flex-end",
                gap: 8,
                marginTop: 12,
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Input
                  label="Name *"
                  value={
                    draft.name === MULTIPLE ? "" : String(draft.name ?? "")
                  }
                  onChange={(e) =>
                    setDraft((d) => ({ ...d, name: e.target.value }))
                  }
                  /* ⚠️ Typing here renames EVERY selected feature — leaving it be keeps their own
                     names, which is why the placeholder has to say what is in there rather than
                     look like an empty required field. */
                  placeholder={
                    draft.name === MULTIPLE ? MULTI_LABEL : "Unnamed"
                  }
                  aria-label="Feature name"
                />
              </div>
              <FeaturedToggle
                value={draft.isFeatured}
                onChange={(v) => setDraft((d) => ({ ...d, isFeatured: v }))}
              />
            </div>

            {sections.map((g) => (
              <div
                key={g.segment}
                style={g.detach ? { marginTop: 16 } : undefined}
              >
                {/* Same mark as PERSONA VISIBILITY below — 10px, letter-spaced, muted, upper case
                    — so the panel has one kind of section heading rather than two. */}
                {g.heading && <SectionHeading>{g.heading}</SectionHeading>}
                {g.keys.map((k) => (
                  <PropertyField
                    key={k}
                    def={propertyDef(k)}
                    value={draft[k]}
                    onChange={(v) => setDraft((d) => ({ ...d, [k]: v }))}
                    onRemove={() => {
                      setFields((f) => f.filter((x) => x !== k));
                      setDraft((d) => {
                        const n = { ...d };
                        delete n[k];
                        return n;
                      });
                    }}
                  />
                ))}
              </div>
            ))}

            <AddFieldPicker
              suggested={canAdd.sug}
              others={canAdd.others}
              onAdd={(k) => {
                setFields((f) => [...f, k]);
                setDraft((d) => ({
                  ...d,
                  [k]: propertyDef(k).valueType === "boolean" ? false : "",
                }));
              }}
            />

            <PersonaVisibility
              features={
                liveRows.length
                  ? liveRows.map((r) => ({ mapPersonas: r.mapPersonas }))
                  : [{ mapPersonas: p.mapPersonas }]
              }
              edits={personaEdits}
              onEdit={setPersonaEdits}
            />

            <Text
              style={{
                display: "block",
                fontSize: 11,
                color: MUTED,
                marginTop: 14,
              }}
            >
              * Required
            </Text>

            <Text
              style={{
                display: "block",
                fontSize: 11,
                color: MUTED,
                lineHeight: 1.45,
                marginTop: 10,
              }}
            >
              {reviewFootnote ??
                "Edits are local to this prototype — nothing is written back to Pointr Cloud."}
            </Text>
          </>
        )}
      </div>

      {/* The editor's footer, pinned like the real panel's — Cancel beside a primary that only
          lights when there is something to save. */}
      {editing && (
        <>
          <Separator />
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "12px 20px",
              flex: "0 0 auto",
            }}
          >
            <Button
              variant="outline"
              style={{ flex: 1 }}
              /**
               * ⚠️ **Hands over without touching anything first.** It used to `reset()` the draft
               * and revert the shape here and then ask — so choosing *Keep editing* in the
               * confirmation returned you to a panel whose work had already been thrown away. The
               * question has to be asked while the answer still matters.
               *
               * Nothing needs undoing on the way out either: closing unmounts this panel, draft and
               * all, and drops `focused`, which sends the map `end` with `commit: false`.
               */
              onClick={() => onCancelEdit?.()}
            >
              Cancel
            </Button>
            <Button style={{ flex: 1 }} onClick={save} disabled={!canSave}>
              Update
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
