import { useEffect, useState } from "react";
import { Box, Button, Progress, Stack, Text } from "@kozmos/react";
import type { DemoModule } from "../types";

function Determinate() {
  const [value, setValue] = useState(64);
  return (
    <Box className="site-demo-column">
      <Progress value={value} aria-label="Route progress" />
      <Stack direction="row" align="center" gap={2}>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.max(0, v - 10))}
        >
          Back
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setValue((v) => Math.min(100, v + 10))}
        >
          On
        </Button>
        <Text size="sm" color="muted">
          {value}%
        </Text>
      </Stack>
    </Box>
  );
}

function Loading() {
  const [value, setValue] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setValue((v) => (v >= 100 ? 0 : v + 5)),
      300,
    );
    return () => window.clearInterval(timer);
  }, []);
  return (
    <Box className="site-demo-column">
      <Progress value={value} max={100} aria-label="Loading the map" />
      <Text size="sm" color="muted">
        Loading the map…
      </Text>
    </Box>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "A value out of a maximum",
    description:
      "value and max, from Radix; the bar is labelled for assistive technology.",
    Component: Determinate,
  },
  { title: "Advancing", Component: Loading },
];
