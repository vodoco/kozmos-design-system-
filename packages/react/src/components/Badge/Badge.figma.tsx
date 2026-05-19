import figma from "@figma/code-connect";
import { Badge } from "./Badge";

figma.connect(
  Badge,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=78-246",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Destructive: "destructive",
        Outline: "outline",
        Secondary: "secondary",
        Ghost: "ghost",
        Link: "link",
      }),
      size: figma.enum("Size", {
        Default: "default",
        Small: "sm",
        Large: "lg",
        Icon: "icon",
      }),
      children: figma.string("Label Text"),
    },
    example: ({ variant, size, children }) => (
      <Badge variant={variant} size={size}>
        {children}
      </Badge>
    ),
  },
);
