import figma from "@figma/code-connect";
import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "./Timeline";

const timelineUrl =
  "https://figma.com/design/Yj4O8p6Y9h2Sa9zJVoAiVY?node-id=660-4393";

figma.connect(Timeline, timelineUrl, {
  props: {
    content: figma.enum("Content", {
      Basic: "basic",
      Detailed: "detailed",
    }),
    density: figma.enum("Density", {
      Default: "default",
      Compact: "compact",
    }),
    item1Time: figma.string("Item 1 Time"),
    item1Title: figma.string("Item 1 Title"),
    item1Description: figma.string("Item 1 Description"),
    item2Time: figma.string("Item 2 Time"),
    item2Title: figma.string("Item 2 Title"),
    item2Description: figma.string("Item 2 Description"),
    item3Time: figma.string("Item 3 Time"),
    item3Title: figma.string("Item 3 Title"),
    item3Description: figma.string("Item 3 Description"),
  },
  example: ({
    content,
    density,
    item1Time,
    item1Title,
    item1Description,
    item2Time,
    item2Title,
    item2Description,
    item3Time,
    item3Title,
    item3Description,
  }) => {
    const isDetailed = content === "detailed";

    return (
      <Timeline density={density}>
        <TimelineItem>
          {isDetailed ? <TimelineTime>{item1Time}</TimelineTime> : null}
          <TimelineTitle>{item1Title}</TimelineTitle>
          {isDetailed ? (
            <TimelineDescription>{item1Description}</TimelineDescription>
          ) : null}
        </TimelineItem>
        <TimelineItem>
          {isDetailed ? <TimelineTime>{item2Time}</TimelineTime> : null}
          <TimelineTitle>{item2Title}</TimelineTitle>
          {isDetailed ? (
            <TimelineDescription>{item2Description}</TimelineDescription>
          ) : null}
        </TimelineItem>
        <TimelineItem>
          {isDetailed ? <TimelineTime>{item3Time}</TimelineTime> : null}
          <TimelineTitle>{item3Title}</TimelineTitle>
          {isDetailed ? (
            <TimelineDescription>{item3Description}</TimelineDescription>
          ) : null}
        </TimelineItem>
      </Timeline>
    );
  },
});
