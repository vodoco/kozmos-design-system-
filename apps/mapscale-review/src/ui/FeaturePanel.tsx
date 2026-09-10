import { ChevronRight, Copy, Star, StarFilled } from "./icons";
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
  Text,
} from "@kozmos/react";
import {
  BoxField,
  Chip,
  ChipsField,
  ChoiceField,
  FIELD,
  OpeningHoursField,
  PriceBand,
  RowField,
  Stepper,
  TextField,
  Toggle,
  addLink,
} from "./fields";
import { PanelHeader } from "./PanelHeader";
import { PersonaVisibility } from "./PersonaVisibility";
import { SectionHeading } from "./SectionHeading";
import { FEATURE_PANEL_WIDTH } from "./panelMetrics";
import { TypePicker } from "./TypePicker";
import { suggestedFor, typeLabel } from "../mock/taxonomy";
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
// The panel geometry lives in ./panelMetrics — see the note there on why not here.
export { FEATURE_PANEL_WIDTH } from "./panelMetrics";
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
  return <Copy size={14} />;
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

/* ── reading: the card, derived from properties ──────────────────────────────── */

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
  many,
  single,
  max,
  note,
  onChange,
}: {
  urls: string[];
  many?: boolean;
  single?: boolean;
  max?: number;
  note: string;
  onChange: (next: string[]) => void;
}) {
  const [typed, setTyped] = useState("");
  const full = !single && max != null && urls.length >= max;
  if (many)
    return (
      <Text
        style={{
          fontSize: 11,
          lineHeight: "14px",
          fontStyle: "italic",
          color: FIELD.muted,
        }}
      >
        {MULTI_LABEL} — open one feature to edit its images.
      </Text>
    );
  const commit = () => {
    const v = typed.trim();
    setTyped("");
    if (!v || urls.includes(v)) return;
    onChange(single ? [v] : full ? urls : [...urls, v]);
  };
  // C (Workbench 589:1079): a 38×22 thumbnail per image, 24×24 for the logo; the address in 10px
  // grey; the count is the box's own aside, drawn by the caller. The logo has no per-row remove —
  // pasting replaces it, and the field's bin removes the property.
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {urls.map((u) => (
        <div
          key={u}
          style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}
        >
          <img
            src={u}
            alt=""
            onError={(e) => {
              e.currentTarget.removeAttribute("src");
            }}
            style={{
              flex: "0 0 auto",
              width: single ? 24 : 38,
              height: single ? 24 : 22,
              objectFit: "cover",
              borderRadius: 3,
              background: "var(--primitives-colors-background-100)",
            }}
          />
          <Text
            title={u}
            style={{
              flex: 1,
              minWidth: 0,
              fontSize: 10,
              lineHeight: "13px",
              color: FIELD.muted,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {u}
          </Text>
          {!single && (
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
          )}
        </div>
      ))}
      {full ? (
        <Text style={{ fontSize: 9.5, lineHeight: "12px", color: FIELD.label }}>
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
            boxSizing: "border-box",
            fontFamily: "inherit",
            fontSize: 11.5,
            lineHeight: "14px",
            color: FIELD.ink,
            padding: "7px 10px",
            borderRadius: 8,
            border: `1px solid ${FIELD.border}`,
            background: "transparent",
          }}
        />
      )}
      <Text style={{ fontSize: 9.5, lineHeight: "12px", color: FIELD.label }}>
        * {note}
      </Text>
    </div>
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
        borderRadius: 8, // C: 8, not the 16 radius-lg renders
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
  const [adding, setAdding] = useState(false);
  const [typed, setTyped] = useState("");
  const many = value === MULTIPLE;
  const shown = many ? undefined : value;
  const chips = toArray(shown);
  const info = def.description || undefined;
  const text = shown == null ? "" : String(shown);
  const addTyped = () => {
    const v = typed.trim();
    if (v && !chips.includes(v)) onChange([...chips, v]);
    setTyped("");
  };

  /**
   * **Each shape of data in the shell C draws for it** (Workbench `589:1079`, Olcay 2026-09-10).
   * Switches, whole numbers and the price band are rows — label left, control right. Free text,
   * images, opening hours and the rating are boxes with the label on top. One-line values and
   * single choices are the product's own input, label inside. Chips keep their label above a box.
   *
   * ⚠️ **Opening hours is a schedule now, not a summary.** It was read-only because editing the
   * object as TEXT had destroyed it; C draws a day-by-day editor, and `OpeningHoursField` writes the
   * one shape it reads (see `readHours`). The rating stays read-only — C draws it as a sentence.
   */
  let control: React.ReactNode;
  if (def.valueType === "boolean") {
    control = (
      <RowField
        label={
          <>
            {label}
            {many && <MultiHint />}
          </>
        }
        info={info}
        htmlFor={`f-${def.key}`}
      >
        <Toggle
          id={`f-${def.key}`}
          checked={isTruthy(shown)}
          onChange={(c) => onChange(c)}
          label={label}
        />
      </RowField>
    );
  } else if (def.key === "priceRange") {
    control = (
      <RowField label={label} info={info}>
        <PriceBand value={shown} onChange={onChange} />
      </RowField>
    );
  } else if (def.valueType === "integer") {
    control = (
      <RowField label={label} info={info}>
        <Stepper
          label={label}
          value={text}
          onChange={onChange}
          placeholder={many ? MULTI_LABEL : undefined}
        />
      </RowField>
    );
  } else if (def.valueType === "text" && def.inputType === "textArea") {
    control = (
      <BoxField label={label} info={info}>
        <textarea
          value={text}
          placeholder={many ? MULTI_LABEL : undefined}
          onChange={(e) => onChange(e.target.value)}
          rows={4}
          aria-label={label}
          style={{
            width: "100%",
            boxSizing: "border-box",
            resize: "vertical",
            padding: 0,
            border: "none",
            outline: "none",
            background: "none",
            fontFamily: "inherit",
            fontSize: 11,
            lineHeight: 1.45,
            color: FIELD.ink,
          }}
        />
        <Text style={{ fontSize: 9, lineHeight: "11px", color: FIELD.muted }}>
          {text.length} characters
        </Text>
      </BoxField>
    );
  } else if (def.valueType === "enum" && def.options?.length) {
    control = (
      <ChoiceField
        label={label}
        info={info}
        value={chips[0] ?? ""}
        options={def.options}
        display={(o) => valueLabel(def.key, o)}
        onChange={(v) => onChange([v])}
        many={many}
      />
    );
  } else if (def.valueType === "image") {
    control = (
      <BoxField
        label={label}
        info={info}
        aside={
          def.key !== "logo" && def.maxCount != null && !many
            ? `${chips.length} / ${def.maxCount}`
            : undefined
        }
      >
        <ImageList
          urls={chips}
          many={many}
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
      </BoxField>
    );
  } else if (def.key === "openingHours") {
    control = (
      <OpeningHoursField
        label={label}
        info={info}
        value={shown}
        onChange={onChange}
        many={many}
      />
    );
  } else if (def.valueType === "object") {
    control = (
      <BoxField label={label} info={info}>
        <Text style={{ fontSize: 11, lineHeight: "14px", color: FIELD.ink }}>
          {many ? MULTI_LABEL : summariseObject(def.key, shown)}
        </Text>
      </BoxField>
    );
  } else if (def.valueType === "array") {
    control = (
      <ChipsField
        label={
          <>
            {label}
            {many && <MultiHint />}
          </>
        }
        info={info}
      >
        {chips.map((c) => (
          <Chip
            key={c}
            label={def.options?.length ? valueLabel(def.key, c) : c}
            onRemove={() => onChange(chips.filter((x) => x !== c))}
          />
        ))}
        {def.options?.length ? (
          <Popover open={pick} onOpenChange={setPick}>
            <PopoverTrigger asChild>
              <button type="button" aria-label={`Add ${label}`} style={addLink}>
                <Icon name="plus" size="xs" />
                Add
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
                    type="button"
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
                      fontFamily: "inherit",
                      fontSize: 12.5,
                      color: FIELD.ink,
                      borderRadius: 6,
                    }}
                  >
                    {valueLabel(def.key, o)}
                  </button>
                ))}
            </PopoverContent>
          </Popover>
        ) : adding ? (
          <input
            autoFocus
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addTyped();
              } else if (e.key === "Escape") {
                setTyped("");
                setAdding(false);
              }
            }}
            onBlur={() => {
              addTyped();
              setAdding(false);
            }}
            aria-label={`Add ${label}`}
            placeholder="Type and press Enter"
            style={{
              flex: 1,
              minWidth: 110,
              border: "none",
              outline: "none",
              background: "none",
              fontFamily: "inherit",
              fontSize: 12,
              color: FIELD.ink,
              padding: "2px 4px",
            }}
          />
        ) : (
          <button
            type="button"
            aria-label={`Add ${label}`}
            style={addLink}
            onClick={() => setAdding(true)}
          >
            <Icon name="plus" size="xs" />
            Add
          </button>
        )}
      </ChipsField>
    );
  } else {
    control = (
      <TextField
        label={label}
        info={info}
        value={text}
        onChange={onChange}
        placeholder={
          many
            ? MULTI_LABEL
            : def.valueType === "hyperlink"
              ? "https://"
              : undefined
        }
      />
    );
  }

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <div style={{ flex: 1, minWidth: 0 }}>{control}</div>
      {/* C's bin: the 20px trash in danger-500, in a 24px target 4px from the field — which
          leaves the field at C's 332. The DS IconButton has no size under 44. */}
      <button
        type="button"
        onClick={onRemove}
        aria-label={`Remove ${label} field`}
        title="Remove field"
        className="remove-field"
        style={{
          flex: "0 0 auto",
          display: "grid",
          placeItems: "center",
          width: 24,
          height: 24,
          padding: 0,
          border: "none",
          background: "none",
          cursor: "pointer",
        }}
      >
        <Icon name="trash-01" />
      </button>
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
        {/* C's tinted row: full width, 36 tall, theme-0 ground, theme-800 words. */}
        <button
          type="button"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 6,
            width: "100%",
            height: 36,
            padding: "0 12px",
            border: "none",
            borderRadius: 6,
            background: "var(--primitives-colors-theme-0)",
            cursor: "pointer",
            fontFamily: "inherit",
            fontSize: 11.5,
            fontWeight: 500,
            color: "var(--primitives-colors-theme-800)",
          }}
        >
          <Icon name="plus" size="xs" /> Add additional field
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
  location,
  onDelete,
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
  /** Where the feature is — "Main Mall / LG" — for C's header line, after its type. */
  location?: string;
  /** Delete what the panel is editing. Present only where the host can — see the Delete block. */
  onDelete?: () => void;
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
  /**
   * ⚠️ **`editing` was state that could only ever be true**, and it is gone with the read view it
   * switched to. It began true, the seed effect set it true again on every selection change, and
   * only `save()` set it false — immediately before both screens unmounted the panel. A flag whose
   * false branch nobody can reach is not a state, it is a comment that compiles.
   *
   * The panel is an editor. Selecting a feature IS edit mode here (Olcay, 2026-08-14), and that is
   * now said by the code rather than only in a note above it.
   */
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
  const values = draft;
  const mainType = String(values.mainType ?? p.mainType ?? "");
  const rawSub = values.subType ?? p.subType;
  const subType = rawSub && rawSub !== MULTIPLE ? String(rawSub) : undefined;
  const name = p.name ? String(p.name) : "";
  const suggested = suggestedFor(mainType, subType);
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
        // C's panel: radius 16, a 1px background-200 edge, and no shadow.
        borderRadius: 16,
        border: "1px solid var(--primitives-colors-background-200)",
        boxShadow: "none",
      }}
    >
      {/* The header is chrome, not content: C's band, outside the scroller, so the ✕ can neither
          scroll away nor be pushed left by the scrollbar the body grows (§0). */}
      <PanelHeader
        tone="band"
        title={
          /* Wraps, never truncates — a feature's name is the one thing here you can't
               reconstruct from anything else. */
          <Text
            style={{
              display: "block",
              fontSize: 13,
              fontWeight: 500,
              lineHeight: "16px",
              color: "var(--primitives-colors-background-900)",
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
                (draft.name !== MULTIPLE
                  ? String(draft.name ?? "")
                  : name === MULTIPLE
                    ? ""
                    : name) || `Unnamed ${typeLabel(subType || mainType)}`}
          </Text>
        }
        subtitle={
          multi
            ? "Editing all of them — a change here is a change to every one."
            : // C: "Food & Beverage Space · Main Mall / LG" — what it is, and where.
              (reviewNote ??
              [typeLabel(subType || mainType), location]
                .filter(Boolean)
                .join(" · "))
        }
        onClose={onClose}
        closeLabel="Close feature properties"
      />

      <div
        style={{
          overflow: "auto",
          flex: 1,
          minHeight: 0,
          padding: "14px 20px 16px",
        }}
      >
        {/* C: one column, 12 between everything. Its own box and not the scroller's: a flex column
            that scrolls SHRINKS its fixed-height children to fit — the 36px Add row measured 29.6 —
            where a block scroller lets them overflow and scroll. */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
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
                marginBottom: 4,
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
                    display: "grid",
                    placeItems: "center",
                    transition: "transform .15s ease",
                    transform: listOpen ? "rotate(90deg)" : "none",
                    color: MUTED,
                  }}
                >
                  {/* Was the literal ▶, drawn in whatever font the OS picked. The library chevron,
                  turned a quarter when the list is open. */}
                  <ChevronRight size={12} />
                </span>
                {/* After a combine the count is not a selection any more — it is a report of what
                  the shape now consists of, and saying "selected" about a removed wall would be
                  plainly untrue. */}
                <span style={{ fontWeight: 500 }}>{tally}</span>
                <span
                  style={{ marginLeft: "auto", fontSize: 11, color: MUTED }}
                >
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
                            // 12, down from 12.5 (Olcay, 2026-09-10: *"the title text for selected
                            // items could be slightly smaller"*). This list is a check on what is
                            // selected, not the panel's subject — the feature's own name in the
                            // header is, and at 16 it should stay the largest thing on screen. The
                            // 11px type beneath keeps the step that tells the two apart.
                            fontSize: 12,
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
                          style={{
                            display: "block",
                            fontSize: 11,
                            color: MUTED,
                          }}
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
                        {/* `sm` is 16px, not `PanelHeader`'s default 20: these rows are dense
                        (their title is 12px) and the full-size mark dominates them. */}
                        <Icon name="x-close" size="sm" />
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
          {/**
           * ⚠️ **A read view lived here and could not be reached.** `editing` started true, reset
           * to true on every selection change, and was set false only by `save()` — and both
           * screens close the panel on save, so the read branch rendered for at most one frame
           * between the save and the unmount. A leftover from when the panel had an Edit button:
           * removing that button removed the way back to it.
           *
           * Deleted rather than left as a curiosity — ~190 lines that looked load-bearing, drawn
           * from the SDK's POI-card contract, which nobody could ever see. The contract is not
           * lost with it: it is written up in the record and drawn in ⑤.
           */}
          <>
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
                  lineHeight: "14px",
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
                  minHeight: 40,
                  boxSizing: "border-box",
                  borderRadius: 8,
                  background: "var(--primitives-colors-background-100)",
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    minWidth: 0,
                    fontSize: 12,
                    lineHeight: "16px",
                    color: "var(--primitives-colors-background-900)",
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
            <div>
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
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ flex: 1, minWidth: 0 }}>
                {/* ⚠️ Typing here renames EVERY selected feature — leaving it be keeps their own
                  names, which is why the placeholder has to say what is in there rather than look
                  like an empty required field. */}
                <TextField
                  label="Name *"
                  info={propertyDef("name").description || undefined}
                  value={
                    draft.name === MULTIPLE ? "" : String(draft.name ?? "")
                  }
                  onChange={(v) => setDraft((d) => ({ ...d, name: v }))}
                  placeholder={
                    draft.name === MULTIPLE ? MULTI_LABEL : "Unnamed"
                  }
                  ariaLabel="Feature name"
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
                style={{ display: "flex", flexDirection: "column", gap: 12 }}
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

            {/**
             * **Delete** — C's own block (Workbench `589:1079`, Olcay 2026-09-10): full width, a tonal
             * danger ground rather than a filled red. Present only where the host can delete; the
             * review screen does not pass `onDelete`, so it has none. The confirmation is the host's,
             * and it names what goes.
             */}
            {onDelete && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <button
                  type="button"
                  onClick={onDelete}
                  className="delete-feature"
                  style={{
                    width: "100%",
                    height: 36,
                    flexShrink: 0,
                    border: "none",
                    borderRadius: 6,
                    background: "var(--primitives-colors-emotional-danger-0)",
                    color: "var(--primitives-colors-emotional-danger-700)",
                    fontFamily: "inherit",
                    fontSize: 11.5,
                    fontWeight: 500,
                    cursor: "pointer",
                  }}
                >
                  {multi
                    ? `Delete ${liveRows.length} features`
                    : "Delete feature"}
                </button>
                {multi && (
                  <Text
                    style={{ fontSize: 9.5, lineHeight: "12px", color: MUTED }}
                  >
                    The confirmation will name{" "}
                    {liveRows.length === 2 ? "both" : `all ${liveRows.length}`}
                  </Text>
                )}
              </div>
            )}

            <Text
              style={{
                display: "block",
                fontSize: 11,
                color: MUTED,
                lineHeight: 1.45,
              }}
            >
              {reviewFootnote ??
                "Edits are local to this prototype — nothing is written back to Pointr Cloud."}
            </Text>
          </>
        </div>
      </div>

      {/* The editor's footer, pinned like the real panel's — Cancel beside a primary that only
          lights when there is something to save. */}
      {
        <>
          {/* C's footer: the two buttons on a background-100 band, no rule above. */}
          <div
            style={{
              display: "flex",
              gap: 8,
              padding: "12px 20px",
              flex: "0 0 auto",
              background: "var(--primitives-colors-background-100)",
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
      }
    </Card>
  );
}
