import figma from "@figma/code-connect";
import { FloatingActionButton } from "./FloatingActionButton";

/**
 * Figma Code Connect: FloatingActionButton
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2459
 */
figma.connect(
  FloatingActionButton,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2459",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Secondary: "secondary",
        Destructive: "destructive",
      }),
      size: figma.enum("Size", {
        Small: "sm",
        Default: "icon",
        Large: "lg",
      }),
      disabled: figma.enum("State", {
        Default: false,
        Disabled: true,
        Focus: false,
      }),
      children: figma.instance("Icon"),
    },
    example: ({ children, disabled, size, variant }) => (
      <FloatingActionButton
        aria-label="Floating action"
        disabled={disabled}
        size={size}
        variant={variant}
      >
        {children}
      </FloatingActionButton>
    ),
  },
);
