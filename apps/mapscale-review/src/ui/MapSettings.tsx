import { useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Slider,
  Switch,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@kozmos/react";
import type { MapPrefs } from "../map/PointrMap";

export type MapPrefsState = MapPrefs;

const BASE_MAPS: { value: MapPrefs["basemap"]; label: string; src: string }[] =
  [
    { value: "vector", label: "Vector", src: "/basemap-vector.png" },
    { value: "satellite", label: "Satellite", src: "/basemap-satellite.png" },
  ];

const SECTION_HEAD: React.CSSProperties = {
  fontSize: 10,
  letterSpacing: 1,
  color: "#9AA0A6",
  fontWeight: 600,
  margin: "12px 0 2px",
};

/**
 * A preference row: **name on the left, switch on the right** (Olcay, 2026-08-16: *"the toggles
 * should be on the right side not left"*).
 *
 * ⚠️ The DS `Switch`'s own `label` prop renders the label *after* the control, so it is deliberately
 * not used — this is the app's own row with the DS switch dropped into its right-hand end. Patching
 * the DS component was the alternative and is the wrong lever: its order is a house convention for
 * every product built on it, and one screen's preference is not grounds for changing that.
 *
 * The same shape as the properties panel's boolean fields, so the two agree.
 */
function PrefRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: (v: boolean) => void;
}) {
  const id = `pref-${label.replace(/\W+/g, "-").toLowerCase()}`;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 12,
      }}
    >
      <label
        htmlFor={id}
        style={{
          fontSize: 14,
          fontWeight: 500,
          color: "var(--review-ink)",
          cursor: "pointer",
          minWidth: 0,
        }}
      >
        {label}
      </label>
      {/* ⚠️ A span, because the DS wrapper is `w-full` and `wrapperClassName` cannot undo it —
          this app runs no Tailwind over its own source, so an invented class is never compiled.
          Shrink-to-fit resolves the inner `width: 100%` against the switch's own max-content. */}
      <span style={{ display: "inline-flex", flex: "0 0 auto" }}>
        <Switch id={id} checked={checked} onCheckedChange={onCheckedChange} />
      </span>
    </div>
  );
}

/**
 * v9's "Map View Preferences" popover — every control here drives the live map.
 *
 * The FOCUS section is review-only. Greying out unchanged features and hiding POI labels are both
 * ways of getting noise out from between you and the diff; on a screen where you are simply looking
 * at a level there is no diff, so the controls would do nothing but confuse. Pass `focus` on the
 * review screens — the ones that actually draw a diff.
 */
export function MapSettings({
  prefs,
  onChange,
  focus = false,
}: {
  prefs: MapPrefs;
  onChange: (p: MapPrefs) => void;
  /**
   * Show the FOCUS section. Set by the screens that draw a **diff** — Manual Review, and S1 for
   * its diff-drawing panes (§3: focus follows the diff, not the screen). A screen with no diff
   * would only be offering to grey out nothing.
   */
  focus?: boolean;
}) {
  /**
   * True while the transparency slider is being dragged, so its value tooltip stays open through
   * the drag — Radix dismisses hover-tooltips on pointer-down, which would hide the number at the
   * exact moment it changes. `undefined` when idle hands control back to hover/focus.
   */
  const [sliding, setSliding] = useState(false);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          title="Map settings"
          style={{
            position: "absolute",
            left: 16,
            bottom: 16,
            width: 44,
            height: 44,
            borderRadius: 12,
            background: "#fff",
            border: "1px solid #E7E9EE",
            boxShadow: "0 2px 6px rgba(0,0,0,.16)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
        >
          {/*
            v9's settings-04 sliders (node 19452:255828) — the trigger briefly wore settings-01's
            gear, which is the wrong glyph. @kozmos/icons only ships settings-01, so this is a
            Figma export like the ai-* sparkles (DS gap D9: raise settings-04 with the icon set).
          */}
          <img
            src="/icons/settings-04.svg"
            alt=""
            width={20}
            height={16}
            style={{ display: "block" }}
          />
        </button>
      </PopoverTrigger>
      {/* 280 matches the v9 component (widened 2026-08-18 to give the in-row slider real travel —
          at 268 each 5% step was ~3px of thumb movement, coarse for a pointer). */}
      <PopoverContent side="top" align="start" style={{ width: 280 }}>
        <div style={{ fontWeight: 600, color: "var(--review-ink)" }}>
          Map View Preferences
        </div>

        {focus && (
          <>
            <div style={SECTION_HEAD}>FOCUS</div>
            <PrefRow
              label="Grey out unchanged"
              checked={prefs.greyscale}
              onCheckedChange={(v) => onChange({ ...prefs, greyscale: v })}
            />
            <PrefRow
              label="Hide POI labels"
              checked={prefs.hidePoiLabels}
              onCheckedChange={(v) => onChange({ ...prefs, hidePoiLabels: v })}
            />
          </>
        )}

        {/*
         * ⚠️ No FLOOR SOURCE section any more (Olcay, 2026-08-18: "Draw floor from GeoJSON doesn't
         * make sense… in our product we show the original floor plan as PNG"). The A/B switch was
         * a prototype diagnostic, never a product control. `MapPrefs.geojsonFloor` SURVIVES as
         * plumbing — the render swap still honours a posted value and still defaults to on — so
         * the diagnostic can be driven from code; it just no longer wears a row in a
         * product-shaped popover.
         */}
        <div style={SECTION_HEAD}>FLOOR-PLAN OVERLAY</div>
        {/*
         * One row, three parts (Olcay, 2026-08-18: "integrated in the same row. No need to say
         * transparency. Value could be a tooltip.") — the same shape as the Building Wizard's
         * reference-level row, which is where the slider idiom comes from. The overlay is the
         * ORIGINAL floor-plan (a PNG in the product), and the slider is its transparency, so it
         * lives inside the floor-plan's own row where it cannot read as a panel-wide preference.
         * No label on purpose: between a row that already says "Show Floor-plan" and its switch,
         * the slider has exactly one plausible meaning — the tooltip carries the number.
         *
         * DS-component note: this is the DS `Slider` + `Tooltip` composed, which covers hover and
         * drag (`sliding` holds the tooltip open through a drag). What the DS does NOT offer is a
         * thumb-anchored value tooltip that tracks the knob — this one anchors to the track. Good
         * enough here; recorded in KOZMOS_DS_IMPROVEMENTS.md as "Slider needs a value-tooltip
         * variant — we need to build it."
         */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <label
            htmlFor="pref-show-floor-plan"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--review-ink)",
              cursor: "pointer",
              flex: "0 0 auto",
            }}
          >
            Show Floor-plan
          </label>
          {prefs.floorplan && (
            <TooltipProvider delayDuration={150}>
              <Tooltip open={sliding || undefined}>
                <TooltipTrigger asChild>
                  {/* Double-click returns to the default — 50%, the overlay's historical look.
                      The lightest form of v9's own "Revert changes" idiom. */}
                  <span
                    style={{ flex: 1, minWidth: 0, display: "block" }}
                    onDoubleClick={() =>
                      onChange({ ...prefs, floorplanTransparency: 0.5 })
                    }
                  >
                    <Slider
                      min={0}
                      max={1}
                      step={0.05}
                      value={[prefs.floorplanTransparency ?? 0.5]}
                      onValueChange={([v]) => {
                        setSliding(true);
                        onChange({ ...prefs, floorplanTransparency: v });
                      }}
                      onValueCommit={() => setSliding(false)}
                      aria-label="Floor-plan transparency"
                    />
                  </span>
                </TooltipTrigger>
                <TooltipContent side="top">
                  {/* "transparent", not a bare number — 50% alone invites the
                      opacity-or-transparency question. */}
                  {Math.round((prefs.floorplanTransparency ?? 0.5) * 100)}%
                  transparent
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {/* v9's row keeps a help glyph, and the PNG-overlay explanation needs a home.
              Inline SVG because @kozmos/icons ships no help/question glyph — the D9 gap again. */}
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-label="What is the floor-plan overlay?"
                  style={{
                    width: 16,
                    height: 16,
                    padding: 0,
                    border: "none",
                    background: "none",
                    cursor: "help",
                    flex: "0 0 auto",
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  <svg width={14} height={14} viewBox="0 0 14 14" aria-hidden>
                    <circle
                      cx={7}
                      cy={7}
                      r={6.3}
                      fill="none"
                      stroke="var(--primitives-colors-background-600)"
                      strokeWidth={1.2}
                    />
                    <path
                      d="M5.4 5.4a1.7 1.7 0 1 1 2.5 1.5c-.55.3-.9.6-.9 1.2"
                      fill="none"
                      stroke="var(--primitives-colors-background-600)"
                      strokeWidth={1.2}
                      strokeLinecap="round"
                    />
                    <circle
                      cx={7}
                      cy={10.4}
                      r={0.8}
                      fill="var(--primitives-colors-background-600)"
                    />
                  </svg>
                </button>
              </TooltipTrigger>
              <TooltipContent side="top">
                The original floor-plan drawing, shown over the map.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <span
            style={{
              display: "inline-flex",
              flex: "0 0 auto",
              marginLeft: "auto",
            }}
          >
            <Switch
              id="pref-show-floor-plan"
              checked={prefs.floorplan}
              onCheckedChange={(v) => onChange({ ...prefs, floorplan: v })}
            />
          </span>
        </div>

        <div style={SECTION_HEAD}>BASE MAP</div>
        <div style={{ display: "flex", gap: 10 }}>
          {BASE_MAPS.map((b) => {
            const selected = prefs.basemap === b.value;
            return (
              <button
                key={b.value}
                onClick={() => onChange({ ...prefs, basemap: b.value })}
                aria-pressed={selected}
                style={{
                  /**
                   * A fixed 80px tile, not a flexed half of the popover (Olcay, 2026-08-12).
                   * `flex: 1` made the thumbnail as big as the panel allowed — two large pictures
                   * dominating a preferences popover whose actual subject is one switch and a
                   * choice. A thumbnail only has to be recognisable.
                   */
                  flex: "0 0 80px",
                  padding: 0,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  textAlign: "center",
                }}
              >
                <img
                  src={b.src}
                  alt=""
                  style={{
                    /**
                     * **Square** (Olcay, 2026-08-11 — the same note as the floor-plan thumbs).
                     * It was `height: 56` against a flexed width, so the tile's shape depended on
                     * how wide the popover happened to be: a landscape box next to a square one
                     * elsewhere in the same app. `aspectRatio` keeps it square at any width.
                     */
                    width: 80,
                    height: 80,
                    display: "block",
                    objectFit: "cover",
                    borderRadius: 8,
                    /* theme-500, the DS's active blue — v9's own selected-thumbnail ring.
                       This was --review-ink, the one selection in the popover speaking
                       near-black while everything else selected speaks blue. */
                    border: `2px solid ${selected ? "var(--primitives-colors-theme-500)" : "#E7E9EE"}`,
                  }}
                />
                <div
                  style={{
                    fontSize: 12,
                    marginTop: 4,
                    fontWeight: selected ? 600 : 400,
                  }}
                >
                  {b.label}
                </div>
              </button>
            );
          })}
        </div>
      </PopoverContent>
    </Popover>
  );
}
