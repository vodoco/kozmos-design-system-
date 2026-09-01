import figma from "@figma/code-connect";
import { Chip } from "./Chip";

const chipUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=227-1329";

const chipProps = {
  variant: figma.enum("Variant", {
    Neutral: "neutral",
    Brand: "brand",
    Destructive: "destructive",
  }),
  size: figma.enum("Size", {
    Small: "sm",
    Default: "default",
    Large: "lg",
  }),
  children: figma.string("Label Text"),
  selected: figma.enum("State", {
    Default: false,
    Selected: true,
    Disabled: false,
  }),
  disabled: figma.enum("State", {
    Default: false,
    Selected: false,
    Disabled: true,
  }),
};

figma.connect(Chip, chipUrl, {
  variant: { Removable: "False" },
  props: chipProps,
  example: ({ children, disabled, selected, size, variant }) => (
    <Chip disabled={disabled} selected={selected} size={size} variant={variant}>
      {children}
    </Chip>
  ),
});

figma.connect(Chip, chipUrl, {
  variant: { Removable: "True" },
  props: chipProps,
  example: ({ children, disabled, selected, size, variant }) => (
    <Chip
      disabled={disabled}
      onRemove={() => {}}
      selected={selected}
      size={size}
      variant={variant}
    >
      {children}
    </Chip>
  ),
});
