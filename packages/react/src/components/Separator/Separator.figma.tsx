import figma from "@figma/code-connect";
import { Separator } from "./Separator";

figma.connect(
  Separator,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1393",
  {
    props: {
      orientation: figma.enum("Orientation", {
        Horizontal: "horizontal",
        Vertical: "vertical",
      }),
    },
    example: (props) => <Separator {...props} />,
  },
);
