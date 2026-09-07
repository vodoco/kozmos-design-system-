import figma from "@figma/code-connect";
import { MapControlButton } from "./MapControlButton";

const mapControlButtonUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1785-8821";

figma.connect(MapControlButton, mapControlButtonUrl, {
  props: {
    presentation: figma.enum("Presentation", {
      IconOnly: "icon-only",
      Labelled: "labelled",
    }),
    // Two React concerns, one Figma axis. Pressed is a mode that stays on and
    // is announced by aria-pressed; Disabled is the native attribute. Default
    // maps to neither, which is why both enums leave it undefined.
    pressed: figma.enum("State", { Pressed: true }),
    disabled: figma.enum("State", { Disabled: true }),
    // The label and the icon live on the nested Button, because a component's
    // own property cannot drive a node inside a nested instance.
    button: figma.nestedProps("Control Button", {
      label: figma.string("Label Text"),
      icon: figma.instance("Icon"),
    }),
  },
  example: ({ presentation, pressed, disabled, button }) => (
    <MapControlButton
      disabled={disabled}
      icon={button.icon}
      label={button.label}
      presentation={presentation}
      pressed={pressed}
    />
  ),
});
