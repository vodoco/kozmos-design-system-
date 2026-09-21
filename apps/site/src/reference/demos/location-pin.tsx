import { useState } from "react";
import { Box, Icon, LocationPin, Text } from "@kozmos/react";
import { tint } from "../sample-data";
import type { DemoModule } from "../types";

function Variants() {
  return (
    <Box className="site-demo-row">
      <LocationPin label="Primary" />
      <LocationPin label="Default" variant="default" />
      <LocationPin label="Secondary" variant="secondary" />
      <LocationPin label="Accent" variant="accent" />
      <LocationPin label="Small" size="sm" />
      <LocationPin label="Large" size="lg" />
    </Box>
  );
}

function States() {
  const [selected, setSelected] = useState("2");
  return (
    <Box className="site-demo-column">
      <Box className="site-demo-row">
        {["1", "2", "3"].map((number) => (
          <LocationPin
            key={number}
            label={`Result ${number}`}
            number={Number(number)}
            selected={selected === number}
            onClick={() => setSelected(number)}
          />
        ))}
        <LocationPin label="Featured" featured />
        <LocationPin label="On another floor" offFloor />
        <LocationPin label="Unavailable" disabled />
      </Box>
      <Text size="sm" color="muted" aria-live="polite">
        Result {selected} is selected; the label is the pin’s accessible name.
      </Text>
    </Box>
  );
}

function Tinted() {
  return (
    <Box className="site-demo-row">
      <LocationPin
        label="Bookshop, first floor"
        externalLabel="Bookshop"
        tint={tint("blue")}
        markerContent={<Icon name="shopping-bag-02" size="sm" />}
      />
      <LocationPin
        label="Bus interchange"
        externalLabel="Buses"
        labelPlacement="right"
        tint={tint("green")}
        markerContent={<Icon name="bus" size="sm" />}
      />
      <LocationPin
        label="Information desk"
        externalLabel="Information"
        labelPlacement="top"
        tint={tint("turquoise")}
        markerContent={<Icon name="info-circle" size="sm" />}
      />
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Variants and sizes",
    description: "A pin is a button; in a product the map engine places it.",
    Component: Variants,
  },
  {
    title: "Numbered, selected, featured, off-floor, disabled",
    Component: States,
  },
  {
    title: "Category tint, a glyph, and an external label",
    description:
      "tint colours the pin from a category; externalLabel prints beside it where labelPlacement says.",
    Component: Tinted,
  },
];
