import figma from "@figma/code-connect";
import { MapControlsGroup } from "../MapControlsGroup/MapControlsGroup";
import { POIDetailPanel } from "../POIDetailPanel/POIDetailPanel";
import { SearchBar } from "../SearchBar/SearchBar";
import { AdaptiveMapShell } from "./AdaptiveMapShell";

const adaptiveMapShellUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-7985";

figma.connect(AdaptiveMapShell, adaptiveMapShellUrl, {
  props: {
    panelPlacement: figma.enum("PanelPlacement", {
      Start: "start",
      End: "end",
    }),
    panelLabel: figma.string("Panel Label Text"),
  },
  example: ({ panelPlacement, panelLabel }) => (
    <AdaptiveMapShell
      map={mapCanvas}
      mapLabel="Venue map"
      panel={<POIDetailPanel />}
      panelLabel={panelLabel}
      panelPlacement={panelPlacement}
      controls={<MapControlsGroup />}
      topBar={<SearchBar />}
    />
  ),
});
