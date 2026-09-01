import { render, screen } from "@testing-library/react";
import {
  Timeline,
  TimelineDescription,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "./Timeline";
import { describe, it, expect } from "vitest";

describe("Timeline", () => {
  it("renders ordered composed timeline items", () => {
    render(
      <Timeline>
        <TimelineItem>
          <TimelineTitle>Event 1</TimelineTitle>
        </TimelineItem>
        <TimelineItem>
          <TimelineTitle>Event 2</TimelineTitle>
        </TimelineItem>
      </Timeline>,
    );
    expect(screen.getByText("Event 1")).toBeInTheDocument();
    expect(screen.getByText("Event 2")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  it("exposes density and stable anatomy attributes", () => {
    render(
      <Timeline density="compact" aria-label="Activity">
        <TimelineItem>
          <TimelineTime dateTime="2026-06-05T09:00:00Z">09:00</TimelineTime>
          <TimelineTitle>Created</TimelineTitle>
          <TimelineDescription>Initial event captured.</TimelineDescription>
        </TimelineItem>
      </Timeline>,
    );

    const list = screen.getByRole("list", { name: "Activity" });
    expect(list).toHaveAttribute("data-density", "compact");
    expect(list).toHaveAttribute("data-timeline");
    expect(screen.getByRole("listitem")).toHaveAttribute("data-timeline-item");
    expect(screen.getByText("09:00")).toHaveAttribute("data-timeline-time");
    expect(screen.getByText("Created")).toHaveAttribute("data-timeline-title");
    expect(screen.getByText("Initial event captured.")).toHaveAttribute(
      "data-timeline-description",
    );
  });
});
