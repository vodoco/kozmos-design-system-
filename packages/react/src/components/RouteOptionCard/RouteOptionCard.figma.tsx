import figma from "@figma/code-connect";
import { RouteOptionCard } from "./RouteOptionCard";

const routeOptionCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8197";

figma.connect(RouteOptionCard, routeOptionCardUrl, {
  props: {
    label: figma.string("Option Label Text"),
    warning: figma.enum("State", {
      Default: undefined,
      Selected: undefined,
      Warning: figma.string("Warning Text"),
      Unavailable: undefined,
    }),
  },
  // option is a RouteOptionPresentation; selected, available and warning are
  // its fields, which is why State has no matching prop.
  example: ({ label, warning }) => (
    <RouteOptionCard
      option={{ ...option, label, warning }}
      icon={transportModeIcon}
      onSelect={(routeId) => selectRoute(routeId)}
    />
  ),
});
