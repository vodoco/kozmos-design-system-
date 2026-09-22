import { useState } from "react";
import {
  BottomNavigation,
  Box,
  Button,
  Icon,
  Switch,
  Text,
} from "@kozmos/react";
import type { DemoModule } from "../types";

const tabs = [
  { id: "explore", label: "Explore", icon: "map-01" },
  { id: "search", label: "Search", icon: "search-md" },
  { id: "saved", label: "Saved", icon: "heart" },
  { id: "you", label: "You", icon: "user-01" },
] as const;

function Summon() {
  const [shown, setShown] = useState(false);
  // Kozmos's default is compact; switching it off asks for the taller items.
  const [compact, setCompact] = useState(true);
  const [active, setActive] = useState("explore");
  return (
    <Box className="site-demo-column">
      <Text size="sm" color="muted">
        The bar is fixed to the bottom of the viewport (GAP-29), so this stage
        cannot hold it. Show it, switch tabs, then hide it; it sits over the
        site’s footer while shown.
      </Text>
      <Box className="site-demo-row">
        <Button
          variant={shown ? "outline" : "default"}
          onClick={() => setShown((value) => !value)}
        >
          {shown ? "Hide the bar" : "Show the bar"}
        </Button>
        <Switch
          label="Compact"
          checked={compact}
          onCheckedChange={setCompact}
        />
      </Box>
      <Text size="sm" color="muted" aria-live="polite">
        {shown
          ? `${tabs.find((tab) => tab.id === active)?.label} is the current tab.`
          : "Hidden."}
      </Text>
      {shown ? (
        <BottomNavigation
          aria-label="App sections"
          density={compact ? "compact" : "default"}
          items={tabs.map((tab) => ({
            label: tab.label,
            icon: <Icon name={tab.icon} />,
            active: active === tab.id,
            onClick: () => setActive(tab.id),
            badge: tab.id === "saved" ? 2 : undefined,
          }))}
        />
      ) : null}
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Summon the bar",
    description:
      'A phone app’s bottom bar: four tabs, active marks the current one, badge counts what is waiting. It is compact unless density="default" asks for taller items.',
    Component: Summon,
  },
];
