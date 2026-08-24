import figma from "@figma/code-connect";
import { NavigationItem } from "./NavigationItem";

const navigationItemUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=861-7297";

figma.connect(NavigationItem, navigationItemUrl, {
  props: {
    badgeSlot: figma.slot("Badge Slot"),
    content: figma.enum("Content", {
      Label: "label",
      "Icon Label": "icon-label",
      "Icon Only": "icon-only",
      Badge: "badge",
      Trailing: "trailing",
    }),
    density: figma.enum("Density", {
      Default: "default",
      Compact: "compact",
    }),
    disabled: figma.enum("State", {
      Default: false,
      Hover: false,
      Selected: false,
      Focus: false,
      Disabled: true,
    }),
    focusVisible: figma.boolean("Focus Visible"),
    label: figma.string("Label Text"),
    leadingIconSlot: figma.slot("Leading Icon Slot"),
    placement: figma.enum("Placement", {
      Top: "top",
      Side: "side",
      Rail: "rail",
    }),
    state: figma.enum("State", {
      Default: "default",
      Hover: "hover",
      Selected: "selected",
      Focus: "focus",
      Disabled: "disabled",
    }),
    selected: figma.enum("State", {
      Default: false,
      Hover: false,
      Selected: true,
      Focus: false,
      Disabled: false,
    }),
    trailingSlot: figma.slot("Trailing Slot"),
  },
  example: ({
    badgeSlot,
    content,
    density,
    disabled,
    focusVisible,
    label,
    leadingIconSlot,
    placement,
    selected,
    state,
    trailingSlot,
  }) => (
    <NavigationItem
      badge={badgeSlot}
      content={content}
      density={density}
      disabled={disabled}
      focusVisible={focusVisible}
      icon={leadingIconSlot}
      placement={placement}
      selected={selected}
      state={state}
      trailing={trailingSlot}
    >
      {label}
    </NavigationItem>
  ),
});
