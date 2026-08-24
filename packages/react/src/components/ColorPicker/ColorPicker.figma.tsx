import figma from "@figma/code-connect";
import { ColorPicker } from "./ColorPicker";

figma.connect(
  ColorPicker,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=451-13566",
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
      defaultOpen: figma.enum("Content", {
        Closed: false,
        Open: true,
      }),
      defaultFormat: figma.enum("Format", {
        HSL: "hsl",
        RGB: "rgb",
        HEX: "hex",
      }),
      label: figma.string("Label Text"),
      defaultValue: figma.string("Value Text"),
      paletteLabel: figma.string("Palette Text"),
      helperText: figma.boolean("Show Helper Text", {
        true: figma.string("Helper Text"),
        false: undefined,
      }),
    },
    example: ({
      autoFocus,
      defaultFormat,
      defaultOpen,
      defaultValue,
      disabled,
      helperText,
      label,
      paletteLabel,
      readOnly,
      status,
    }) => (
      <ColorPicker
        autoFocus={autoFocus}
        defaultFormat={defaultFormat}
        defaultOpen={defaultOpen}
        defaultValue={defaultValue}
        disabled={disabled}
        helperText={helperText}
        label={label}
        paletteLabel={paletteLabel}
        readOnly={readOnly}
        status={status}
      />
    ),
  },
);
