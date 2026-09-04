import figma from "@figma/code-connect";
import { MapControlsGroup } from "./MapControlsGroup";

const mapControlsGroupUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8408";

figma.connect(MapControlsGroup, mapControlsGroupUrl, {
  props: {
    locationPresentation: figma.enum("LocationPresentation", {
      IconOnly: "icon-only",
      Labelled: "labelled",
    }),
    locationLabel: figma.string("Location Label Text"),
  },
  example: ({ locationPresentation, locationLabel }) => (
    <MapControlsGroup
      label="Map controls"
      onZoomIn={() => zoomIn()}
      onZoomOut={() => zoomOut()}
      onCompassReset={() => resetBearing()}
      onMyLocation={() => recentre()}
      compassBearing={bearing}
      locationState={locationState}
      locationLabel={locationLabel}
      locationPresentation={locationPresentation}
    />
  ),
});
