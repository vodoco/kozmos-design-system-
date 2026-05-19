import figma from "@figma/code-connect";
import { Progress } from "./Progress";

/**
 * Figma Code Connect: Progress
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-252
 */
figma.connect(
  Progress,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=83-252",
  {
    props: {
      value: figma.enum("Value", {
        "0": 0,
        "25": 25,
        "50": 50,
        "75": 75,
        "100": 100,
      }),
    },
    example: (props) => <Progress value={props.value} />,
  },
);
