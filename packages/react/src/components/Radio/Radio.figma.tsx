import figma from "@figma/code-connect";
import { RadioGroup, RadioGroupItem } from "./Radio";

/**
 * Figma Code Connect: Radio
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1436
 */
figma.connect(
  RadioGroupItem,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1436",
  {
    props: {
      defaultValue: figma.enum("Checked", {
        Unchecked: "",
        Checked: "option",
      }),
      disabled: figma.enum("State", {
        Default: false,
        Disabled: true,
        Error: false,
      }),
      error: figma.enum("State", {
        Default: false,
        Disabled: false,
        Error: true,
      }),
      label: figma.string("Label Text"),
    },
    example: ({ defaultValue, disabled, error, label }) => (
      <RadioGroup defaultValue={defaultValue}>
        <RadioGroupItem
          value="option"
          disabled={disabled}
          error={error}
          label={label}
        />
      </RadioGroup>
    ),
  },
);
