import figma from "@figma/code-connect";
import { DirectionStep } from "./DirectionStep";

const directionStepUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6763";

figma.connect(DirectionStep, directionStepUrl, {
  props: {
    type: figma.enum("Type", {
      Straight: "straight",
      Left: "left",
      Right: "right",
      Destination: "destination",
    }),
    instruction: figma.string("Instruction Text"),
    distance: figma.string("Distance Text"),
    duration: figma.string("Duration Text"),
  },
  example: ({ type, instruction, distance, duration }) => (
    <DirectionStep
      type={type}
      instruction={instruction}
      distance={distance}
      duration={duration}
    />
  ),
});
