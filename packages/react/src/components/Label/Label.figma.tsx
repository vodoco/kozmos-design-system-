import figma from "@figma/code-connect";
import { Label } from "./Label";

figma.connect(
  Label,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=170-1390",
  {
    props: {
      children: figma.string("Label Text"),
    },
    example: ({ children }) => <Label htmlFor="field">{children}</Label>,
  },
);
