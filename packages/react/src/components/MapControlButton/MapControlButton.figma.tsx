import figma from "@figma/code-connect";
import { MapControlButton } from "./MapControlButton";

const mapControlButtonUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8388";

figma.connect(MapControlButton, mapControlButtonUrl, {
  props: {
    label: figma.string("Label Text"),
    presentation: figma.enum("Presentation", {
      IconOnly: "icon-only",
      Labelled: "labelled",
    }),
  },
  example: ({ label, presentation }) => (
    <MapControlButton
      icon={zoomInIcon}
      label={label}
      presentation={presentation}
      onClick={() => zoomIn()}
    />
  ),
});
