import figma from "@figma/code-connect";
import { ToggleButton } from "./ToggleButton";
figma.connect(
  ToggleButton,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=TBD",
  {
    props: {
      variant: figma.enum("Variant", {
        Default: "default",
        Outline: "outline",
      }),
      pressed: figma.boolean("Pressed"),
      disabled: figma.boolean("Disabled"),
    },
    example: (props) => <ToggleButton {...props} />,
  },
);
