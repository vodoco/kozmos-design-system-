import { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
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
import { DecisionGlyph } from "./ChangeReviewRow";
import { decisionInk } from "../mock/diff";
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
} from "../mock/properties";

/**
 * The POI properties panel (§19) — what a selected feature *is*, and now what it can be *made* to
 * be.
 *
 * **Floating over the map's right edge, not a third column** (Olcay, 2026-08-12: *"floating panel
 * on the map's right, don't resize map but center — offset the key element on the map"*). The map
 * keeps its width and the *camera* makes room: `focusPadRight` frames the feature in the part of
 * the map the panel doesn't cover.
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
const LINE = "var(--primitives-colors-background-900)";
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
]);

/**
 * ⚠️ **`@kozmos/icons` has no copy glyph** — the set is 35 icons and `copy-01` isn't among them,
 * which is the same D9 gap that already cost this app globe, sparkle, ellipsis and settings-04.
 * Drawn locally rather than substituted with something that means a different thing.
 */
function CopyGlyph() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 16 16"
      aria-hidden
      focusable="false"
    >
      <rect
        x="5.5"
        y="5.5"
        width="8"
        height="8"
        rx="1.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
      />
      <path
        d="M10.5 3.5 H3.5 a1 1 0 0 0-1 1 V11"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
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

/* ── editing: the dashboard's field editor ───────────────────────────────────── */

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
  const chips = toArray(value);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
        marginTop: 12,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        {def.valueType === "boolean" ? (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 0",
            }}
          >
            <Switch
              checked={isTruthy(value)}
              onCheckedChange={(c: boolean) => onChange(c)}
              id={`f-${def.key}`}
            />
            <label
              htmlFor={`f-${def.key}`}
              style={{ fontSize: 13, color: INK, cursor: "pointer" }}
            >
              {label}
            </label>
          </div>
        ) : def.valueType === "text" && def.inputType === "textArea" ? (
          <div>
            <Text
              style={{
                display: "block",
                fontSize: 11,
                color: MUTED,
                marginBottom: 4,
              }}
            >
              {label}
            </Text>
            <textarea
              value={String(value ?? "")}
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
        ) : def.options?.length ? (
          /* A closed list: chips you have, plus a picker. `array` takes many, `enum` takes one —
             which is the only difference between them and the reason both are kept. */
          <div>
            <Text
              style={{
                display: "block",
                fontSize: 11,
                color: MUTED,
                marginBottom: 4,
              }}
            >
              {label}
            </Text>
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
                          onChange(
                            def.valueType === "enum" ? [o] : [...chips, o],
                          );
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
                        {o}
                      </button>
                    ))}
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ) : (
          <Input
            label={label}
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            type={def.valueType === "integer" ? "number" : "text"}
            placeholder={def.valueType === "hyperlink" ? "https://" : undefined}
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
        style={{ flex: "0 0 auto", marginTop: 18 }}
      >
        <Icon name="trash-01" />
      </IconButton>
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
  const match = (k: string) =>
    !q || propertyLabel(k).toLowerCase().includes(q.toLowerCase());
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
  flagged,
  flagShared,
  flagNote,
  onDirtyChange,
  geometryDirty,
  onCommitGeometry,
  subTypeOptions,
  onEdited,
  onSaved,
  onCancelEdit,
  saveSignal,
  onClose,
}: {
  /** The tile's own property bag plus any local edits, exactly as the app holds it. */
  props: Record<string, unknown>;
  icon?: React.ReactNode;
  flagged?: boolean;
  flagShared?: number;
  /** What the reviewer wrote when they raised the flag, if anything. */
  flagNote?: string;
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
  subTypeOptions?: string[];
  /** An edit was saved. Carries the flag-clearing consequence (§18a) up. D3: nothing persists. */
  onEdited?: (next: Record<string, unknown>) => void;
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
  onClose: () => void;
}) {
  const mainType = String(p.mainType ?? "");
  const subType = p.subType ? String(p.subType) : undefined;
  const name = p.name ? String(p.name) : "";
  const cls = classOf(mainType, subType);
  const category = categoryOf(mainType, subType);
  const suggested = suggestedFor(mainType, subType);

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
  const [draft, setDraft] = useState<Record<string, unknown>>({});
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
  useEffect(() => {
    setEditing(true);
    setDraft({ ...p });
    setFields(Object.keys(p).filter((k) => !RESERVED.has(k)));
    // Keyed on `p.fid` alone: re-seeding on every property change would wipe a half-typed
    // edit. (No eslint-disable — this config has no `react-hooks/exhaustive-deps` rule, so
    // the directive is itself an error and fails the pre-commit hook.)
  }, [p.fid]);

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
    return false;
  }, [p, draft, fields]);
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

  const values = editing ? draft : p;
  const description = String(values.description ?? "");
  const options = subTypeOptions?.length
    ? subTypeOptions
    : subType
      ? [subType]
      : [];

  /** Not-yet-added properties, split the way the picker shows them. */
  const canAdd = useMemo(() => {
    const have = new Set(fields);
    const sug = (suggested ?? []).filter((k) => !have.has(k));
    const others = [
      "description",
      "websiteUrl",
      "hasAssistance",
      "serviceTypes",
      "openingHours",
      "priceRange",
    ].filter((k) => !have.has(k) && !sug.includes(k));
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
    // Only the keys the editor owns; identity is never in the draft's gift.
    const next: Record<string, unknown> = {
      name: draft.name ?? "",
      subType: draft.subType,
    };
    for (const k of fields) next[k] = draft[k];
    onEdited?.(next);
    onSaved?.(String(draft.name ?? "").trim());
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
        right: PANEL_INSET,
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
          title={
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 8,
                marginTop: 2,
              }}
            >
              <span style={{ flex: "0 0 auto", marginTop: 2 }}>{icon}</span>
              {/* Wraps, never truncates — a feature's name is the one thing here you can't
                  reconstruct from anything else. */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: "var(--primitives-colors-theme-900)",
                  overflowWrap: "anywhere",
                }}
              >
                {(editing ? String(draft.name ?? "") : name) ||
                  `Unnamed ${typeLabel(subType || mainType)}`}
              </Text>
            </div>
          }
          subtitle={
            editing
              ? "You are editing this feature’s properties."
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
        {/* A DS `Alert` in its default (neutral) variant, deliberately not `warning`: §3 reserves
            traffic-light for magnitude, and being flagged is something *you* did, not a size. */}
        {flagged && !editing && (
          <Alert style={{ padding: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span
                style={{
                  flex: "0 0 auto",
                  marginTop: 1,
                  color: decisionInk("flag"),
                }}
              >
                <DecisionGlyph kind="flag" size={16} />
              </span>
              <div style={{ minWidth: 0 }}>
                <AlertTitle
                  style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}
                >
                  Flagged during review
                </AlertTitle>
                <AlertDescription
                  style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.45 }}
                >
                  {flagShared
                    ? `A review flagged “${name}”, and ${flagShared} features on this floor share that name — so the flag may be about any of them. Editing clears it.`
                    : "Someone marked this to come back to. Editing this feature clears the flag."}
                </AlertDescription>
                {/* The note, in the reviewer's own words. Quoted rather than paraphrased into the
                    sentence above: it is somebody's writing, and this panel is where the person
                    who has to act on it finally reads it. */}
                {flagNote && (
                  <div
                    style={{
                      marginTop: 8,
                      paddingLeft: 10,
                      borderLeft: `3px solid ${decisionInk("flag")}`,
                      fontSize: 12,
                      lineHeight: 1.45,
                      color: "var(--review-ink)",
                    }}
                  >
                    “{flagNote}”
                  </div>
                )}
              </div>
            </div>
          </Alert>
        )}

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

            {/* FID: read-only with a copy button, exactly as the real panel draws it. */}
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
                  padding: "8px 10px",
                  borderRadius: "var(--primitives-radius-lg, 8px)",
                  border: `1px solid ${LINE}`,
                  background: "var(--primitives-colors-theme-0)",
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
                <IconButton
                  variant="ghost"
                  size="sm"
                  aria-label="Copy FID"
                  title="Copy"
                  onClick={() =>
                    navigator.clipboard?.writeText(String(p.fid ?? ""))
                  }
                  style={{ flex: "0 0 auto" }}
                >
                  <CopyGlyph />
                </IconButton>
              </div>
            </div>

            {/* Select type: the mainType is context, the subType is the value — the real panel's
                anatomy, and it is right, because a feature's mainType is not a free choice. */}
            <div style={{ marginTop: 12 }}>
              <Text style={{ display: "block", fontSize: 11, color: MUTED }}>
                Select type
              </Text>
              <Text
                style={{
                  display: "block",
                  fontSize: 11,
                  color: MUTED,
                  marginBottom: 4,
                }}
              >
                {typeLabel(mainType)}
              </Text>
              <Select
                value={String(draft.subType ?? "")}
                onValueChange={(v) => setDraft((d) => ({ ...d, subType: v }))}
              >
                <SelectTrigger aria-label="Sub type">
                  <SelectValue placeholder="—" />
                </SelectTrigger>
                <SelectContent>
                  {options.map((o) => (
                    <SelectItem key={o} value={o}>
                      {typeLabel(o)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div style={{ marginTop: 12 }}>
              <Input
                label="Name *"
                value={String(draft.name ?? "")}
                onChange={(e) =>
                  setDraft((d) => ({ ...d, name: e.target.value }))
                }
                placeholder="Unnamed"
                aria-label="Feature name"
              />
            </div>

            {fields.map((k) => (
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
              Edits are local to this prototype — nothing is written back to
              Pointr Cloud.
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
