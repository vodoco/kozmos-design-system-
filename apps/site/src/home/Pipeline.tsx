import {
  Text,
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@kozmos/react";
import { ciGates } from "../lib/ci-gates";

/** The pull-request pipeline, as a Timeline. */
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
