import figma from "@figma/code-connect";
import { FloorSelector, type FloorSelectorProps } from "./FloorSelector";

const floorSelectorUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6786";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const floors: FloorSelectorProps["floors"];
declare const setActiveFloor: FloorSelectorProps["onFloorSelect"];

figma.connect(FloorSelector, floorSelectorUrl, {
  props: {
    variant: figma.enum("Variant", {
      VerticalList: "vertical-list",
      HorizontalList: "horizontal-list",
      CompactStepper: "compact-stepper",
    }),
    selectedFloor: figma.string("Selected Floor Text"),
  },
  // floors carries the canonical level IDs and their ordering; the Figma set
  // shows three example levels and cannot express that identity.
  example: ({ variant, selectedFloor }) => (
    <FloorSelector
      variant={variant}
      floors={floors}
      selectedFloor={selectedFloor}
      onFloorSelect={(floorId) => setActiveFloor(floorId)}
      label="Level"
    />
  ),
});
