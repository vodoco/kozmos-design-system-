import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Slider,
  Switch,
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
  geojson = false,
}: {
  prefs: MapPrefs;
  onChange: (p: MapPrefs) => void;
  /**
   * Show the FOCUS section. Set by the screens that draw a **diff** — Manual Review, and S1 for
   * its diff-drawing panes (§3: focus follows the diff, not the screen). A screen with no diff
   * would only be offering to grey out nothing.
   */
  focus?: boolean;
  /**
   * Show the FLOOR SOURCE switch. Set by the screens that actually **fetch** the level's GeoJSON —
   * only Map Content does today. The same rule as `focus`: a screen that has no GeoJSON would be
   * offering a choice with one real option, and the switch would look broken rather than absent.
   */
  geojson?: boolean;
}) {
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
      <PopoverContent side="top" align="start" style={{ width: 268 }}>
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

        {geojson && (
          <>
            <div style={SECTION_HEAD}>FLOOR SOURCE</div>
            {/*
              The A/B for the render swap (Olcay, 2026-08-16). On, the floor is drawn from the
              level's GeoJSON with the vector tiles switched off; off, it is the SDK's tiles, exactly
              as it has always been. Both draw with the SAME paint — the layers are clones of the
              SDK's own — so a difference you can see between the two positions is a difference in
              the DATA, which is the honest thing this switch is for: the tiles are the last publish
              and the GeoJSON is the draft.

              Defaulting to on where it is offered, and `?? true` rather than a required field,
              because the map already refuses by itself when there is nothing to draw.
            */}
            <PrefRow
              label="Draw floor from GeoJSON"
              checked={prefs.geojsonFloor ?? true}
              onCheckedChange={(v) => onChange({ ...prefs, geojsonFloor: v })}
            />
          </>
        )}

        <div style={SECTION_HEAD}>FLOOR-PLAN OVERLAY</div>
        <PrefRow
          label="Show Floor-plan"
          checked={prefs.floorplan}
          onCheckedChange={(v) => onChange({ ...prefs, floorplan: v })}
        />
        {prefs.floorplan && (
          /*
           * The transparency belongs to the floor-plan, not to the panel (Olcay, 2026-08-18:
           * "related to floorplan and not other elements within this map preferences panel") —
           * hence the nested rail under the toggle rather than a sibling PrefRow, which would read
           * as one more independent preference. Shown only while the overlay is on: a slider for
           * an invisible overlay would be the one control in this popover that visibly does
           * nothing. The slider is the same DS control the Building Wizard's reference-level row
           * uses for exactly this job, at the same width.
           */
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              margin: "6px 0 2px",
              padding: "2px 0 2px 14px",
              borderLeft: "2px solid #E7E9EE",
            }}
          >
            <span
              style={{
                fontSize: 12.5,
                color: "var(--primitives-colors-background-600)",
                flex: "0 0 auto",
              }}
            >
              Transparency
            </span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Slider
                min={0}
                max={1}
                step={0.05}
                value={[prefs.floorplanTransparency ?? 0.5]}
                onValueChange={([v]) =>
                  onChange({ ...prefs, floorplanTransparency: v })
                }
                aria-label="Floor-plan transparency"
              />
            </div>
            <span
              style={{
                fontSize: 11,
                color: "var(--primitives-colors-background-600)",
                width: 32,
                textAlign: "right",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {Math.round((prefs.floorplanTransparency ?? 0.5) * 100)}%
            </span>
          </div>
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
                    border: `2px solid ${selected ? "var(--review-ink)" : "#E7E9EE"}`,
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
