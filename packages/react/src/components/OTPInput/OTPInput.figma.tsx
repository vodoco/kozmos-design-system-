import figma from "@figma/code-connect";
import { OTPInput } from "./OTPInput";

figma.connect(
  OTPInput,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=475-38745",
  {
    props: {
      length: figma.enum("Length", {
        "4": 4,
        "6": 6,
      }),
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
      digit1: figma.string("Digit 1 Text"),
      digit2: figma.string("Digit 2 Text"),
      digit3: figma.string("Digit 3 Text"),
      digit4: figma.string("Digit 4 Text"),
      digit5: figma.string("Digit 5 Text"),
      digit6: figma.string("Digit 6 Text"),
      helperText: figma.boolean("Show Helper Text", {
        true: figma.string("Helper Text"),
        false: undefined,
      }),
    },
    example: ({
      autoFocus,
      digit1,
      digit2,
      digit3,
      digit4,
      digit5,
      digit6,
      disabled,
      helperText,
      label,
      length,
      readOnly,
      status,
    }) => {
      const value = [digit1, digit2, digit3, digit4, digit5, digit6]
        .slice(0, length)
        .join("");

      return (
        <OTPInput
          autoFocus={autoFocus}
          disabled={disabled}
          helperText={helperText}
          label={label}
          length={length}
          readOnly={readOnly}
          status={status}
          value={value}
        />
      );
    },
  },
);
