import figma from "@figma/code-connect";
import { FloorSelector } from "./FloorSelector";

const floorSelectorUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6786";

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
