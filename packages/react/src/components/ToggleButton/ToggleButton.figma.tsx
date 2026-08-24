import figma from "@figma/code-connect";
import { ToggleButton } from "./ToggleButton";
figma.connect(
  ToggleButton,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2019",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Outline: "outline",
      }),
      size: figma.enum("Size", {
        Small: "sm",
        Default: "default",
        Large: "lg",
      }),
      pressed: figma.enum("State", {
        Default: false,
        Pressed: true,
        Disabled: false,
        Focus: false,
      }),
      disabled: figma.enum("State", {
        Default: false,
        Pressed: false,
        Disabled: true,
        Focus: false,
      }),
      children: figma.string("Label Text"),
    },
    example: ({ children, disabled, pressed, size, variant }) => (
      <ToggleButton
        disabled={disabled}
        pressed={pressed}
        size={size}
        variant={variant}
      >
        {children}
      </ToggleButton>
    ),
  },
);
