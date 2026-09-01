import figma from "@figma/code-connect";
import { RoutePreviewPanel } from "./RoutePreviewPanel";

const routePreviewPanelUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8277";

figma.connect(RoutePreviewPanel, routePreviewPanelUrl, {
  props: {
    status: figma.enum("Status", {
      Idle: "idle",
      Calculating: "calculating",
      Ready: "ready",
      NoRoute: "no-route",
      Error: "error",
    }),
    destinationName: figma.string("Destination Text"),
  },
  example: ({ status, destinationName }) => (
    <RoutePreviewPanel
      status={status}
      destinationName={destinationName}
      options={options}
      onOptionSelect={(routeId) => selectRoute(routeId)}
      onBack={() => goBack()}
      onContinue={(routeId) => startNavigation(routeId)}
      backLabel="Back"
      continueLabel="Continue"
    />
  ),
});
