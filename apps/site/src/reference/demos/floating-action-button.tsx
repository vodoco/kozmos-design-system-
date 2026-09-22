import { Box, FloatingActionButton, Icon, Text } from "@kozmos/react";
import type { DemoModule } from "../types";

function Inline() {
  return (
    <Box className="site-demo-row">
      <FloatingActionButton aria-label="Add a place">
        <Icon name="plus" />
      </FloatingActionButton>
      <FloatingActionButton aria-label="Report a problem" emotion="alert">
        <Icon name="alert-triangle" />
      </FloatingActionButton>
      <FloatingActionButton aria-label="Show my location" variant="outline">
        <Icon name="navigation-pointer-01" />
      </FloatingActionButton>
      <Text size="sm" color="muted">
        {'placement="inline"'} (the default) keeps it in the flow; {'"fixed"'}{" "}
        pins it to the bottom right of the viewport, which is what a product
        wants and what a demo cannot show.
      </Text>
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Inline",
    description:
      "A round Button with an icon; emotion and variant as on Button.",
    Component: Inline,
  },
];
