import React from "react";
import { ThemeProvider } from "../src/components/ThemeProvider/ThemeProvider";
import { RoutingInputGroup } from "../src/components/RoutingInputGroup/RoutingInputGroup";
import { FeedbackCard } from "../src/components/FeedbackCard/FeedbackCard";

export function RoutingInputGroupFixture() {
  return (
    <ThemeProvider theme="light">
      <div style={{ width: 360 }}>
        <RoutingInputGroup
          points={[
            { id: "a", value: "Current location" },
            { id: "b", value: "" },
          ]}
          onPointChange={() => {}}
          onSwap={() => {}}
        />
      </div>
    </ThemeProvider>
  );
}

export function FeedbackCardFixture() {
  return (
    <ThemeProvider theme="light">
      <div style={{ width: 360 }}>
        <FeedbackCard />
      </div>
    </ThemeProvider>
  );
}
