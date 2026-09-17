import React from "react";
import type {
  AdaptiveMapLayoutSnapshot,
  MapCollisionInsets,
  MapLayoutRect,
  MapPanelPresentation,
  MapReadiness,
} from "@kozmos/product-contracts";
import { cn } from "../../utils";
import {
  resolveAdaptiveMapLayout,
  resolveMapInsets,
} from "../../layout/adaptive-map-layout";

export type {
  AdaptiveMapLayoutSnapshot,
  MapLayoutRect,
  MapPanelPresentation,
} from "@kozmos/product-contracts";

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
  panelPresentation?: MapPanelPresentation;
  /** Requested bottom-panel height fraction (0.12–0.88); reduced if map chrome needs space. */
  panelFraction?: number;
  /** Minimum renderer padding. Combined with measured chrome using max, not addition. */
  collisionInsets?: Partial<MapCollisionInsets>;
  /** Additional shell-local edge exclusions, e.g. keyboard overlap. Merged with CSS safe areas. */
  safeAreaInsets?: Partial<MapCollisionInsets>;
  /** Hinge-free physical rectangles in shell-local CSS pixels. Omit for a continuous host. */
  usableRegions?: readonly MapLayoutRect[];
  onCollisionInsetsChange?: (insets: MapCollisionInsets) => void;
  onLayoutChange?: (layout: AdaptiveMapLayoutSnapshot) => void;
}

const useLayoutEffect =
  typeof window === "undefined" ? React.useEffect : React.useLayoutEffect;
const zero = { x: 0, y: 0, width: 0, height: 0 };
const mergeSafeInset = (css: number, supplied = 0) =>
  Math.max(css, Number.isFinite(supplied) ? supplied : 0);
const position = (rect: MapLayoutRect): React.CSSProperties => ({
  position: "absolute",
  left: rect.x,
  top: rect.y,
  width: rect.width,
  height: rect.height,
});

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
      panelPresentation = "auto",
      panelFraction,
      collisionInsets,
      safeAreaInsets,
      usableRegions,
      onCollisionInsetsChange,
      onLayoutChange,
      style,
      ...props
    },
    ref,
  ) => {
    const root = React.useRef<HTMLDivElement>(null);
    const safeArea = React.useRef<HTMLDivElement>(null);
    const bar = React.useRef<HTMLDivElement>(null);
    const buttons = React.useRef<HTMLDivElement>(null);
    const [measured, setMeasured] = React.useState({
      ready: false,
      width: 0,
      height: 0,
      direction: "ltr" as "ltr" | "rtl",
      barHeight: 0,
      controlsWidth: 0,
      controlsHeight: 0,
      safe: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    React.useImperativeHandle(ref, () => root.current!, []);

    useLayoutEffect(() => {
      const element = root.current!;
      const measure = () => {
        const safeStyle = getComputedStyle(safeArea.current!);
        const next = {
          ready: true,
          width: element.clientWidth,
          height: element.clientHeight,
          direction:
            getComputedStyle(element).direction === "rtl"
              ? ("rtl" as const)
              : ("ltr" as const),
          barHeight: Math.max(
            bar.current?.offsetHeight ?? 0,
            bar.current?.scrollHeight ?? 0,
          ),
          controlsWidth: buttons.current?.offsetWidth ?? 0,
          controlsHeight: Math.max(
            buttons.current?.offsetHeight ?? 0,
            buttons.current?.scrollHeight ?? 0,
          ),
          safe: {
            top: parseFloat(safeStyle.paddingTop) || 0,
            right: parseFloat(safeStyle.paddingRight) || 0,
            bottom: parseFloat(safeStyle.paddingBottom) || 0,
            left: parseFloat(safeStyle.paddingLeft) || 0,
          },
        };
        setMeasured((previous) =>
          JSON.stringify(previous) === JSON.stringify(next) ? previous : next,
        );
      };
      measure();
      const observer = new ResizeObserver(measure);
      [element, bar.current, buttons.current].forEach((node) => {
        if (node) observer.observe(node);
      });
      observer.observe(safeArea.current!, { box: "border-box" });
      // Inherited direction can change without a resize (including a host locale switch).
      const directionObserver = new MutationObserver(measure);
      for (
        let ancestor: HTMLElement | null = element;
        ancestor;
        ancestor = ancestor.parentElement
      ) {
        directionObserver.observe(ancestor, {
          attributes: true,
          attributeFilter: ["dir", "class", "style"],
        });
      }
      window.addEventListener("resize", measure);
      return () => {
        observer.disconnect();
        directionObserver.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [Boolean(topBar), Boolean(controls)]);

    const safe = {
      top: mergeSafeInset(measured.safe.top, safeAreaInsets?.top),
      right: mergeSafeInset(measured.safe.right, safeAreaInsets?.right),
      bottom: mergeSafeInset(measured.safe.bottom, safeAreaInsets?.bottom),
      left: mergeSafeInset(measured.safe.left, safeAreaInsets?.left),
    };
    const layout = resolveAdaptiveMapLayout({
      ...measured,
      hasPanel: Boolean(panel),
      panelPlacement,
      panelPresentation,
      panelFraction,
      minimumMapHeight:
        (topBar ? measured.barHeight : 0) +
        (controls ? measured.controlsHeight : 0) +
        (topBar && controls ? 48 : topBar || controls ? 32 : 0),
      safeAreaInsets: safe,
      usableRegions,
    });
    const unavailable =
      measured.ready && (!layout.mapBounds.width || !layout.mapBounds.height);
    const onRight =
      (panelPlacement === "end") === (measured.direction !== "rtl");
    const available = { ...layout.mapBounds };
    if (layout.panelBounds && layout.presentation === "side") {
      if (onRight) available.width = layout.panelBounds.x - available.x;
      else {
        available.x = layout.panelBounds.x + layout.panelBounds.width;
        available.width =
          layout.mapBounds.x + layout.mapBounds.width - available.x;
      }
    } else if (layout.panelBounds && layout.presentation === "bottom") {
      available.height = layout.panelBounds.y - available.y;
    }
    const gap = Math.min(16, available.width / 4, available.height / 4);
    const chromeWidth = Math.max(0, available.width - 2 * gap);
    const chromeHeight = Math.max(0, available.height - 2 * gap);
    const barWidth = Math.min(672, chromeWidth);
    const barBounds = {
      x: available.x + (available.width - barWidth) / 2,
      y: available.y + gap,
      width: barWidth,
      height: topBar ? Math.min(measured.barHeight, chromeHeight) : 0,
    };
    const controlsY = barBounds.y + (topBar ? barBounds.height + gap : 0);
    const controlsBounds = {
      x: onRight
        ? available.x + gap
        : available.x + available.width - gap - measured.controlsWidth,
      y: controlsY,
      width: measured.controlsWidth,
      height: Math.min(
        measured.controlsHeight,
        Math.max(0, available.y + available.height - gap - controlsY),
      ),
    };
    const occlusions: AdaptiveMapLayoutSnapshot["occlusions"] = [
      ...(layout.panelBounds
        ? [{ kind: "panel" as const, bounds: layout.panelBounds }]
        : []),
      ...(topBar ? [{ kind: "top-bar" as const, bounds: barBounds }] : []),
      ...(controls
        ? [{ kind: "controls" as const, bounds: controlsBounds }]
        : []),
    ];
    const insets = resolveMapInsets(
      layout.mapBounds,
      occlusions.map((occlusion) => ({
        bounds: occlusion.bounds,
        edge:
          occlusion.kind === "top-bar"
            ? "top"
            : occlusion.kind === "controls"
              ? onRight
                ? "left"
                : "right"
              : layout.presentation === "bottom"
                ? "bottom"
                : onRight
                  ? "right"
                  : "left",
      })),
      collisionInsets,
    );
    const snapshot = JSON.stringify({
      ...layout,
      occlusions,
      collisionInsets: insets,
    });
    const callbacks = React.useRef({ onLayoutChange, onCollisionInsetsChange });
    useLayoutEffect(() => {
      callbacks.current = { onLayoutChange, onCollisionInsetsChange };
    });
    const previousInsets = React.useRef("");
    React.useEffect(() => {
      const value: AdaptiveMapLayoutSnapshot = JSON.parse(snapshot);
      const insetValue = { ...value.collisionInsets };
      const serializedInsets = JSON.stringify(insetValue);
      callbacks.current.onLayoutChange?.(value);
      if (previousInsets.current !== serializedInsets) {
        previousInsets.current = serializedInsets;
        callbacks.current.onCollisionInsetsChange?.(insetValue);
      }
    }, [snapshot]);

    return (
      <div
        ref={root}
        className={cn(
          "relative isolate h-full min-h-0 w-full overflow-hidden bg-muted",
          className,
        )}
        data-map-status={mapStatus}
        data-panel-placement={panelPlacement}
        data-panel-presentation={layout.presentation}
        style={
          {
            "--kozmos-map-inset-top": `${insets.top}px`,
            "--kozmos-map-inset-right": `${insets.right}px`,
            "--kozmos-map-inset-bottom": `${insets.bottom}px`,
            "--kozmos-map-inset-left": `${insets.left}px`,
            ...style,
          } as React.CSSProperties
        }
        {...props}
      >
        <div
          ref={safeArea}
          aria-hidden="true"
          style={{
            position: "absolute",
            visibility: "hidden",
            pointerEvents: "none",
            paddingTop: "env(safe-area-inset-top, 0px)",
            paddingRight: "env(safe-area-inset-right, 0px)",
            paddingBottom: "env(safe-area-inset-bottom, 0px)",
            paddingLeft: "env(safe-area-inset-left, 0px)",
          }}
        />
        <section
          aria-label={mapLabel}
          hidden={unavailable}
          style={position(layout.mapBounds)}
          className="overflow-hidden"
        >
          {map}
        </section>
        {mapStatus !== "ready" && mapStatusContent && (
          <div
            style={{
              ...position(layout.mapBounds),
              display: unavailable ? "none" : undefined,
            }}
            hidden={unavailable}
            className="z-20 flex items-center justify-center overflow-auto bg-background/80 p-6 text-center backdrop-blur-sm"
            role={mapStatus === "error" ? "alert" : "status"}
          >
            {mapStatusContent}
          </div>
        )}
        {topBar && (
          <div
            ref={bar}
            hidden={unavailable}
            className="absolute z-30 overflow-auto"
            style={{
              left: barBounds.x,
              top: barBounds.y,
              width: barWidth,
              maxHeight: chromeHeight,
            }}
          >
            {topBar}
          </div>
        )}
        {controls && (
          <div
            ref={buttons}
            hidden={unavailable}
            className="absolute z-30 overflow-auto"
            style={{
              left: onRight ? available.x + gap : undefined,
              right: onRight
                ? undefined
                : measured.width - available.x - available.width + gap,
              top: controlsY,
              maxWidth: chromeWidth,
              maxHeight: Math.max(
                0,
                available.y + available.height - gap - controlsY,
              ),
            }}
          >
            {controls}
          </div>
        )}
        {panel && (
          <aside
            aria-label={panelLabel}
            hidden={unavailable || (measured.ready && !layout.panelBounds)}
            style={position(layout.panelBounds ?? zero)}
            className={cn(
              "z-40 overflow-hidden bg-background shadow-overlay",
              layout.presentation === "bottom"
                ? "rounded-t-container"
                : "rounded-container",
            )}
          >
            <div className="h-full min-h-0 overflow-y-auto overscroll-contain">
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
