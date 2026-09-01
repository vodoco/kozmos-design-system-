import figma from "@figma/code-connect";
import { Listbox } from "./Listbox";

figma.connect(
  Listbox,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=401-9475",
  {
    props: {
      multiple: figma.enum("Selection", {
        Single: false,
        Multiple: true,
      }),
      disabled: figma.enum("State", {
        Default: false,
        Focus: false,
        Disabled: true,
      }),
      defaultValue: figma.enum("Selection", {
        Single: "metro-station",
        Multiple: ["metro-station", "bus-stop"],
      }),
      option1: figma.string("Option 1 Text"),
      option1Description: figma.string("Option 1 Description"),
      option2: figma.string("Option 2 Text"),
      option2Description: figma.string("Option 2 Description"),
      option3: figma.string("Option 3 Text"),
      option3Description: figma.string("Option 3 Description"),
    },
    example: ({
      defaultValue,
      disabled,
      multiple,
      option1,
      option1Description,
      option2,
      option2Description,
      option3,
      option3Description,
    }) => (
      <Listbox
        defaultValue={defaultValue}
        disabled={disabled}
        multiple={multiple}
        options={[
          {
            description: option1Description,
            label: option1,
            value: "metro-station",
          },
          {
            description: option2Description,
            label: option2,
            value: "bus-stop",
          },
          {
            description: option3Description,
            label: option3,
            value: "bike-parking",
          },
        ]}
      />
    ),
  },
);
