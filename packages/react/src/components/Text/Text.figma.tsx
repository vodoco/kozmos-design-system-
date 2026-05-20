import figma from "@figma/code-connect";
import { Text } from "./Text";

figma.connect(
  Text,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1361",
  {
    props: {
      size: figma.enum("Size", {
        XS: "xs",
        Small: "sm",
        Base: "base",
        Large: "lg",
        XLarge: "xl",
        "2XLarge": "2xl",
        "3XLarge": "3xl",
        "4XLarge": "4xl",
      }),
      weight: figma.enum("Weight", {
        Normal: "normal",
        Medium: "medium",
        Semibold: "semibold",
        Bold: "bold",
      }),
      color: figma.enum("Tone", {
        Default: "default",
        Muted: "muted",
        Primary: "primary",
        Destructive: "destructive",
      }),
      children: figma.string("Text"),
    },
    example: ({ children, color, size, weight }) => (
      <Text color={color} size={size} weight={weight}>
        {children}
      </Text>
    ),
  },
);
