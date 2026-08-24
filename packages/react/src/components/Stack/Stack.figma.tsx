import figma from "@figma/code-connect";
import { Stack } from "./Stack";

figma.connect(
  Stack,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1027",
  {
    props: {
      children: figma.slot("Content Slot") ?? figma.children("*"),
      direction: figma.enum("Direction", {
        Row: "row",
        Column: "column",
      }),
      gap: figma.enum("Gap", {
        "2": 2,
        "4": 4,
        "6": 6,
      }),
    },
    example: (props) => <Stack {...props} />,
  },
);
