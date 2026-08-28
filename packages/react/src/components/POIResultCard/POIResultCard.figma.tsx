import figma from "@figma/code-connect";
import { POIResultCard } from "./POIResultCard";

const poiResultCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8150";

figma.connect(POIResultCard, poiResultCardUrl, {
  props: {
    featuredLabel: figma.enum("State", {
      Default: undefined,
      Selected: undefined,
      Featured: "Featured",
      Unavailable: undefined,
    }),
  },
  // State reads off result.selected, result.featured and result.available —
  // fields of the POIResultPresentation rather than props of their own.
  example: ({ featuredLabel }) => (
    <POIResultCard
      poi={poi}
      result={result}
      featuredLabel={featuredLabel}
      selectionLabel="Show on map"
      onSelect={(poiId) => selectPoi(poiId)}
    />
  ),
});
