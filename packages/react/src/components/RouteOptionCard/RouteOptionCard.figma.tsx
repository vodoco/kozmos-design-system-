import figma from "@figma/code-connect";
import { RouteOptionCard, type RouteOptionCardProps } from "./RouteOptionCard";

const routeOptionCardUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=1351-8197";

// What the caller supplies, typed from the component's own props so the
// example type-checks against them; Code Connect renders the names as written.
declare const option: RouteOptionCardProps["option"];
declare const transportModeIcon: RouteOptionCardProps["icon"];
declare const selectRoute: RouteOptionCardProps["onSelect"];

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
