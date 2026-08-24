import figma from "@figma/code-connect";
import { Rating } from "./Rating";

figma.connect(
  Rating,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=512-39747",
  {
    props: {
      value: figma.enum("Value", {
        "0": 0,
        "1": 1,
        "2": 2,
        "3": 3,
        "4": 4,
        "5": 5,
      }),
      readOnly: figma.enum("State", {
        Default: false,
        Readonly: true,
      }),
    },
    example: ({ readOnly, value }) => (
      <Rating max={5} readOnly={readOnly} value={value} />
    ),
  },
);
