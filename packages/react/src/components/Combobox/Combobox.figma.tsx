import figma from "@figma/code-connect";
import { Combobox } from "./Combobox";

figma.connect(
  Combobox,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=398-8298",
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
      defaultInputValue: figma.enum("Content", {
        Closed: undefined,
        Open: figma.string("Option 1 Text"),
      }),
      label: figma.string("Label Text"),
      placeholder: figma.string("Placeholder Text"),
      option1: figma.string("Option 1 Text"),
      option2: figma.string("Option 2 Text"),
      option3: figma.string("Option 3 Text"),
      helperText: figma.boolean("Show Helper Text", {
        true: figma.string("Helper Text"),
        false: undefined,
      }),
    },
    example: ({
      autoFocus,
      defaultInputValue,
      disabled,
      helperText,
      label,
      option1,
      option2,
      option3,
      placeholder,
      readOnly,
      status,
    }) => (
      <Combobox
        autoFocus={autoFocus}
        defaultInputValue={defaultInputValue}
        disabled={disabled}
        helperText={helperText}
        label={label}
        options={[
          { label: option1, value: "metro-station" },
          { label: option2, value: "bus-stop" },
          { label: option3, value: "bike-parking" },
        ]}
        placeholder={placeholder}
        readOnly={readOnly}
        status={status}
      />
    ),
  },
);
