import {
  Box,
  Chip,
  ChipGroup,
  List,
  ListItem,
  ScrollArea,
  Text,
} from "@kozmos/react";
import type { DemoModule } from "../types";

const quickAccess = [
  "Shops",
  "Food and drink",
  "Toilets",
  "Information",
  "Transport",
  "Events",
  "Offices",
  "Wi-Fi",
  "Parking",
  "First aid",
];

function Sideways() {
  return (
    <Box className="site-demo-column">
      <ScrollArea
        orientation="horizontal"
        viewportProps={{ "aria-label": "Quick access" }}
      >
        <ChipGroup>
          {quickAccess.map((label) => (
            <Chip key={label} size="sm">
              {label}
            </Chip>
          ))}
        </ChipGroup>
      </ScrollArea>
      <Text size="sm" color="muted">
        The scrollbar is hidden by default; the viewport is focusable and
        scrolls with the keyboard.
      </Text>
    </Box>
  );
}

function Vertical() {
  return (
    <Box className="site-demo-column">
      <ScrollArea
        hideScrollbar={false}
        viewportProps={{
          "aria-label": "Floors",
          className: "site-demo-scroll",
        }}
      >
        <List density="compact">
          {Array.from({ length: 14 }, (_, index) => (
            <ListItem key={index}>
              <Text as="span" size="sm">
                Level {14 - index}
              </Text>
            </ListItem>
          ))}
        </List>
      </ScrollArea>
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Sideways",
    description:
      'orientation="horizontal" needs no height; a quick-access row scrolls under the thumb.',
    Component: Sideways,
  },
  {
    title: "Up and down",
    description:
      "A vertical scroller needs a bounded height; here the viewport carries it.",
    Component: Vertical,
  },
];
