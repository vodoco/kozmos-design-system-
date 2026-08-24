import figma from "@figma/code-connect";
import { DatePicker } from "./DatePicker";

figma.connect(
  DatePicker,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=438-4292",
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
      helperText: figma.boolean("Show Helper Text", {
        true: figma.string("Helper Text"),
        false: undefined,
      }),
    },
    example: ({ autoFocus, disabled, helperText, label, readOnly, status }) => (
      <DatePicker
        autoFocus={autoFocus}
        defaultValue="2026-05-25"
        disabled={disabled}
        helperText={helperText}
        label={label}
        readOnly={readOnly}
        status={status}
      />
    ),
  },
);
