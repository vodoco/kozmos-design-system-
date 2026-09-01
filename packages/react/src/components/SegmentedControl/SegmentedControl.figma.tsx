import figma from "@figma/code-connect";
import { SegmentedControl } from "./SegmentedControl";

figma.connect(
  SegmentedControl,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=309-5165",
  {
    props: {
      size: figma.enum("Size", {
        Small: "sm",
        Default: "default",
        Large: "lg",
      }),
      defaultValue: figma.enum("Active", {
        One: "one",
        Two: "two",
        Three: "three",
      }),
      disabled: figma.enum("State", {
        Default: false,
        Focus: false,
        Disabled: true,
        Error: false,
      }),
      error: figma.enum("State", {
        Default: false,
        Focus: false,
        Disabled: false,
        Error: true,
      }),
      item1Text: figma.string("Item 1 Text"),
      item2Text: figma.string("Item 2 Text"),
      item3Text: figma.string("Item 3 Text"),
    },
    example: ({
      defaultValue,
      disabled,
      error,
      item1Text,
      item2Text,
      item3Text,
      size,
    }) => (
      <SegmentedControl
        defaultValue={defaultValue}
        disabled={disabled}
        error={error}
        items={[
          { value: "one", label: item1Text },
          { value: "two", label: item2Text },
          { value: "three", label: item3Text },
        ]}
        size={size}
      />
    ),
  },
);
