import { Button, Icon, Text } from "@kozmos/react";
import type { KozmosIconKey } from "@kozmos/icons";

/**
 * Dashboard chrome, taken from the Figma header (`headerMenu`, node 2530:907).
 * Colours are the file's own tokens: theme/900 #082975, theme/800 #0b369c, theme/0 #f1f5fe,
 * foreground/600 #5d626f, foreground/800 #2e3138, background/900 #e3e4e8.
 */
const INK = "#082975";
const LINK = "#0b369c";
const TINT = "#f1f5fe";
const LINE = "#e3e4e8";
const MUTED = "#5d626f";
const FG = "#2e3138";

/**
 * The chrome's two vertical rules. The globe cell and the left rail share one width, and the site
 * selector and every screen's left panel share the other, so both rules run unbroken from the
 * header down through the page.
 */
export const RAIL_WIDTH = 96;
export const PANEL_WIDTH = 440;

export function TopBar({ tools }: { tools?: React.ReactNode }) {
  const tab = (label: string, active?: boolean) => (
    <div
      key={label}
      style={{
        display: "flex",
        alignItems: "center",
        alignSelf: "stretch",
        padding: "0 24px",
        fontSize: 13,
        lineHeight: "18px",
        color: active ? LINK : FG,
        background: active ? TINT : "transparent",
        borderBottom: `2px solid ${active ? INK : "transparent"}`,
      }}
    >
      {label}
    </div>
  );

  return (
    <header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: 54,
        flex: "0 0 54px",
        paddingRight: 16,
        background: "#fff",
        borderBottom: `1px solid ${LINE}`,
        boxShadow: "0 4px 5px rgba(0,0,0,.04)",
        position: "relative",
        zIndex: 2,
      }}
    >
      {/* scope selector — globe cell, then the site block, each fenced by a rule */}
      <div style={{ display: "flex", alignSelf: "stretch", alignItems: "center" }}>
        <div style={{ width: RAIL_WIDTH, display: "grid", placeItems: "center", alignSelf: "stretch" }}>
          {/* exported from the Figma header (globe-01) — not in @kozmos/icons */}
          <img src="/icons/globe-01.svg" alt="" width={32} height={32} />
        </div>
        <div
          style={{
            width: PANEL_WIDTH,
            alignSelf: "stretch",
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 16px",
            borderLeft: `1px solid ${LINE}`,
            borderRight: `1px solid ${LINE}`,
          }}
        >
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 11, lineHeight: "14px", color: MUTED }}>Active Site</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span
                style={{
                  fontSize: 13,
                  lineHeight: "16px",
                  fontWeight: 600,
                  color: INK,
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                Dubai International Airports
              </span>
              <Icon name="chevron-down" />
            </div>
          </div>
          <Button size="sm">Publish</Button>
        </div>
      </div>

      <nav style={{ display: "flex", alignSelf: "stretch" }}>
        {tab("Maps", true)}
        {tab("Analytics")}
        {tab("Settings")}
      </nav>

      {/* Prototype-only review tools, deliberately outside the design's chrome vocabulary — see
          ui/FeedbackLayer.tsx. Nothing here is part of the Pointr dashboard. */}
      {tools}

      {/* user menu — avatar + chevron only, per the design */}
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginLeft: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 24,
            background: LINE,
            border: "2px solid #c7cad1",
            display: "grid",
            placeItems: "center",
            overflow: "hidden",
            color: "#8b909c",
          }}
        >
          <Icon name="user-01" />
        </div>
        <Icon name="chevron-down" />
      </div>
    </header>
  );
}

const RAIL: { label: string; icon: KozmosIconKey; active?: boolean }[] = [
  { label: "Map Content", icon: "map-01", active: true },
  { label: "Geofences", icon: "marker-pin-01" },
  { label: "Wayfinding Network", icon: "navigation-pointer-01" },
  { label: "IoT Devices", icon: "wifi" },
];

/** Left icon rail. NB: uses the limited @kozmos/icons set — swap for the dashboard icon set when available. */
export function LeftRail() {
  return (
    <div
      style={{
        // matches the header's globe cell, so the rule under it runs straight down the page
        width: RAIL_WIDTH,
        flex: `0 0 ${RAIL_WIDTH}px`,
        borderRight: `1px solid ${LINE}`,
        background: "#fff",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      {RAIL.map((it) => (
        <div
          key={it.label}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            padding: "16px 8px",
            color: it.active ? LINK : MUTED,
            background: it.active ? TINT : "transparent",
          }}
        >
          <Icon name={it.icon} />
          <Text style={{ fontSize: 11, lineHeight: "14px", textAlign: "center", color: "inherit" }}>
            {it.label}
          </Text>
        </div>
      ))}
      <div style={{ flex: 1 }} />
      <div style={{ display: "grid", placeItems: "center", padding: "16px 8px", color: MUTED }}>
        <Icon name="info-circle" />
      </div>
    </div>
  );
}
