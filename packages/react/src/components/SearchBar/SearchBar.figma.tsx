import figma from "@figma/code-connect";
import { SearchBar } from "./SearchBar";

const searchBarUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=682-15111";

figma.connect(SearchBar, searchBarUrl, {
  props: {
    variant: figma.enum("Variant", {
      Inline: "inline",
      Floating: "floating",
    }),
    disabled: figma.enum("State", {
      Default: false,
      Focus: false,
      Filled: false,
      Disabled: true,
    }),
    placeholder: figma.string("Placeholder Text"),
    value: figma.string("Value Text"),
  },
  example: ({ disabled, placeholder, value, variant }) => (
    <SearchBar
      disabled={disabled}
      placeholder={placeholder}
      value={value}
      variant={variant}
    />
  ),
});
