import figma from "@figma/code-connect";
import { MapOverlay } from "../MapOverlay/MapOverlay";
import { MapView } from "./MapView";

const mapViewUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1340-6854";

figma.connect(MapView, mapViewUrl, {
  props: {
    children: figma.enum("Content", {
      Empty: undefined,
      Overlay: <MapOverlay position="top-left">{overlayContent}</MapOverlay>,
    }),
  },
  // The canvas itself is renderer output; attribution comes from the adapter.
  example: ({ children }) => <MapView mapLabel="Venue map">{children}</MapView>,
});
