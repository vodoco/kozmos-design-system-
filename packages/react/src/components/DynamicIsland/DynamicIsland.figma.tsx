import figma from "@figma/code-connect";
import {
  RouteSummary,
  type RouteSummaryProps,
} from "../RouteSummary/RouteSummary";
import { DynamicIsland, type DynamicIslandProps } from "./DynamicIsland";

const dynamicIslandUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8358";

// What the caller supplies, typed from the components' own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const routeGlyph: DynamicIslandProps["compactLeading"];
declare const etaLabel: DynamicIslandProps["compactTrailing"];
declare const routeSummaryProps: RouteSummaryProps;

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
      expandedContent={<RouteSummary {...routeSummaryProps} />}
      minimalContent={routeGlyph}
    />
  ),
});
