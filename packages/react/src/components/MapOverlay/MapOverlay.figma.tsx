import figma from "@figma/code-connect";
import { MapOverlay } from "./MapOverlay";

const mapOverlayUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8429";

figma.connect(MapOverlay, mapOverlayUrl, {
  props: {
    width: figma.enum("Width", {
      Auto: "auto",
      Small: "sm",
      Medium: "md",
      Large: "lg",
      Full: "full",
    }),
    children: figma.children("*"),
  },
  // position is renderer placement against the map canvas and is deliberately
  // not a variant axis; the caller passes it alongside collisionInsets.
  example: ({ width, children }) => (
    <MapOverlay position="top-left" width={width}>
      {children}
    </MapOverlay>
  ),
});
