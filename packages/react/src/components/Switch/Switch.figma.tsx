import figma from "@figma/code-connect";
import { Switch } from "./Switch";

/**
 * Figma Code Connect: Switch
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1465
 */
figma.connect(
  Switch,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1465",
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
      <Switch
        checked={checked}
        disabled={disabled}
        error={error}
        label={label}
      />
    ),
  },
);
