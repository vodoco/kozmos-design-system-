import figma from "@figma/code-connect";
import { Checkbox } from "./Checkbox";

/**
 * Figma Code Connect: Checkbox
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1410
 */
figma.connect(
  Checkbox,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1410",
  {
    props: {
      checked: figma.enum("Checked", {
        Unchecked: false,
        Checked: true,
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
    example: ({ checked, disabled, error, label }) => (
      <Checkbox
        checked={checked}
        disabled={disabled}
        error={error}
        label={label}
      />
    ),
  },
);
