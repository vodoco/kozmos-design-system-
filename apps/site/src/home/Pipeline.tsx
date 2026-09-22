import {
  Box,
  Icon,
  Text,
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@kozmos/react";
import { ciGates } from "../lib/ci-gates";

/** The pull-request pipeline in full, as a Timeline: what each check does. */
export function Pipeline() {
  return (
    <Timeline>
      {ciGates.map((gate) => (
        <TimelineItem key={gate.title}>
          <TimelineTime>
            <Text as="span" size="xs" className="site-mono">
              {gate.command ?? "ci.yml"}
            </Text>
          </TimelineTime>
          <TimelineTitle>{gate.title}</TimelineTitle>
          <TimelineDescription>{gate.detail}</TimelineDescription>
        </TimelineItem>
      ))}
    </Timeline>
  );
}

/**
 * The same checks, short: their names, two to a row. The commands and what
 * each check holds the system to are on Get started, in the Pipeline.
 */
export function Checklist() {
  return (
    <Box className="site-checklist">
      {ciGates.map((gate) => (
        <Box key={gate.title} className="site-check">
          <Icon name="check" size="sm" />
          <Text size="sm" weight="medium">
            {gate.title}
          </Text>
        </Box>
      ))}
    </Box>
  );
}
