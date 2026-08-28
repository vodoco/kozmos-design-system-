import React from "react";
import type {
  MapCollisionInsets,
  MapReadiness,
} from "@kozmos/product-contracts";
import { cn } from "../../utils";

export interface AdaptiveMapShellProps extends React.HTMLAttributes<HTMLDivElement> {
  map: React.ReactNode;
  mapLabel?: string;
  mapStatus?: MapReadiness;
  mapStatusContent?: React.ReactNode;
  controls?: React.ReactNode;
  topBar?: React.ReactNode;
  panel?: React.ReactNode;
  panelLabel?: string;
  panelPlacement?: "start" | "end";
  collisionInsets?: Partial<MapCollisionInsets>;
}

const AdaptiveMapShell = React.forwardRef<
  HTMLDivElement,
  AdaptiveMapShellProps
>(
  (
    {
      className,
      map,
      mapLabel = "Map",
      mapStatus = "ready",
      mapStatusContent,
      controls,
      topBar,
      panel,
      panelLabel = "Map details",
      panelPlacement = "end",
      collisionInsets,
      style,
      ...props
    },
    ref,
  ) => {
    const insetStyle = {
      "--kozmos-map-inset-top": `${collisionInsets?.top ?? 0}px`,
      "--kozmos-map-inset-right": `${collisionInsets?.right ?? 0}px`,
      "--kozmos-map-inset-bottom": `${collisionInsets?.bottom ?? 0}px`,
      "--kozmos-map-inset-left": `${collisionInsets?.left ?? 0}px`,
      ...style,
    } as React.CSSProperties;

    return (
      <div
        ref={ref}
        className={cn(
          "relative isolate min-h-[28rem] w-full overflow-hidden bg-muted",
          className,
        )}
        data-map-status={mapStatus}
        data-panel-placement={panelPlacement}
        style={insetStyle}
        {...props}
      >
        <section aria-label={mapLabel} className="absolute inset-0">
          {map}
        </section>

        {mapStatus !== "ready" && mapStatusContent && (
          <div
            className="absolute inset-0 z-20 flex items-center justify-center bg-background/80 p-6 text-center backdrop-blur-sm"
            role={mapStatus === "error" ? "alert" : "status"}
          >
            {mapStatusContent}
          </div>
        )}

        {topBar && (
          <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex justify-center p-[max(1rem,env(safe-area-inset-top))]">
            <div className="pointer-events-auto w-full max-w-2xl">{topBar}</div>
          </div>
        )}

        {controls && (
          <div
            className={cn(
              "pointer-events-none absolute top-[max(1rem,env(safe-area-inset-top))] z-30",
              panelPlacement === "end"
                ? "left-[max(1rem,env(safe-area-inset-left))]"
                : "right-[max(1rem,env(safe-area-inset-right))]",
            )}
          >
            <div className="pointer-events-auto">{controls}</div>
          </div>
        )}

        {panel && (
          <aside
            aria-label={panelLabel}
            className={cn(
              "absolute inset-x-0 bottom-0 z-40 max-h-[min(64dvh,42rem)] overflow-hidden rounded-t-container bg-background shadow-2xl md:inset-y-[max(1rem,env(safe-area-inset-top))] md:max-h-none md:w-[min(26rem,42vw)] md:rounded-container",
              panelPlacement === "end"
                ? "md:left-auto md:right-[max(1rem,env(safe-area-inset-right))]"
                : "md:left-[max(1rem,env(safe-area-inset-left))] md:right-auto",
            )}
          >
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain pb-[env(safe-area-inset-bottom)]">
              {panel}
            </div>
          </aside>
        )}
      </div>
    );
  },
);

AdaptiveMapShell.displayName = "AdaptiveMapShell";

export { AdaptiveMapShell };
