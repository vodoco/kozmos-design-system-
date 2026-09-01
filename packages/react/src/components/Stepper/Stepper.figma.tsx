import figma from "@figma/code-connect";
import { Stepper } from "./Stepper";

figma.connect(
  Stepper,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=512-39614",
  {
    props: {
      count: figma.enum("Count", {
        "2": 2,
        "3": 3,
        "4": 4,
      }),
      currentStep: figma.enum("Current", {
        "1": 0,
        "2": 1,
        "3": 2,
        "4": 3,
      }),
      step1Text: figma.string("Step 1 Text"),
      step2Text: figma.string("Step 2 Text"),
      step3Text: figma.string("Step 3 Text"),
      step4Text: figma.string("Step 4 Text"),
    },
    example: ({
      count,
      currentStep,
      step1Text,
      step2Text,
      step3Text,
      step4Text,
    }) => (
      <Stepper
        currentStep={Math.min(currentStep, count - 1)}
        steps={[step1Text, step2Text, step3Text, step4Text].slice(0, count)}
      />
    ),
  },
);
