import React from "react";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { DynamicIsland } from "../src/components/DynamicIsland/DynamicIsland";
import { FeedbackCard } from "../src/components/FeedbackCard/FeedbackCard";
import { RouteSummary } from "../src/components/RouteSummary/RouteSummary";
import { RoutingInputGroup } from "../src/components/RoutingInputGroup/RoutingInputGroup";
import { SaveLocationCard } from "../src/components/SaveLocationCard/SaveLocationCard";

export function PanelCardsFixture() {
  return (
    <ThemeProvider theme="light">
      <div style={{ width: 360, display: "grid", gap: 16 }}>
        <FeedbackCard data-testid="feedback" />
        <RouteSummary
          data-testid="summary"
          etaText="12 min"
          distanceText="1.8 km"
          state="active"
        />
        <RoutingInputGroup
          data-testid="routing"
          points={[
            { id: "a", value: "Current location" },
            { id: "b", value: "" },
          ]}
          onPointChange={() => {}}
        />
        <SaveLocationCard data-testid="save" />
      </div>
    </ThemeProvider>
  );
}

export function IslandFixture({ theme }: { theme: "light" | "dark" }) {
  return (
    <ThemeProvider theme={theme}>
      <DynamicIsland
        data-testid="island"
        compactLeading={<span>Gate B12</span>}
      />
    </ThemeProvider>
  );
}
