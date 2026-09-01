import figma from "@figma/code-connect";
import { POIMediaGallery } from "./POIMediaGallery";

const poiMediaGalleryUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8119";

figma.connect(POIMediaGallery, poiMediaGalleryUrl, {
  props: {
    positionText: figma.string("Position Text"),
  },
  // Content maps to how many items media holds: Single hides the paging
  // controls, Empty renders nothing, and neither is a prop.
  example: ({ positionText }) => (
    <POIMediaGallery
      media={media}
      label="Venue photographs"
      positionLabel={(current, total) => `${current} of ${total}`}
      onActiveIndexChange={(index) => setActiveIndex(index)}
    />
  ),
});
