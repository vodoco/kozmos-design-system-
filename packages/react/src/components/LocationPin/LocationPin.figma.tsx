import figma from "@figma/code-connect";
import { LocationPin } from "./LocationPin";

const locationPinUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6847";

// The Tint axis: Theme is a pin with no tint; the eight are the taxonomy's
// quick-access colours as the Semantics.Category tokens' CSS variables — the
// fill is the marker, its ink the number; a featured pin keeps the alert colour.
const tintFor = (name: string) => ({
  accent: `var(--semantics-category-accent-${name})`,
  fill: `var(--semantics-category-fill-${name})`,
  onFill: `var(--semantics-category-on-fill-${name})`,
});

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
    tint: figma.enum("Tint", {
      Theme: undefined,
      Yellow: tintFor("yellow"),
      Orange: tintFor("orange"),
      Turquoise: tintFor("turquoise"),
      Red: tintFor("red"),
      Blue: tintFor("blue"),
      Navy: tintFor("navy"),
      Green: tintFor("green"),
      Pink: tintFor("pink"),
    }),
  },
  // variant is a colour role themed per venue and labelPlacement is owned by
  // the map renderer, so neither is a Figma variant axis.
  example: ({ size, label, selected, featured, offFloor, disabled, tint }) => (
    <LocationPin
      size={size}
      label={label}
      selected={selected}
      featured={featured}
      offFloor={offFloor}
      disabled={disabled}
      tint={tint}
    />
  ),
});
