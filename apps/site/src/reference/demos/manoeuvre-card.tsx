import { useState } from "react";
import { Box, Itinerary, ManoeuvreCard } from "@kozmos/react";
import { itinerary } from "../sample-data";
import type { DemoModule } from "../types";

function WithTheItinerary() {
  const [expanded, setExpanded] = useState(false);
  return (
    <Box className="site-demo-column">
      <ManoeuvreCard
        type="left"
        instruction="Turn left at the pharmacy"
        detail="20 m"
        expanded={expanded}
        onToggle={() => setExpanded((value) => !value)}
      >
        <Itinerary
          label="Itinerary, solid"
          origin="Main entrance"
          destination="Bookshop"
          steps={[...itinerary]}
        />
      </ManoeuvreCard>
    </Box>
  );
}

function OnGlass() {
  const [expanded, setExpanded] = useState(true);
  return (
    <Box className="site-glass-stage">
      {(["green", "blue"] as const).map((colour, index) => (
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
        <ManoeuvreCard
          surface="glass"
          type="escalator-up"
          instruction="Take the escalator to the first floor"
          detail="Then 40 m"
          expanded={expanded}
          onToggle={() => setExpanded((value) => !value)}
        >
          <Itinerary
            label="Itinerary, on glass"
            origin="Main entrance"
            destination="Bookshop"
            steps={[...itinerary]}
          />
        </ManoeuvreCard>
      </Box>
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "The current manoeuvre, with the itinerary behind it",
    description:
      "The card names the manoeuvre; a button opens the itinerary underneath it, up to maxItineraryHeight.",
    Component: WithTheItinerary,
  },
  { title: "On glass, over a map", Component: OnGlass },
];
