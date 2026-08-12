import { useEffect, useState } from "react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  Input,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Separator,
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

/**
 * The POI properties panel (§19) — what a selected feature *is*, read straight off the map.
 *
 * **Floating over the map's right edge, not a third column** (Olcay, 2026-08-12: *"floating panel
 * on the map's right, don't resize map but center — offset the key element on the map"*). Two
 * reasons it isn't a column: selection is transient, so a column would reflow the map on every
 * click and re-frame the very thing you selected; and at 1280px the map pane is 744px, which a
 * third column would cut to 404px. Instead the map keeps its width and the *camera* makes room —
 * `focusPadRight` frames the feature in the part of the map the panel doesn't cover.
 *
 * ⚠️ **It never competes with the map's own change card (`#tip`).** That card is about a *change*
 * in a review and carries the ✓/🚩/✗ decision; this panel is about a feature that simply exists.
 * They cannot collide, and structurally so: `MapContent` passes `changes={NO_CHANGES}`, so there
 * is no change on this screen for `#tip` to describe.
 *
 * **Built on the DS** (Olcay, 2026-08-12: *"let's use design system for the panel"*) — `Card` for
 * the surface, `Separator` between sections, `Alert` for the flag, `Input`/`Select`/`Button` for
 * the edit mode. ⚠️ **Two DS components that look right and are not**, worth recording rather than
 * quietly working around: `POICard` is the *consumer wayfinding* card (hero image, `text-xl`
 * heading, action footer) and `Badge` is touch-sized at `h-11` — both are scaled for the end-user
 * SDK app, not a dashboard inspector at 340px. The DS has no dense property-list component; the
 * rows below are the app's own, built from DS type and tokens.
 */
export const FEATURE_PANEL_WIDTH = 340;
/** The inset from the map's edges — matched to the Map Settings control in the opposite corner. */
const PANEL_INSET = 12;

const MUTED = "var(--primitives-colors-background-600)";
const LINE = "var(--primitives-colors-background-900)";

/**
 * The properties the vector tiles actually carry, in the order a POI card reads them: what it is
 * first, then the identifiers that place it.
 *
 * `editable` marks the two a person can meaningfully correct. **The identifiers deliberately are
 * not**: `fid`/`bid`/`sid`/`lvl` say *which feature this is and where it lives*, and a text box
 * around them would offer to re-parent a feature into another building — which is not an edit, it
 * is a data corruption with a cursor in it.
 *
 * ⚠️ **This is the whole of what the SDK has.** The rich properties a POI card would normally show
 * — `openingHours`, `cuisines`, `priceRange` — live in the **content API**, which this prototype
 * does not call. They are named further down as expected-and-not-loaded rather than invented.
 */
const TILE_PROPS: { key: string; label: string; editable?: boolean }[] = [
  { key: "name", label: "Name", editable: true },
  { key: "subType", label: "Sub type", editable: true },
  { key: "mainType", label: "Main type" },
  { key: "mapPersonas", label: "Map personas" },
  { key: "fid", label: "Feature ID" },
  { key: "bid", label: "Building ID" },
  { key: "sid", label: "Site ID" },
  { key: "lvl", label: "Level index" },
];

/**
 * Print a tile property the way a person reads it.
 *
 * ⚠️ **The tiles carry `mapPersonas` as a JSON *string*, not an array** — it arrives as
 * `["visitor","customer","staff",…]` and printed raw it fills the panel with brackets and quotes,
 * which is the machine's punctuation rather than the value. Parse it back and join.
 */
function show(v: unknown): string {
  if (v == null || v === "") return "—";
  if (Array.isArray(v)) return v.length ? v.join(", ") : "—";
  if (typeof v === "string") {
    const s = v.trim();
    if (s.startsWith("[") && s.endsWith("]")) {
      try {
        const parsed: unknown = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed.length ? parsed.map(String).join(", ") : "—";
      } catch {
        /* not JSON after all — fall through and print it as written */
      }
    }
    return v;
  }
  if (typeof v === "object") {
    try {
      return JSON.stringify(v);
    } catch {
      return String(v);
    }
  }
  return String(v);
}

/** A read-only property: label above value, so a long id gets the panel's full width to wrap in. */
function Row({ label, value }: { label: string; value: string }) {
  const empty = value === "—";
  return (
    <div style={{ padding: "9px 0" }}>
      <Text
        style={{
          display: "block",
          fontSize: 11,
          lineHeight: "14px",
          color: MUTED,
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          display: "block",
          fontSize: 13,
          lineHeight: "18px",
          marginTop: 2,
          color: empty ? MUTED : "var(--review-ink)",
          // An id is long and has no spaces; wrapping beats an ellipsis that hides the half you
          // were trying to read. Stacked under its label, it has 300px to do it in rather than 200.
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </Text>
    </div>
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

export function FeaturePanel({
  props: p,
  icon,
  flagged,
  flagShared,
  subTypeOptions,
  onEdited,
  onClose,
}: {
  /** The tile's own property bag, exactly as the map reported it. */
  props: Record<string, unknown>;
  /** The taxonomy sprite for this type — passed in, so this file needs no map context. */
  icon?: React.ReactNode;
  /** Was this feature flagged in the level's most recent review? */
  flagged?: boolean;
  /**
   * Set when more than one feature on the floor carries this name, which is how many the flag could
   * be about. A review records the *name*, so with duplicates it cannot say which — and the notice
   * says so rather than pointing confidently at whichever one you happened to open.
   */
  flagShared?: number;
  /** The subTypes this feature's mainType offers — the floor's own, so the list can't drift. */
  subTypeOptions?: string[];
  /**
   * An edit was saved. Carries the flag-clearing consequence (§18a) up to whoever owns the review.
   * ⚠️ D3's limit stands: nothing here survives a reload.
   */
  onEdited?: (next: { name: string; subType?: string }) => void;
  onClose: () => void;
}) {
  const mainType = String(p.mainType ?? "");
  const subType = p.subType ? String(p.subType) : undefined;
  const name = p.name ? String(p.name) : "";
  const cls = classOf(mainType, subType);
  const category = categoryOf(mainType, subType);
  const suggested = suggestedFor(mainType, subType);

  /**
   * Edit mode (Olcay, 2026-08-12: *"maybe edit turns it into editable fields?"*).
   *
   * This is §6a's agreed shape arriving at last — *metadata inline, geometry stays flag-for-later*
   * — and it is where **§18a's de-flagging lands**: the ruling was that editing the feature clears
   * its flag implicitly, and until now nothing in the app could edit a feature, so no flag could
   * ever be cleared. Saving here is that affordance.
   */
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(name);
  const [draftSubType, setDraftSubType] = useState(subType ?? "");
  // Selecting a different feature must not carry the previous one's half-typed edit across.
  useEffect(() => {
    setEditing(false);
    setDraftName(name);
    setDraftSubType(subType ?? "");
  }, [p.fid, name, subType]);

  const dirty = draftName !== name || draftSubType !== (subType ?? "");
  const options = subTypeOptions?.length ? subTypeOptions : subType ? [subType] : [];

  const save = () => {
    setEditing(false);
    if (dirty) onEdited?.({ name: draftName, subType: draftSubType || undefined });
  };

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
        // above the map's own chrome, below any overlay that takes the whole screen
        zIndex: 5,
      }}
    >
      {/* The header is chrome, not content: its own non-scrolling block with PANEL_PAD, so the ✕
          can neither scroll away nor be pushed left by the scrollbar the body grows. That is the
          rule PANEL_PAD exists to hold (Olcay, 2026-08-11). */}
      <div style={{ padding: PANEL_PAD, flex: "0 0 auto" }}>
        <PanelHeader
          title={
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginTop: 2 }}>
              <span style={{ flex: "0 0 auto", marginTop: 2 }}>{icon}</span>
              {/* Wraps, never truncates. A feature's NAME is the one thing on this card you can't
                  reconstruct from anything else, and `Emirates Ticket Sales Cou…` cuts off exactly
                  the words that distinguish it from the counter next to it. */}
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 600,
                  lineHeight: 1.3,
                  color: "var(--primitives-colors-theme-900)",
                  overflowWrap: "anywhere",
                }}
              >
                {/* Unnamed is the common case for structural geometry — say which KIND of unnamed
                    thing it is rather than printing a bare dash. */}
                {name || `Unnamed ${typeLabel(subType || mainType)}`}
              </Text>
            </div>
          }
          subtitle={[CLASS_LABEL[cls], category ? categoryLabel(category) : null, typeLabel(subType || mainType)]
            .filter(Boolean)
            .join(" · ")}
          onClose={onClose}
          closeLabel="Close feature properties"
        />
      </div>

      <Separator />

      <div style={{ overflow: "auto", flex: 1, minHeight: 0, padding: "14px 20px 16px" }}>
        {/*
          The flag, on the one surface that describes a single feature.

          A DS `Alert` in its **default** (neutral) variant, deliberately not `warning`: §3 reserves
          traffic-light for magnitude, and being flagged is something *you* did, not a size. The
          glyph and its ink are the review's own, so this reads as the same decision you took there
          rather than a second, similar-looking fact.
        */}
        {flagged && (
          <Alert style={{ padding: 12, marginBottom: 16 }}>
            <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <span style={{ flex: "0 0 auto", marginTop: 1, color: decisionInk("flag") }}>
                <DecisionGlyph kind="flag" size={16} />
              </span>
              <div style={{ minWidth: 0 }}>
                <AlertTitle style={{ fontSize: 12.5, fontWeight: 600, marginBottom: 2 }}>
                  Flagged during review
                </AlertTitle>
                <AlertDescription style={{ fontSize: 11.5, color: MUTED, lineHeight: 1.45 }}>
                  {flagShared
                    ? `A review flagged “${name}”, and ${flagShared} features on this floor share that name — so the flag may be about any of them. Editing clears it.`
                    : "Someone marked this to come back to. Editing this feature clears the flag."}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        )}

        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <SectionTitle>Properties</SectionTitle>
          <span style={{ flex: 1 }} />
          {/* Edit is the row menu's promise finally kept — see the editing note above. */}
          {!editing ? (
            <Button variant="outline" size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
          ) : (
            <div style={{ display: "flex", gap: 6 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setDraftName(name);
                  setDraftSubType(subType ?? "");
                }}
              >
                Cancel
              </Button>
              <Button size="sm" onClick={save}>
                Done
              </Button>
            </div>
          )}
        </div>

        <div>
          {TILE_PROPS.map((f, i) => {
            const editableNow = editing && f.editable;
            return (
              <div key={f.key}>
                {i > 0 && <Separator />}
                {editableNow && f.key === "name" ? (
                  <div style={{ padding: "10px 0" }}>
                    <Input
                      label="Name"
                      value={draftName}
                      onChange={(e) => setDraftName(e.target.value)}
                      placeholder="Unnamed"
                      aria-label="Feature name"
                    />
                  </div>
                ) : editableNow && f.key === "subType" ? (
                  <div style={{ padding: "10px 0" }}>
                    <Text style={{ display: "block", fontSize: 11, lineHeight: "14px", color: MUTED, marginBottom: 4 }}>
                      Sub type
                    </Text>
                    <Select value={draftSubType} onValueChange={setDraftSubType}>
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
                ) : (
                  <Row label={f.label} value={show(p[f.key])} />
                )}
              </div>
            );
          })}
        </div>

        {editing && (
          // The honest footnote. D3: this prototype persists nothing, and an edit panel is exactly
          // where somebody would assume otherwise.
          <Text style={{ display: "block", fontSize: 11, color: MUTED, lineHeight: 1.45, marginTop: 10 }}>
            Edits are local to this prototype — nothing is written back to Pointr Cloud.
          </Text>
        )}

        <div style={{ marginTop: 20 }}>
          <SectionTitle>Expected for this type</SectionTitle>
          <div style={{ marginTop: 6 }}>
            {suggested == null ? (
              // An unknown type reports nothing rather than borrowing another type's list — see
              // the cache's note in mock/taxonomy.ts.
              <Text style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
                This type isn’t in the cached taxonomy, so what it should carry isn’t known here.
              </Text>
            ) : suggested.length === 0 ? (
              // A real answer, not a gap: wall, furniture and operational-space genuinely suggest
              // nothing. Saying so beats an empty box that reads as a loading failure.
              <Text style={{ fontSize: 12, color: MUTED, lineHeight: 1.5 }}>
                The taxonomy suggests no additional properties for this type.
              </Text>
            ) : (
              <>
                <Text style={{ fontSize: 12, color: MUTED, lineHeight: 1.5, display: "block", marginBottom: 8 }}>
                  The taxonomy expects a {typeLabel(subType || mainType).toLowerCase()} to carry
                  these. They live in the content API, which this prototype doesn’t call — so they
                  are named, not filled in.
                </Text>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                  {suggested.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: 11,
                        padding: "3px 8px",
                        borderRadius: "var(--primitives-radius-lg, 8px)",
                        border: `1px dashed ${LINE}`,
                        color: MUTED,
                        background: "var(--primitives-colors-background-100)",
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
