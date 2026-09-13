import figma from "@figma/code-connect";
import { RouteSummary, type RouteSummaryProps } from "./RouteSummary";

const routeSummaryUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8296";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const transportModeIcon: RouteSummaryProps["transportModeIcon"];
declare const startNavigation: NonNullable<
  RouteSummaryProps["onStartNavigation"]
>;
declare const endRoute: RouteSummaryProps["onEndRoute"];

figma.connect(RouteSummary, routeSummaryUrl, {
  props: {
    state: figma.enum("State", { Preview: "preview", Active: "active" }),
    etaText: figma.string("ETA Text"),
    distanceText: figma.string("Distance Text"),
  },
  example: ({ state, etaText, distanceText }) => (
    <RouteSummary
      state={state}
      etaText={etaText}
      distanceText={distanceText}
      transportModeIcon={transportModeIcon}
      onStartNavigation={() => startNavigation()}
      onEndRoute={() => endRoute()}
    />
  ),
});
