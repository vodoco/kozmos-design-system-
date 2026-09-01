import figma from "@figma/code-connect";
import { Counter } from "./Counter";

figma.connect(
  Counter,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=149-13430",
  {
    props: {
      tone: figma.enum("Tone", {
        Neutral: "neutral",
        Brand: "brand",
        Destructive: "destructive",
        Inverse: "inverse",
      }),
      size: figma.enum("Size", {
        Small: "sm",
        Default: "default",
      }),
      children: figma.string("Counter Text"),
    },
    example: ({ children, size, tone }) => (
      <Counter tone={tone} size={size}>
        {children}
      </Counter>
    ),
  },
);
