import React from "react";
import { cn } from "../../utils";

export interface MapViewProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  /** Accessible name for the rendered map surface. */
  mapLabel?: string;
}

const MapView = React.forwardRef<HTMLDivElement, MapViewProps>(
  (
    { className, children, mapLabel = "Map", role = "region", ...props },
    ref,
  ) => (
    <div
      ref={ref}
      aria-label={mapLabel}
      className={cn(
        "relative w-full h-full min-h-[400px] bg-muted overflow-hidden rounded-container border border-border",
        className,
      )}
      role={role}
      {...props}
    >
      {children}
    </div>
  ),
);
MapView.displayName = "MapView";

export { MapView };
