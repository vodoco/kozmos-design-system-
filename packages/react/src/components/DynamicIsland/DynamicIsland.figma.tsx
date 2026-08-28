import figma from "@figma/code-connect";
import { RouteSummary } from "../RouteSummary/RouteSummary";
import { DynamicIsland } from "./DynamicIsland";

const dynamicIslandUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8358";

figma.connect(DynamicIsland, dynamicIslandUrl, {
  props: {
    islandState: figma.enum("State", {
      Compact: "compact",
      Expanded: "expanded",
      Minimal: "minimal",
    }),
  },
  example: ({ islandState }) => (
    <DynamicIsland
      islandState={islandState}
      compactLeading={routeGlyph}
      compactTrailing={etaLabel}
      expandedContent={<RouteSummary />}
      minimalContent={routeGlyph}
    />
  ),
});
