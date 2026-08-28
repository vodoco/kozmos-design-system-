import figma from "@figma/code-connect";
import { RoutingInputGroup } from "./RoutingInputGroup";

const routingInputGroupUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8315";

figma.connect(RoutingInputGroup, routingInputGroupUrl, {
  props: {
    pointLabel: figma.string("Point Label Text"),
  },
  // Content maps to how many entries points holds — two for origin and
  // destination, three once a stop is added — not to a prop.
  example: ({ pointLabel }) => (
    <RoutingInputGroup
      points={points}
      onPointChange={(id, value) => updatePoint(id, value)}
      onSwap={() => swapPoints()}
      onAddPoint={() => addPoint()}
      onRemovePoint={(id) => removePoint(id)}
    />
  ),
});
