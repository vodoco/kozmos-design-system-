import React from "react";
import { cn } from "../../utils";

export type TimelineDensity = "default" | "compact";

export interface TimelineProps extends React.HTMLAttributes<HTMLOListElement> {
  density?: TimelineDensity;
}

const Timeline = React.forwardRef<HTMLOListElement, TimelineProps>(
  ({ className, density = "default", ...props }, ref) => (
    <ol
      ref={ref}
      data-density={density}
      data-timeline
      className={cn(
        "relative ml-3 border-l border-muted",
        density === "compact" &&
          "[&_[data-timeline-description]]:mb-2 [&_[data-timeline-description]]:text-sm [&_[data-timeline-item]]:mb-6 [&_[data-timeline-time]]:mb-1 [&_[data-timeline-title]]:text-base",
        className,
      )}
      {...props}
    />
  ),
);
Timeline.displayName = "Timeline";

export type TimelineItemProps = React.LiHTMLAttributes<HTMLLIElement>;

const TimelineItem = React.forwardRef<HTMLLIElement, TimelineItemProps>(
  ({ className, children, ...props }, ref) => (
    <li
      ref={ref}
      data-timeline-item
      className={cn("mb-10 ml-6 last:mb-0", className)}
      {...props}
    >
      <span
        aria-hidden="true"
        data-timeline-marker
        className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-pill bg-secondary ring-8 ring-background"
      >
        <span data-timeline-dot className="h-2 w-2 rounded-pill bg-primary" />
      </span>
      {children}
    </li>
  ),
);
TimelineItem.displayName = "TimelineItem";

const TimelineTime = React.forwardRef<
  HTMLTimeElement,
  React.TimeHTMLAttributes<HTMLTimeElement>
>(({ className, ...props }, ref) => (
  <time
    ref={ref}
    data-timeline-time
    className={cn(
      "block mb-2 text-sm font-normal leading-none text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TimelineTime.displayName = "TimelineTime";

const TimelineTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    data-timeline-title
    className={cn("flex items-center mb-1 text-lg font-semibold", className)}
    {...props}
  />
));
TimelineTitle.displayName = "TimelineTitle";

const TimelineDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    data-timeline-description
    className={cn(
      "mb-4 text-base font-normal text-muted-foreground",
      className,
    )}
    {...props}
  />
));
TimelineDescription.displayName = "TimelineDescription";

export {
  Timeline,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
  TimelineDescription,
};
