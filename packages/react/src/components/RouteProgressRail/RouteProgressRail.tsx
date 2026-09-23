import React from "react";
import { cn } from "../../utils";
import {
  DirectionIcon,
  type DirectionType,
} from "../DirectionStep/DirectionStep";

export interface RouteProgressRailProps extends React.HTMLAttributes<HTMLDivElement> {
  /** How far along the route, 0 to 1; anything outside is clamped. */
  progress: number;
  /** The current manoeuvre, carried on the disc. */
  type: DirectionType;
  /** What the rail is called to assistive technology: "Step 2 of 4". */
  label: string;
}

/** The rail's geometry in pixels: the end dots, the travelling disc, the track. */
export const ROUTE_PROGRESS_RAIL = { dot: 10, disc: 34, track: 6 } as const;

export function clampProgress(progress: number) {
  return Number.isFinite(progress) ? Math.min(Math.max(progress, 0), 1) : 0;
}

/**
 * Where the disc's leading edge sits for a progress, as a CSS length: from
 * just after the start dot to just before the end dot.
 */
export function discLeading(progress: number) {
  const { dot, disc } = ROUTE_PROGRESS_RAIL;
  return `calc(${dot}px + (100% - ${dot * 2 + disc}px) * ${clampProgress(progress)})`;
}

/**
 * How far along the route the visitor is, as a rail: a dot where it starts,
 * a disc carrying the current manoeuvre's arrow that travels the track, a
 * dot where it ends. Assistive technology hears the label and the progress
 * as a percentage.
 */
const RouteProgressRail = React.forwardRef<
  HTMLDivElement,
  RouteProgressRailProps
>(({ className, style, progress, type, label, ...props }, ref) => {
  const { dot, disc, track } = ROUTE_PROGRESS_RAIL;
  const clamped = clampProgress(progress);
  return (
    <div
      ref={ref}
      role="progressbar"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(clamped * 100)}
      className={cn("kozmos-route-rail relative w-full", className)}
      style={{ height: disc, ...style }}
      {...props}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 rounded-pill bg-muted"
        style={{ left: dot, right: dot, height: track }}
      />
      <span
        aria-hidden="true"
        className="absolute left-0 top-1/2 -translate-y-1/2 rounded-pill bg-primary"
        style={{ width: dot, height: dot }}
      />
      <span
        aria-hidden="true"
        className="absolute right-0 top-1/2 -translate-y-1/2 rounded-pill bg-muted"
        style={{ width: dot, height: dot }}
      />
      <span
        aria-hidden="true"
        data-testid="route-progress-disc"
        className="absolute top-0 flex items-center justify-center rounded-pill bg-primary text-primary-foreground"
        style={{ left: discLeading(clamped), width: disc, height: disc }}
      >
        <DirectionIcon type={type} className="h-4 w-4" />
      </span>
    </div>
  );
});
RouteProgressRail.displayName = "RouteProgressRail";

export { RouteProgressRail };
