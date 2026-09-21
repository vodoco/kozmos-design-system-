import { useState } from "react";
import {
  Box,
  DirectionStep,
  LocationPin,
  MapControlsGroup,
  MapOverlay,
  MapView,
  RouteProgressRail,
  RouteSummary,
  SegmentedControl,
  Surface,
  ThemeProvider,
  UserLocationMarker,
  type CategoryTint,
} from "@kozmos/react";
import type { UserLocationState } from "@kozmos/product-contracts";

function tint(name: string): CategoryTint {
  return {
    accent: `var(--semantics-category-accent-${name})`,
    fill: `var(--semantics-category-fill-${name})`,
    onFill: `var(--semantics-category-on-fill-${name})`,
  };
}

// In the band the manoeuvre (top) and the route summary (bottom) leave free.
const pins = [
  {
    id: "cafe",
    label: "Café, ground floor",
    x: "16%",
    y: "36%",
    colour: "orange",
  },
  {
    id: "gate",
    label: "Gate B12, selected",
    x: "58%",
    y: "30%",
    colour: "blue",
  },
  {
    id: "info",
    label: "Information desk",
    x: "84%",
    y: "50%",
    colour: "turquoise",
  },
  { id: "shop", label: "Duty free", x: "32%", y: "56%", colour: "pink" },
  { id: "lift", label: "Lifts", x: "70%", y: "42%", colour: "green" },
  { id: "bus", label: "Bus stands", x: "12%", y: "56%", colour: "navy" },
];

const MIN_ZOOM = 1;
const MAX_ZOOM = 1.6;

/**
 * A map scene made of Kozmos parts: the map surface, category-tinted pins,
 * the visitor's marker, a manoeuvre on glass, the route summary, and the
 * map controls. Its theme and direction are its own provider's.
 */
export function HeroScene() {
  const [theme, setTheme] = useState<"light" | "dark">("dark");
  const [dir, setDir] = useState<"ltr" | "rtl">("ltr");
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [location, setLocation] = useState<UserLocationState>("following");
  const [selected, setSelected] = useState("gate");

  return (
    <Box className="site-scene">
      <ThemeProvider theme={theme} dir={dir}>
        <Box className="site-scene-frame">
          <MapView
            mapLabel="Illustrative terminal map"
            style={{ "--zoom": zoom }}
          >
            <Box className="site-scene-layer">
              {pins.map((pin, index) => (
                <Box
                  key={pin.id}
                  className="site-scene-pin"
                  style={{ "--pin-x": pin.x, "--pin-y": pin.y, "--i": index }}
                >
                  <LocationPin
                    label={pin.label}
                    tint={tint(pin.colour)}
                    selected={selected === pin.id}
                    onClick={() => setSelected(pin.id)}
                  />
                </Box>
              ))}
              {location === "following" ? (
                <Box
                  className="site-scene-pin site-scene-user"
                  style={{
                    "--pin-x": "44%",
                    "--pin-y": "50%",
                    "--i": pins.length,
                  }}
                >
                  <UserLocationMarker heading={35} />
                </Box>
              ) : null}
            </Box>
            <MapOverlay position="top-center" width="md">
              <Surface variant="glass" className="site-scene-step">
                <DirectionStep
                  type="left"
                  instruction="Turn left at the pharmacy"
                  distance="20 m"
                />
              </Surface>
            </MapOverlay>
            <MapOverlay position="top-right" width="auto">
              <MapControlsGroup
                label="Map controls"
                compassBearing={35}
                onZoomIn={() =>
                  setZoom((value) => Math.min(MAX_ZOOM, value + 0.2))
                }
                onZoomOut={() =>
                  setZoom((value) => Math.max(MIN_ZOOM, value - 0.2))
                }
                onMyLocation={() =>
                  setLocation((state) =>
                    state === "following" ? "off" : "following",
                  )
                }
                locationState={location}
                locationLabel="Show my location"
              />
            </MapOverlay>
            <MapOverlay position="bottom-center" width="lg">
              <RouteSummary
                surface="glass"
                destination="Gate B12"
                durationText="4 min"
                arrivalText="Arrives 14:32"
                distanceText="280 m"
                endLabel="End route"
                onEndRoute={() => setSelected("gate")}
                progress={
                  <RouteProgressRail
                    progress={0.42}
                    type="left"
                    label="Route progress"
                  />
                }
              />
            </MapOverlay>
          </MapView>
        </Box>
      </ThemeProvider>
      <Box className="site-scene-controls">
        <SegmentedControl
          label="This scene's theme"
          size="sm"
          items={[
            { value: "light", label: "Light" },
            { value: "dark", label: "Dark" },
          ]}
          value={theme}
          onValueChange={(next) => {
            if (next === "light" || next === "dark") setTheme(next);
          }}
        />
        <SegmentedControl
          label="Direction"
          size="sm"
          items={[
            { value: "ltr", label: "Left to right" },
            { value: "rtl", label: "Right to left" },
          ]}
          value={dir}
          onValueChange={(next) => {
            if (next === "ltr" || next === "rtl") setDir(next);
          }}
        />
      </Box>
    </Box>
  );
}
