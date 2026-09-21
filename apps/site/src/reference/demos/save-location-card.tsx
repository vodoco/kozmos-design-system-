import { useState } from "react";
import { Box, SaveLocationCard, Text } from "@kozmos/react";
import type { DemoModule } from "../types";

function MarkMyCar() {
  const [saved, setSaved] = useState(false);
  const [note, setNote] = useState("Nothing saved yet.");
  return (
    <Box className="site-demo-column">
      <SaveLocationCard
        isSaved={saved}
        onSaveToggle={() => {
          setSaved((value) => !value);
          setNote(saved ? "Forgotten." : "Saved: car park, bay 42.");
        }}
        onRouteToLocation={() => setNote("Routing to the car.")}
        onEditNote={() => setNote("Editing the note.")}
      />
      <Text size="sm" color="muted" aria-live="polite">
        {note}
      </Text>
    </Box>
  );
}

function OnGlass() {
  return (
    <Box className="site-glass-stage">
      {(["orange", "green"] as const).map((colour, index) => (
        <Box
          key={colour}
          className="site-blob"
          aria-hidden="true"
          style={{
            "--blob": `var(--semantics-category-fill-${colour})`,
            "--x": `${30 + index * 40}%`,
            "--y": "50%",
          }}
        />
      ))}
      <Box className="site-glass-card">
        <SaveLocationCard
          surface="glass"
          title="Remember this spot"
          description="Find your way back to the terrace."
          isSaved
          onSaveToggle={() => {}}
          onRouteToLocation={() => {}}
        />
      </Box>
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Mark my car",
    description:
      "Save, then route back or edit the note; isSaved swaps the actions.",
    Component: MarkMyCar,
  },
  { title: "On glass, with its own words", Component: OnGlass },
];
