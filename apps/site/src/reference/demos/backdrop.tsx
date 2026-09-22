import { useEffect, useState } from "react";
import { Backdrop, Button, Stack, Text } from "@kozmos/react";
import type { DemoModule } from "../types";

function ForTwoSeconds() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!visible) return;
    const timer = window.setTimeout(() => setVisible(false), 2000);
    return () => window.clearTimeout(timer);
  }, [visible]);
  return (
    <Stack gap={3} align="start">
      <Text size="sm" color="muted">
        The backdrop covers the whole viewport with the overlay scrim; it is
        what a dialog or sheet sits on. Press to show it for two seconds.
      </Text>
      <Button variant="outline" onClick={() => setVisible(true)}>
        Show the backdrop
      </Button>
      <Backdrop visible={visible} aria-hidden="true" />
    </Stack>
  );
}

export const demos: DemoModule["demos"] = [
  {
    title: "Over the page",
    description: "visible mounts it; nothing renders otherwise.",
    Component: ForTwoSeconds,
  },
];
