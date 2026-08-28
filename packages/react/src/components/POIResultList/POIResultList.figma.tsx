import figma from "@figma/code-connect";
import { EmptyState } from "../EmptyState/EmptyState";
import { POIResultList } from "./POIResultList";

const poiResultListUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8171";

figma.connect(POIResultList, poiResultListUrl, {
  props: {
    resultCountLabel: figma.string("Result Count Text"),
    emptyState: figma.enum("Content", {
      Basic: undefined,
      Selected: undefined,
      Empty: <EmptyState title="No results" />,
    }),
  },
  example: ({ resultCountLabel, emptyState }) => (
    <POIResultList
      items={items}
      resultCountLabel={resultCountLabel}
      selectedPoiId={selectedPoiId}
      onSelect={(poiId) => selectPoi(poiId)}
      emptyState={emptyState}
      label="Search results"
    />
  ),
});
