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

export function TopBar({
  tools,
  bell,
  tab: current = "Maps",
  onTab,
}: {
  tools?: React.ReactNode;
  /** The notification bell (S7) — passed in so the chrome doesn't have to know the app's routing. */
  bell?: React.ReactNode;
  /** Which top-level tab is lit. Settings became reachable when S5 was built (2026-08-11). */
  tab?: "Maps" | "Settings";
  onTab?: (t: "Maps" | "Settings") => void;
}) {
  const tab = (label: string, opts?: { to?: "Maps" | "Settings" }) => {
    const active = label === current;
    const clickable = !!opts?.to && !!onTab;
    return (
      <button
        key={label}
        onClick={clickable ? () => onTab!(opts!.to!) : undefined}
        disabled={!clickable}
        title={clickable ? undefined : "Not part of this prototype"}
        style={{
          display: "flex",
          alignItems: "center",
          alignSelf: "stretch",
          padding: "0 24px",
          fontSize: 13,
          lineHeight: "18px",
          border: "none",
          borderBottom: `2px solid ${active ? INK : "transparent"}`,
          color: active ? LINK : FG,
          background: active ? TINT : "transparent",
          cursor: clickable ? "pointer" : "default",
          opacity: clickable ? 1 : 0.65,
          fontFamily: "inherit",
        }}
      >
        {label}
      </button>
    );
  };

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
        {/* The site block empties out on System Settings, per `2002:41171` — and that is a real
            signal, not a layout tidy-up: these parameters are system-wide, so an "Active Site"
            beside them would imply a scope they haven't got. Publish goes with it for the same
            reason, and so do the rules that fence the column.
            It keeps its WIDTH though: removing it outright slid the centred nav left into the
            prototype tool pills. Empty space, same geometry. */}
        <div
          style={{
            width: PANEL_WIDTH,
            alignSelf: "stretch",
            display: "flex",
            alignItems: "center",
            gap: 24,
            padding: "0 16px",
            visibility: current === "Settings" ? "hidden" : "visible",
            borderLeft: current === "Settings" ? "none" : `1px solid ${LINE}`,
            borderRight: current === "Settings" ? "none" : `1px solid ${LINE}`,
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
        {tab("Maps", { to: "Maps" })}
        {tab("Analytics")}
        {tab("Settings", { to: "Settings" })}
      </nav>

      {/* Prototype-only review tools, deliberately outside the design's chrome vocabulary — see
          ui/FeedbackLayer.tsx. Nothing here is part of the Pointr dashboard. */}
      {tools}

      {/* S7 — the notification bell sits between the tools and the user menu, as in 2495:463 */}
      {bell}

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

type RailItem = { label: string; icon?: KozmosIconKey; img?: string; active?: boolean };

const RAIL: RailItem[] = [
  { label: "Map Content", icon: "map-01", active: true },
  { label: "Geofences", icon: "marker-pin-01" },
  { label: "Wayfinding Network", icon: "navigation-pointer-01" },
  { label: "IoT Devices", icon: "wifi" },
];

/**
 * The Settings tab replaces the rail's contents rather than adding a second panel beside it —
 * that is how `2002:41171` draws it, and it is why System Settings has the full page width.
 * Only System Settings is ours; the rest are named so the screen sits in its real context.
 */
const SETTINGS_RAIL: RailItem[] = [
  { label: "Metadata", icon: "alert-circle" },
  { label: "SDK Configuration", icon: "settings-01" },
  { label: "User Management", icon: "users-01" },
  // @kozmos/icons has no translate/language glyph (D9) — the local globe export stands in
  { label: "UI Translation Manager", img: "/icons/globe-01.svg" },
  { label: "System Settings", icon: "settings-01", active: true },
];

/** Left icon rail. NB: uses the limited @kozmos/icons set — swap for the dashboard icon set when available. */
export function LeftRail({ variant = "maps" }: { variant?: "maps" | "settings" }) {
  const items = variant === "settings" ? SETTINGS_RAIL : RAIL;
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
      {items.map((it) => (
        <div
          key={it.label}
          title={it.active ? undefined : "Not part of this prototype"}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 6,
            padding: "16px 8px",
            color: it.active ? LINK : MUTED,
            background: it.active ? TINT : "transparent",
            opacity: it.active ? 1 : 0.85,
          }}
        >
          {it.img ? (
            <img src={it.img} alt="" width={24} height={24} style={{ opacity: 0.5 }} />
          ) : (
            <Icon name={it.icon!} />
          )}
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
