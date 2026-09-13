import figma from "@figma/code-connect";
import {
  RoutingInputGroup,
  type RoutingInputGroupProps,
} from "./RoutingInputGroup";

const routingInputGroupUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8315";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const points: RoutingInputGroupProps["points"];
declare const updatePoint: RoutingInputGroupProps["onPointChange"];
declare const swapPoints: NonNullable<RoutingInputGroupProps["onSwap"]>;
declare const addPoint: NonNullable<RoutingInputGroupProps["onAddPoint"]>;
declare const removePoint: NonNullable<RoutingInputGroupProps["onRemovePoint"]>;

// Nothing on the Figma set maps to a prop. Point Label Text is a field's label
// in Figma, and a RoutePoint carries an id, a value and a placeholder; Content
// maps to how many entries points holds — two for origin and destination,
// three once a stop is added.
figma.connect(RoutingInputGroup, routingInputGroupUrl, {
  example: () => (
    <RoutingInputGroup
      points={points}
      onPointChange={(id, value) => updatePoint(id, value)}
      onSwap={() => swapPoints()}
      onAddPoint={() => addPoint()}
      onRemovePoint={(id) => removePoint(id)}
    />
  ),
});
