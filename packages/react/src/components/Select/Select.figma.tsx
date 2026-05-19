import figma from "@figma/code-connect";
import { Select, SelectTrigger, SelectValue } from "./Select";

figma.connect(
  SelectTrigger,
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=80-432",
  {
    props: {
      disabled: figma.enum("State", {
        Default: false,
        Focus: false,
        Disabled: true,
      }),
      autoFocus: figma.enum("State", {
        Default: false,
        Focus: true,
        Disabled: false,
      }),
      error: figma.enum("Status", {
        Default: false,
        Error: true,
      }),
      placeholder: figma.string("Placeholder Text"),
    },
    example: ({ autoFocus, disabled, error, placeholder }) => (
      <Select>
        <SelectTrigger autoFocus={autoFocus} disabled={disabled} error={error}>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
      </Select>
    ),
  },
);
