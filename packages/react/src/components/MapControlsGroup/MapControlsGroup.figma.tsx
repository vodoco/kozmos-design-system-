import figma from "@figma/code-connect";
import {
  MapControlsGroup,
  type MapControlsGroupProps,
} from "./MapControlsGroup";

const mapControlsGroupUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8408";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const zoomIn: NonNullable<MapControlsGroupProps["onZoomIn"]>;
declare const zoomOut: NonNullable<MapControlsGroupProps["onZoomOut"]>;
declare const resetBearing: NonNullable<
  MapControlsGroupProps["onCompassReset"]
>;
declare const recentre: NonNullable<MapControlsGroupProps["onMyLocation"]>;
declare const bearing: MapControlsGroupProps["compassBearing"];
declare const locationState: MapControlsGroupProps["locationState"];

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
