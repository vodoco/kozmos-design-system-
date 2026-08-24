import figma from "@figma/code-connect";
import { SplitButton } from "./SplitButton";

figma.connect(
  SplitButton,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=383-2332",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Secondary: "secondary",
        Destructive: "destructive",
        Outline: "outline",
      }),
      size: figma.enum("Size", {
        Small: "sm",
        Default: "default",
        Large: "lg",
      }),
      disabled: figma.enum("State", {
        Default: false,
        Disabled: true,
        Focus: false,
      }),
      children: figma.string("Label Text"),
    },
    example: ({ children, disabled, size, variant }) => (
      <SplitButton
        disabled={disabled}
        onMainClick={() => {}}
        menuItems={[
          { label: "Action 1", onClick: () => {} },
          { label: "Action 2", onClick: () => {} },
        ]}
        size={size}
        variant={variant}
      >
        {children}
      </SplitButton>
    ),
  },
);
