import { Popover, PopoverTrigger, PopoverContent, Switch } from "@kozmos/react";
import type { MapPrefs } from "../map/PointrMap";

export type MapPrefsState = MapPrefs;

const BASE_MAPS: { value: MapPrefs["basemap"]; label: string; src: string }[] = [
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
          <img src="/icons/settings-04.svg" alt="" width={20} height={16} style={{ display: "block" }} />
        </button>
      </PopoverTrigger>
      <PopoverContent side="top" align="start" style={{ width: 268 }}>
        <div style={{ fontWeight: 600, color: "var(--review-ink)" }}>Map View Preferences</div>

        {focus && (
          <>
            <div style={SECTION_HEAD}>FOCUS</div>
            <Switch
              label="Grey out unchanged"
              checked={prefs.greyscale}
              onCheckedChange={(v) => onChange({ ...prefs, greyscale: v })}
            />
            <Switch
              label="Hide POI labels"
              checked={prefs.hidePoiLabels}
              onCheckedChange={(v) => onChange({ ...prefs, hidePoiLabels: v })}
            />
          </>
        )}

        <div style={SECTION_HEAD}>FLOOR-PLAN OVERLAY</div>
        <Switch
          label="Show Floor-plan"
          checked={prefs.floorplan}
          onCheckedChange={(v) => onChange({ ...prefs, floorplan: v })}
        />

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
                  flex: 1,
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
                    width: "100%",
                    height: 56,
                    objectFit: "cover",
                    borderRadius: 8,
                    border: `2px solid ${selected ? "var(--review-ink)" : "#E7E9EE"}`,
                  }}
                />
                <div style={{ fontSize: 12, marginTop: 4, fontWeight: selected ? 600 : 400 }}>
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
