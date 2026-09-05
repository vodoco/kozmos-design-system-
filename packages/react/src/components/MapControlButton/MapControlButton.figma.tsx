import figma from "@figma/code-connect";
import { LocateFixed } from "lucide-react";
import { MapControlButton } from "./MapControlButton";

const mapControlButtonUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1785-8821";

figma.connect(MapControlButton, mapControlButtonUrl, {
  props: {
    label: figma.string("Label Text"),
    presentation: figma.enum("Presentation", {
      IconOnly: "icon-only",
      Labelled: "labelled",
    }),
    // Two React concerns, one Figma axis. \`Pressed\` is a mode that stays on and
    // is announced by aria-pressed; \`Disabled\` is the native attribute. Default
    // maps to neither, which is why both enums leave it undefined.
    pressed: figma.enum("State", { Pressed: true }),
    disabled: figma.enum("State", { Disabled: true }),
  },
  example: ({ label, presentation, pressed, disabled }) => (
    <MapControlButton
      disabled={disabled}
      icon={<LocateFixed aria-hidden="true" className="h-5 w-5" />}
      label={label}
      presentation={presentation}
      pressed={pressed}
    />
  ),
});
