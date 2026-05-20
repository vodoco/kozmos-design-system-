import figma from "@figma/code-connect";
import { Heading } from "./Heading";

figma.connect(
  Heading,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1374",
  {
    props: {
      level: figma.enum("Level", {
        H1: 1,
        H2: 2,
        H3: 3,
        H4: 4,
        H5: 5,
        H6: 6,
      }),
      children: figma.string("Heading Text"),
    },
    example: ({ children, level }) => (
      <Heading level={level}>{children}</Heading>
    ),
  },
);
