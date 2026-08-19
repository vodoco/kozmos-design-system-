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
         * Two lines now, one clickable apiece (Olcay, 2026-08-18: "I don't like too many
         * clickables side by side" — the in-row version put slider, help and switch shoulder to
         * shoulder). The row returns to the uniform label + switch shape every other preference
         * has, with the help glyph NEXT TO THE LABEL (Olcay: "help symbol should be next to
         * labels" — also v9's own pattern), and the slider gets a full-width line of its own
         * underneath, indented behind the rail that says it belongs to the floor-plan. Everything
         * the earlier rounds decided survives: no "Transparency" label, the value as a tooltip,
         * double-click to return to the 50% default, shown only while the overlay is on.
         *
         * DS-component note: DS `Slider` + `Tooltip` composed; the tooltip anchors to the track,
         * not the knob — the value-tooltip Slider variant stays on the DS backlog.
         */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
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
          {/* Inline SVG because @kozmos/icons ships no help/question glyph — the D9 gap again. */}
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
        {prefs.floorplan && (
          <TooltipProvider delayDuration={150}>
            <Tooltip open={sliding || undefined}>
              <TooltipTrigger asChild>
                {/* Double-click returns to the default — 50%, the overlay's historical look.
                    The lightest form of v9's own "Revert changes" idiom. */}
                <span
                  style={{
                    display: "block",
                    margin: "8px 0 2px",
                    padding: "2px 0 2px 14px",
                    borderLeft: "2px solid #E7E9EE",
                  }}
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
