import { useState } from "react";
import {
  Box,
  Button,
  LocationPin,
  SegmentedControl,
  Stack,
  Text,
} from "@kozmos/react";

const durations = ["quick", "standard", "deliberate"] as const;
const easings = [
  { value: "standard", label: "Standard" },
  { value: "emphasised", label: "Emphasised" },
] as const;

type Easing = (typeof easings)[number]["value"];

/** Three markers, one per duration token, racing on the chosen easing. */
export function MotionRace({ compact = false }: { compact?: boolean }) {
  const [end, setEnd] = useState(false);
  const [easing, setEasing] = useState<Easing>("standard");
  return (
    <Stack gap={compact ? 3 : 4}>
      <Stack direction="row" wrap="wrap" align="end" gap={4}>
        <SegmentedControl
          label="Easing"
          size={compact ? "sm" : "default"}
          items={easings.map((entry) => ({
            value: entry.value,
            label: entry.label,
          }))}
          value={easing}
          onValueChange={(next) => {
            if (next === "standard" || next === "emphasised") setEasing(next);
          }}
        />
        <Button
          size={compact ? "sm" : "default"}
          onClick={() => setEnd((value) => !value)}
        >
          {end ? "Back" : "Run"}
        </Button>
      </Stack>
      <Stack gap={compact ? 2 : 3}>
        {durations.map((duration) => (
          <Box key={duration} className="site-track-lane">
            <Text as="span" size="xs" color="muted" className="site-mono">
              duration-{duration} · easing-{easing}
            </Text>
            <Box
              className="site-track"
              data-end={end ? "true" : undefined}
              style={{
                "--dur": `var(--semantics-motion-duration-${duration})`,
                "--ease": `var(--semantics-motion-easing-${easing})`,
              }}
            >
              <Box className="site-runner">
                <LocationPin label={`${duration} marker`} size="sm" />
              </Box>
            </Box>
          </Box>
        ))}
      </Stack>
    </Stack>
  );
}
