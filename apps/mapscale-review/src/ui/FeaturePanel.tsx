import { Text } from "@kozmos/react";
import { PanelHeader, PANEL_PAD } from "./PanelHeader";
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
 * **Read-only** (Olcay's ruling on §19.3). The row menu's Edit stays inert: editing is US8's, and
 * US8's Edit also owns de-flagging (§18a), so the semantics get ruled once in one place rather
 * than invented here against D3's "nothing persists" limit.
 *
 * ⚠️ **It never competes with the map's own change card (`#tip`).** That card is about a *change*
 * in a review and carries the ✓/🚩/✗ decision; this panel is about a feature that simply exists.
 * They cannot collide, and structurally so: `MapContent` passes `changes={NO_CHANGES}`, so there
 * is no change on this screen for `#tip` to describe. §3's rule that a card is *where you decide
 * it* is preserved — nothing here decides anything.
 */
export const FEATURE_PANEL_WIDTH = 340;
/** The inset from the map's edges — matched to the Map Settings control in the opposite corner. */
const PANEL_INSET = 12;

const MUTED = "var(--primitives-colors-background-600)";
const LINE = "var(--primitives-colors-background-900)";

/**
 * The properties the vector tiles actually carry, in the order a POI card reads them: identity
 * first, then where it sits, then what it is.
 *
 * ⚠️ **This is the whole of what the SDK has.** The rich properties a POI card would normally show
 * — `openingHours`, `cuisines`, `priceRange` — live in the **content API**, which this prototype
 * does not call. They are named further down as expected-and-not-loaded rather than invented,
 * which is the same honesty as "as loaded" on the level counts.
 */
const TILE_PROPS: { key: string; label: string }[] = [
  { key: "fid", label: "Feature ID" },
  { key: "bid", label: "Building ID" },
  { key: "sid", label: "Site ID" },
  { key: "lvl", label: "Level index" },
  { key: "mainType", label: "Main type" },
  { key: "subType", label: "Sub type" },
  { key: "mapPersonas", label: "Map personas" },
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

function Row({ label, value }: { label: string; value: string }) {
  const empty = value === "—";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "baseline",
        gap: 12,
        padding: "7px 0",
        borderBottom: `1px solid ${LINE}`,
        fontSize: 12,
      }}
    >
      <span style={{ flex: "0 0 104px", color: MUTED }}>{label}</span>
      <span
        style={{
          flex: 1,
          minWidth: 0,
          color: empty ? MUTED : "var(--review-ink)",
          fontVariantNumeric: "tabular-nums",
          // An id is long and has no spaces; wrapping it beats an ellipsis that hides the half
          // you were trying to read.
          overflowWrap: "anywhere",
        }}
      >
        {value}
      </span>
    </div>
  );
}

// `string`, not ReactNode: the monorepo resolves two copies of @types/react, and handing the DS's
// `Text` a ReactNode typed by the app's copy fails to assign. Every caller passes a string anyway.
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
        marginBottom: 4,
      }}
    >
      {children}
    </Text>
  );
}

export function FeaturePanel({
  props: p,
  icon,
  onClose,
}: {
  /** The tile's own property bag, exactly as the map reported it. */
  props: Record<string, unknown>;
  /** The taxonomy sprite for this type — passed in, so this file needs no map context. */
  icon?: React.ReactNode;
  onClose: () => void;
}) {
  const mainType = String(p.mainType ?? "");
  const subType = p.subType ? String(p.subType) : undefined;
  const name = p.name ? String(p.name) : "";
  const cls = classOf(mainType, subType);
  const category = categoryOf(mainType, subType);
  const suggested = suggestedFor(mainType, subType);

  return (
    <div
      style={{
        position: "absolute",
        top: PANEL_INSET,
        right: PANEL_INSET,
        bottom: PANEL_INSET,
        width: FEATURE_PANEL_WIDTH,
        background: "#fff",
        border: `1px solid ${LINE}`,
        borderRadius: 12,
        boxShadow: "0 8px 28px rgba(0,0,0,.14)",
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
                  the words that distinguish it from the counter next to it. Same fault the
                  ConfirmOverlay titles had (§0, 2026-08-12) and the same fix. */}
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

      <div style={{ overflow: "auto", flex: 1, minHeight: 0, padding: "0 20px 16px" }}>
        <SectionTitle>Properties</SectionTitle>
        <div>
          {TILE_PROPS.map((f) => (
            <Row key={f.key} label={f.label} value={show(p[f.key])} />
          ))}
        </div>

        <div style={{ marginTop: 18 }}>
          <SectionTitle>Expected for this type</SectionTitle>
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
                The taxonomy expects a {typeLabel(subType || mainType).toLowerCase()} to carry these.
                They live in the content API, which this prototype doesn’t call — so they are named,
                not filled in.
              </Text>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                {suggested.map((s) => (
                  <span
                    key={s}
                    style={{
                      fontSize: 11,
                      padding: "3px 8px",
                      borderRadius: 999,
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
  );
}
