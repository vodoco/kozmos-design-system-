import figma from "@figma/code-connect";
import { Textarea } from "./Textarea";

/**
 * Figma Code Connect: Textarea
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-328
 */
figma.connect(
  Textarea,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-328",
  {
    props: {
      disabled: figma.enum("State", {
        Default: false,
        Focus: false,
        Disabled: true,
        Readonly: false,
      }),
      readOnly: figma.enum("State", {
        Default: false,
        Focus: false,
        Disabled: false,
        Readonly: true,
      }),
      autoFocus: figma.enum("State", {
        Default: false,
        Focus: true,
        Disabled: false,
        Readonly: false,
      }),
      error: figma.enum("Status", {
        Default: false,
        Error: true,
      }),
      label: figma.string("Label Text"),
      placeholder: figma.string("Placeholder Text"),
    },
    example: ({ autoFocus, disabled, error, label, placeholder, readOnly }) => (
      <Textarea
        autoFocus={autoFocus}
        disabled={disabled}
        error={error}
        label={label}
        placeholder={placeholder}
        readOnly={readOnly}
      />
    ),
  },
);
