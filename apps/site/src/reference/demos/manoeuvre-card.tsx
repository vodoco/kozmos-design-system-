import { useState } from "react";
import { Box, Itinerary, ManoeuvreCard } from "@kozmos/react";
import { itinerary } from "../sample-data";
import { GlassBackdrop } from "../GlassBackdrop";
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
    <GlassBackdrop colours={["green", "blue"]}>
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
    </GlassBackdrop>
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
