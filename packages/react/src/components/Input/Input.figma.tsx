import figma from "@figma/code-connect";
import { Input } from "./Input";

/**
 * Figma Code Connect: Input
 * @url https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1558
 */
figma.connect(
  Input,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=77-1558",
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
      status: figma.enum("Status", {
        Default: "default",
        Error: "error",
        Warning: "warning",
        Success: "success",
      }),
      label: figma.string("Label Text"),
      placeholder: figma.string("Placeholder Text"),
      helperText: figma.boolean("Show Helper Text", {
        true: figma.string("Helper Text"),
        false: undefined,
      }),
    },
    example: ({
      autoFocus,
      disabled,
      helperText,
      label,
      placeholder,
      readOnly,
      status,
    }) => (
      <Input
        autoFocus={autoFocus}
        disabled={disabled}
        helperText={helperText}
        label={label}
        placeholder={placeholder}
        readOnly={readOnly}
        status={status}
      />
    ),
  },
);
