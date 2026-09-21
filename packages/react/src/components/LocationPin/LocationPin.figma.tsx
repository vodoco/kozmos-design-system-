import figma from "@figma/code-connect";
import { LocationPin } from "./LocationPin";

const locationPinUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6847";

// The Tint axis: Theme is a pin with no tint; the eight are the taxonomy's
// quick-access colours as the Semantics.Category tokens' CSS variables — the
// fill is the marker, its ink the number; a featured pin keeps the alert colour.
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
      Yellow: {
        accent: "var(--semantics-category-accent-yellow)",
        fill: "var(--semantics-category-fill-yellow)",
        onFill: "var(--semantics-category-on-fill-yellow)",
      },
      Orange: {
        accent: "var(--semantics-category-accent-orange)",
        fill: "var(--semantics-category-fill-orange)",
        onFill: "var(--semantics-category-on-fill-orange)",
      },
      Turquoise: {
        accent: "var(--semantics-category-accent-turquoise)",
        fill: "var(--semantics-category-fill-turquoise)",
        onFill: "var(--semantics-category-on-fill-turquoise)",
      },
      Red: {
        accent: "var(--semantics-category-accent-red)",
        fill: "var(--semantics-category-fill-red)",
        onFill: "var(--semantics-category-on-fill-red)",
      },
      Blue: {
        accent: "var(--semantics-category-accent-blue)",
        fill: "var(--semantics-category-fill-blue)",
        onFill: "var(--semantics-category-on-fill-blue)",
      },
      Navy: {
        accent: "var(--semantics-category-accent-navy)",
        fill: "var(--semantics-category-fill-navy)",
        onFill: "var(--semantics-category-on-fill-navy)",
      },
      Green: {
        accent: "var(--semantics-category-accent-green)",
        fill: "var(--semantics-category-fill-green)",
        onFill: "var(--semantics-category-on-fill-green)",
      },
      Pink: {
        accent: "var(--semantics-category-accent-pink)",
        fill: "var(--semantics-category-fill-pink)",
        onFill: "var(--semantics-category-on-fill-pink)",
      },
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
