import figma from "@figma/code-connect";
import { MultiSelect } from "./MultiSelect";

figma.connect(
  MultiSelect,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=401-9365",
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
      status: figma.enum("Status", {
        Default: "default",
        Error: "error",
        Warning: "warning",
        Success: "success",
      }),
      defaultValue: figma.enum("Content", {
        Empty: [],
        Selected: ["metro-station", "bus-stop"],
        Open: ["metro-station", "bus-stop"],
      }),
      defaultSearchValue: figma.enum("Content", {
        Empty: "",
        Selected: "",
        Open: figma.string("Placeholder Text"),
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
      defaultSearchValue,
      defaultValue,
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
      <MultiSelect
        defaultSearchValue={defaultSearchValue}
        defaultValue={defaultValue}
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
