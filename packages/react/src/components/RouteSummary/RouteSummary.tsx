import React from "react";
import { cn } from "../../utils";
import { Button } from "../Button";
import { X, Navigation } from "lucide-react";

export interface RouteSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  etaText: string;
  distanceText: string;
  onEndRoute: () => void;
  onStartNavigation?: () => void;
  transportModeIcon?: React.ReactNode;
  state?: "preview" | "active";
  endRouteLabel?: string;
  startNavigationLabel?: string;
}

const RouteSummary = React.forwardRef<HTMLDivElement, RouteSummaryProps>(
  (
    {
      className,
      etaText,
      distanceText,
      onEndRoute,
      onStartNavigation,
      transportModeIcon,
      state = "active",
      endRouteLabel = "End route",
      startNavigationLabel = "Start navigation",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex w-full flex-col gap-4 rounded-[var(--primitives-radius-2xl)] border border-border bg-background/90 p-4 text-foreground shadow-2xl backdrop-blur-3xl transition-all duration-300",
          className,
        )}
        {...props}
      >
        {/* Information Row */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            {transportModeIcon && (
              <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                {transportModeIcon}
              </div>
            )}
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {etaText}
              </span>
              <span className="text-sm font-medium text-muted-foreground">
                {distanceText}
              </span>
            </div>
          </div>
          {state === "active" && (
            <Button
              variant="destructive"
              size="icon"
              className="h-11 w-11 shrink-0 rounded-full"
              onClick={onEndRoute}
              aria-label={endRouteLabel}
            >
              <X aria-hidden="true" className="w-5 h-5" />
            </Button>
          )}
        </div>

        {/* Primary Action Row - if in preview mode */}
        {state === "preview" && onStartNavigation && (
          <Button
            size="lg"
            className="w-full h-12 rounded-full font-semibold text-base shadow-sm"
            onClick={onStartNavigation}
          >
            <Navigation aria-hidden="true" className="w-5 h-5 mr-2" />
            {startNavigationLabel}
          </Button>
        )}
      </div>
    );
  },
);

RouteSummary.displayName = "RouteSummary";

export { RouteSummary };
