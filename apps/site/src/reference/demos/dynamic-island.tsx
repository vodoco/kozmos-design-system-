import { useState } from "react";
import {
  Box,
  Button,
  DirectionIcon,
  DynamicIsland,
  Icon,
  SegmentedControl,
  Stack,
  Text,
} from "@kozmos/react";
import type { DemoModule } from "../types";

type IslandState = "compact" | "expanded" | "minimal";
const states: readonly IslandState[] = ["minimal", "compact", "expanded"];

function Summon() {
  const [shown, setShown] = useState(false);
  const [state, setState] = useState<IslandState>("compact");
  return (
    <Box className="site-demo-column">
      <Text size="sm" color="muted">
        The island is fixed to the top of the viewport (GAP-24), so this stage
        cannot hold it. Show it, change its state, then hide it; it sits over
        the site’s header while shown.
      </Text>
      <Box className="site-demo-row">
        <Button
          variant={shown ? "outline" : "default"}
          onClick={() => setShown((value) => !value)}
        >
          {shown ? "Hide the island" : "Show the island"}
        </Button>
        <SegmentedControl
          label="Island state"
          size="sm"
          items={states.map((value) => ({ value, label: value }))}
          value={state}
          onValueChange={(next) => {
            if (states.includes(next as IslandState))
              setState(next as IslandState);
          }}
        />
      </Box>
      {shown ? (
        <DynamicIsland
          islandState={state}
          compactLeading={<Icon name="navigation-pointer-01" size="sm" />}
          compactTrailing="3 min to the bookshop"
          minimalContent={<Icon name="navigation-pointer-01" size="sm" />}
          expandedContent={
            <Stack gap={1}>
              <DirectionIcon type="left" />
              Turn left at the pharmacy
              <Box>20 m · 3 min to the bookshop</Box>
            </Stack>
          }
        />
      ) : null}
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Summon the island",
    description:
      "Three states: minimal, compact with leading and trailing slots, expanded with its own content. Its colours are the foreground on the background, inverted, so the slots take plain text and icons.",
    Component: Summon,
  },
];
