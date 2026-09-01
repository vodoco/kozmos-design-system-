import figma from "@figma/code-connect";
import { LocationPin } from "./LocationPin";

const locationPinUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6847";

figma.connect(LocationPin, locationPinUrl, {
  props: {
    size: figma.enum("Size", { Sm: "sm", Md: "md", Lg: "lg" }),
    label: figma.string("Label Text"),
    selected: figma.enum("State", {
      Default: false,
      Selected: true,
      Featured: false,
      OffFloor: false,
      Disabled: false,
    }),
    featured: figma.enum("State", {
      Default: false,
      Selected: false,
      Featured: true,
      OffFloor: false,
      Disabled: false,
    }),
    offFloor: figma.enum("State", {
      Default: false,
      Selected: false,
      Featured: false,
      OffFloor: true,
      Disabled: false,
    }),
    disabled: figma.enum("State", {
      Default: false,
      Selected: false,
      Featured: false,
      OffFloor: false,
      Disabled: true,
    }),
  },
  // variant is a colour role themed per venue and labelPlacement is owned by
  // the map renderer, so neither is a Figma variant axis.
  example: ({ size, label, selected, featured, offFloor, disabled }) => (
    <LocationPin
      size={size}
      label={label}
      selected={selected}
      featured={featured}
      offFloor={offFloor}
      disabled={disabled}
    />
  ),
});
