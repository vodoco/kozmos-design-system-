import React from "react";
import type {
  AdaptiveMapLayoutSnapshot,
  MapCollisionInsets,
  MapLayoutRect,
  MapPanelPresentation,
  MapReadiness,
} from "@kozmos/product-contracts";
import { cn } from "../../utils";
import { surfaceClass, type SurfaceVariant } from "../Surface";
import {
  resolveAdaptiveMapLayout,
  resolveMapInsets,
} from "../../layout/adaptive-map-layout";
import {
  decidePanelDrag,
  nearestPanelDetent,
  orderPanelDetents,
  panelDetentDescription,
  panelDetentEquals,
  panelDetentHeight,
  PANEL_DRAG_SLOP,
  type PanelDetent,
  type PanelDragKind,
} from "./panel-detents";

/** Marks the row the sheet's smallest detent rests on: spread onto that element. */
export const panelPeekAnchorProps = { "data-kozmos-peek-anchor": "" } as const;

/** The detents a bottom sheet offers unless told otherwise; it rests at medium. */
export const DEFAULT_PANEL_DETENTS: readonly PanelDetent[] = [
  "collapsed",
  "medium",
  "large",
];

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
  /**
   * Where a bottom sheet may rest: collapsed (a fifth of the shell, or the
   * content's peek anchor), medium (54 %), large (94 %), fitted to its
   * content, a fraction or a height. Dragged anywhere on the sheet, it snaps
   * to the nearest of these; its content scrolls only at the largest. Unset,
   * the sheet offers collapsed, medium and large and rests at medium.
   */
  panelDetents?: readonly PanelDetent[];
  /** The detent the sheet rests at: controlled, with `onPanelDetentChange`. */
  panelDetent?: PanelDetent;
  /** The detent an uncontrolled sheet starts at. */
  defaultPanelDetent?: PanelDetent;
  onPanelDetentChange?: (detent: PanelDetent) => void;
  /** A single-detent shorthand: the sheet rests at this fraction (0.12–0.94) and offers no other. */
  panelFraction?: number;
  /**
   * A single-detent shorthand: fitted to its content — as tall as what it
   * holds, between collapsed and large — for a sheet that holds a summary and
   * a row of buttons and nothing to scroll.
   */
  panelSizing?: "fraction" | "content";
  /** What the panel sits on: solid by default, glass where the product asks for it. */
  panelSurface?: SurfaceVariant;
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
/**
 * The peek anchor's bottom edge from the sheet's top, by layout position:
 * the anchor's box against the sheet's, with the content's scroll added back
 * so a scrolled sheet reports the same edge as one at its top.
 */
function measurePeekBottom(content: HTMLElement | null): number {
  const anchor = content?.querySelector<HTMLElement>(
    "[data-kozmos-peek-anchor]",
  );
  const sheet = content?.parentElement;
  if (!content || !anchor || !sheet) return 0;
  const bottom =
    anchor.getBoundingClientRect().bottom -
    sheet.getBoundingClientRect().top +
    content.scrollTop;
  return Number.isFinite(bottom) && bottom > 0 ? bottom : 0;
}
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
      panelDetents,
      panelDetent,
      defaultPanelDetent,
      onPanelDetentChange,
      panelFraction,
      panelSizing = "fraction",
      panelSurface = "solid",
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
    const panelContent = React.useRef<HTMLDivElement>(null);
    const [measured, setMeasured] = React.useState({
      ready: false,
      width: 0,
      height: 0,
      direction: "ltr" as "ltr" | "rtl",
      barHeight: 0,
      controlsWidth: 0,
      controlsHeight: 0,
      panelContentHeight: 0,
      /** The peek anchor's bottom edge from the sheet's top; 0 when none. */
      peekBottom: 0,
      safe: { top: 0, right: 0, bottom: 0, left: 0 },
    });
    const [uncontrolledDetent, setUncontrolledDetent] = React.useState<
      PanelDetent | undefined
    >(defaultPanelDetent);
    /** The sheet's height while a finger holds it; null when settled. */
    const [dragHeight, setDragHeight] = React.useState<number | null>(null);
    const [scrolled, setScrolled] = React.useState(false);
    const drag = React.useRef<{
      pointerId: number;
      startX: number;
      startY: number;
      startHeight: number;
      startScrollTop: number;
      kind: PanelDragKind | null;
      samples: [number, number][];
    } | null>(null);
    const suppressClick = React.useRef(false);
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
          // What the panel holds, not what it was given: the scroll height.
          panelContentHeight: panelContent.current?.scrollHeight ?? 0,
          peekBottom: measurePeekBottom(panelContent.current),
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
      [element, bar.current, buttons.current, panelContent.current].forEach(
        (node) => {
          if (node) observer.observe(node);
        },
      );
      // The peek anchor moves when the sheet's content changes shape.
      const contentObserver = new MutationObserver(measure);
      if (panelContent.current)
        contentObserver.observe(panelContent.current, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ["data-kozmos-peek-anchor", "style", "class"],
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
        contentObserver.disconnect();
        directionObserver.disconnect();
        window.removeEventListener("resize", measure);
      };
    }, [Boolean(topBar), Boolean(controls), Boolean(panel)]);

    const safe = {
      top: mergeSafeInset(measured.safe.top, safeAreaInsets?.top),
      right: mergeSafeInset(measured.safe.right, safeAreaInsets?.right),
      bottom: mergeSafeInset(measured.safe.bottom, safeAreaInsets?.bottom),
      left: mergeSafeInset(measured.safe.left, safeAreaInsets?.left),
    };
    // The sheet's detents, in the height the sheet can use — the shell less
    // its safe areas, as the layout resolves it. The content detent and the
    // peek anchor are measured a render late, as the chrome is.
    const sheetHeight = Math.max(0, measured.height - safe.top - safe.bottom);
    const measures = {
      contentHeight: measured.panelContentHeight,
      peekBottom: measured.peekBottom,
    };
    const detents: readonly PanelDetent[] =
      panelDetents ??
      (panelSizing === "content"
        ? ["content"]
        : panelFraction !== undefined && Number.isFinite(panelFraction)
          ? [{ fraction: panelFraction }]
          : DEFAULT_PANEL_DETENTS);
    const ordered = orderPanelDetents(detents, sheetHeight, measures);
    const activeDetent: PanelDetent =
      panelDetent ??
      uncontrolledDetent ??
      (ordered.some((detent) => panelDetentEquals(detent, "medium"))
        ? "medium"
        : (ordered[Math.floor(ordered.length / 2)] ?? "medium"));
    const heightOf = (detent: PanelDetent) =>
      panelDetentHeight(detent, sheetHeight, measures);
    const smallest = ordered.length ? heightOf(ordered[0]!) : 0;
    const largest = ordered.length
      ? heightOf(ordered[ordered.length - 1]!)
      : sheetHeight;
    const clampToOffered = (height: number) =>
      Math.min(Math.max(height, smallest), largest);
    const settledHeight = clampToOffered(heightOf(activeDetent));
    const liveHeight =
      dragHeight === null ? settledHeight : clampToOffered(dragHeight);
    const atLargestDetent = settledHeight >= largest - 0.5;
    const activeIndex = Math.max(
      0,
      ordered.findIndex(
        (detent) => Math.round(heightOf(detent)) === Math.round(settledHeight),
      ),
    );
    const setDetent = (detent: PanelDetent) => {
      if (panelDetent === undefined) setUncontrolledDetent(detent);
      if (!panelDetentEquals(detent, activeDetent))
        onPanelDetentChange?.(detent);
    };
    const effectivePanelFraction =
      sheetHeight > 0 ? liveHeight / sheetHeight : undefined;
    const layout = resolveAdaptiveMapLayout({
      ...measured,
      hasPanel: Boolean(panel),
      panelPlacement,
      panelPresentation,
      panelFraction: effectivePanelFraction,
      // The sheet never covers the top bar; the controls yield to it instead
      // — their band above the sheet shrinks and they hide, as the iOS
      // shell's do — so the largest detent is reachable with controls shown,
      // as the prototype's full is.
      minimumMapHeight: topBar ? measured.barHeight + 32 : 0,
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

    const isSheet = layout.presentation === "bottom";
    // The content scrolls only at the largest detent, and never while the
    // sheet is being dragged: the change mid-drag cancels the content's own
    // pan, so one finger never scrolls the list and moves the sheet at once.
    const scrollEnabled = !isSheet || (atLargestDetent && dragHeight === null);
    const onContentScroll = (event: React.UIEvent<HTMLDivElement>) => {
      const isScrolled = event.currentTarget.scrollTop > 0;
      if (isScrolled !== scrolled) setScrolled(isScrolled);
    };
    const onSheetPointerDown = (event: React.PointerEvent<HTMLElement>) => {
      if (event.pointerType === "mouse" && event.button !== 0) return;
      suppressClick.current = false;
      // A finger in a field selects text; on the handle the same drag works.
      if ((event.target as Element).closest("input, textarea, select")) return;
      drag.current = {
        pointerId: event.pointerId,
        startX: event.clientX,
        startY: event.clientY,
        startHeight: settledHeight,
        startScrollTop: panelContent.current?.scrollTop ?? 0,
        kind: null,
        samples: [[event.timeStamp, event.clientY]],
      };
    };
    const onSheetPointerMove = (event: React.PointerEvent<HTMLElement>) => {
      const current = drag.current;
      if (!current || current.pointerId !== event.pointerId) return;
      const dx = event.clientX - current.startX;
      const dy = event.clientY - current.startY;
      if (current.kind === null) {
        if (Math.hypot(dx, dy) < PANEL_DRAG_SLOP) return;
        current.kind = decidePanelDrag({
          dx,
          dy,
          atLargestDetent,
          scrollTop: current.startScrollTop,
        });
        if (current.kind !== "sheet") return;
        try {
          event.currentTarget.setPointerCapture(event.pointerId);
        } catch {
          // A synthetic pointer has nothing to capture.
        }
      }
      if (current.kind !== "sheet") return;
      current.samples.push([event.timeStamp, event.clientY]);
      setDragHeight(current.startHeight - dy);
    };
    const onSheetPointerUp = (event: React.PointerEvent<HTMLElement>) => {
      const current = drag.current;
      if (!current || current.pointerId !== event.pointerId) return;
      drag.current = null;
      if (current.kind !== "sheet") return;
      suppressClick.current = true;
      const dy = event.clientY - current.startY;
      // The flick's velocity over its last 100 ms, projected 120 ms on, so a
      // fast short drag still lands on the detent it was aiming for.
      const recent = current.samples.filter(
        ([time]) => event.timeStamp - time <= 100,
      );
      const first = recent[0] ?? current.samples[current.samples.length - 1]!;
      const elapsed = event.timeStamp - first[0];
      const velocity = elapsed > 0 ? (event.clientY - first[1]) / elapsed : 0;
      const target = current.startHeight - dy - velocity * 120;
      setDragHeight(null);
      const nearest = nearestPanelDetent(
        ordered,
        target,
        sheetHeight,
        measures,
      );
      if (nearest) setDetent(nearest);
    };
    // A tap that ends a drag must not open what the finger stopped on.
    const onSheetClickCapture = (event: React.MouseEvent<HTMLElement>) => {
      if (!suppressClick.current) return;
      suppressClick.current = false;
      event.stopPropagation();
      event.preventDefault();
    };
    const stepDetent = (step: number) => {
      const next =
        ordered[Math.min(Math.max(activeIndex + step, 0), ordered.length - 1)];
      if (next) setDetent(next);
    };
    // Tapping the handle walks up the detents and wraps back to the shortest.
    const onHandleClick = () => {
      const next = ordered[(activeIndex + 1) % ordered.length];
      if (next) setDetent(next);
    };
    const onHandleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      const keys: Record<string, () => void> = {
        ArrowUp: () => stepDetent(1),
        ArrowDown: () => stepDetent(-1),
        Home: () => stepDetent(-ordered.length),
        End: () => stepDetent(ordered.length),
      };
      const action = keys[event.key];
      if (!action) return;
      event.preventDefault();
      action();
    };

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
              surfaceClass(panelSurface),
              "z-40 flex flex-col overflow-hidden shadow-overlay",
              layout.presentation === "bottom"
                ? "kozmos-map-sheet rounded-t-container"
                : "rounded-container",
            )}
            data-dragging={dragHeight !== null ? "" : undefined}
            data-detent={
              isSheet ? panelDetentDescription(activeDetent) : undefined
            }
            // The whole sheet drags, not only its handle: the prototype's
            // rule, with the content's scroll handed off by `decidePanelDrag`.
            onPointerDown={isSheet ? onSheetPointerDown : undefined}
            onPointerMove={isSheet ? onSheetPointerMove : undefined}
            onPointerUp={isSheet ? onSheetPointerUp : undefined}
            onPointerCancel={isSheet ? onSheetPointerUp : undefined}
            onClickCapture={isSheet ? onSheetClickCapture : undefined}
          >
            {isSheet && ordered.length > 1 && (
              <div
                className="kozmos-map-sheet-handle"
                role="slider"
                tabIndex={0}
                aria-label="Panel height"
                aria-orientation="vertical"
                aria-valuemin={0}
                aria-valuemax={ordered.length - 1}
                aria-valuenow={activeIndex}
                aria-valuetext={panelDetentDescription(activeDetent)}
                onClick={onHandleClick}
                onKeyDown={onHandleKeyDown}
              >
                <span aria-hidden="true" className="kozmos-map-sheet-grip" />
              </div>
            )}
            <div
              ref={panelContent}
              className="min-h-0 flex-1 overscroll-contain"
              // A finger scrolls the list natively at the largest detent;
              // at the list's top only downward panning (into the list) is
              // native, so a finger pulling the other way reaches the sheet
              // as pointer events. Below the largest detent every touch is
              // the sheet's.
              style={{
                overflowY: scrollEnabled ? "auto" : "hidden",
                touchAction: scrollEnabled
                  ? scrolled
                    ? "pan-y"
                    : "pan-down"
                  : "none",
              }}
              onScroll={onContentScroll}
            >
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
