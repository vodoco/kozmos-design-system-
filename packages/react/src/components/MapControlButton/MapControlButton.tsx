import React from "react";
import { cn } from "../../utils";
import { Button, type ButtonProps } from "../Button";

export interface MapControlButtonProps extends Omit<
  ButtonProps,
  "aria-label" | "children"
> {
  /** Decorative icon representing the map action. */
  icon: React.ReactNode;
  /** Localized action name used as the accessible name. */
  label: string;
  /** Optional localized state appended to the accessible name. */
  stateLabel?: string;
  presentation?: "icon-only" | "labelled";
  /**
   * How an active control reads.
   *
   * `tinted` keeps the map surface and colours the icon and the edge, which is
   * what the SDK draws — a control over a map has to stay legible against the
   * tiles behind it, and a solid fill hides the very thing it sits on.
   * `filled` is the inverted treatment this component shipped before
   * 2026-09-15; it is kept for callers that want the heavier emphasis.
   */
  emphasis?: "tinted" | "filled";
  /**
   * `inline` runs the label and its state along one line. `stacked` sets the
   * state under the label, which is how a map pill fits a two-word state into
   * a control that has to stay thumb-sized.
   */
  labelPlacement?: "inline" | "stacked";
  pressed?: boolean;
}

const MapControlButton = React.forwardRef<
  HTMLButtonElement,
  MapControlButtonProps
>(
  (
    {
      className,
      icon,
      label,
      stateLabel,
      presentation = "icon-only",
      emphasis = "tinted",
      labelPlacement = "inline",
      pressed,
      type = "button",
      variant,
      ...props
    },
    ref,
  ) => {
    const accessibleLabel = stateLabel ? `${label}, ${stateLabel}` : label;
    const isLabelled = presentation === "labelled";
    // A filled control inverts its surface, so it needs the Button's primary
    // tier. A tinted one keeps the map chrome and recolours only its icon and
    // ring, so it stays on the ghost tier in both states.
    const isFilled = emphasis === "filled" && pressed;
    const resolvedVariant = variant ?? (isFilled ? "default" : "ghost");

    return (
      <Button
        ref={ref}
        aria-label={accessibleLabel}
        aria-pressed={pressed}
        className={cn(
          // `bg-background/90` was here and painted nothing: `background` is a
          // plain `var(...)` in the Tailwind config, so an alpha modifier
          // cannot be computed and the class is dropped from the stylesheet
          // entirely. A ghost Button sets no surface of its own, so this
          // control was transparent over the map. The opaque role is what the
          // SDK draws for Focus anyway; the 31 other token-role alpha classes
          // in the library are recorded in the gap list, not fixed here.
          "min-h-11 min-w-11 justify-center rounded-control bg-background text-foreground shadow-floating ring-1 ring-border backdrop-blur-xl hover:bg-secondary",
          // The label reveals and collapses rather than snapping, because the
          // control announces a state change and then gets out of the way.
          "gap-0 transition-[max-width,padding] duration-300 ease-in-out motion-reduce:transition-none",
          isLabelled ? "max-w-64 px-3.5" : "px-0",
          pressed && "shadow-raised",
          pressed && !isFilled && "ring-primary",
          className,
        )}
        data-presentation={presentation}
        type={type}
        variant={resolvedVariant}
        {...props}
      >
        <span
          aria-hidden="true"
          className={cn(
            "flex shrink-0 items-center",
            pressed && !isFilled && "text-primary",
          )}
        >
          {icon}
        </span>
        {/*
          Always mounted, and clipped when icon-only, so max-width has something
          to animate between. The button's aria-label is the accessible name in
          both presentations, so clipped text is never what a screen reader
          reads.
        */}
        <span
          className={cn(
            "flex min-w-0 overflow-hidden text-left transition-[max-width,opacity,margin] duration-300 ease-in-out motion-reduce:transition-none",
            labelPlacement === "stacked"
              ? "flex-col items-start leading-tight"
              : "flex-row items-center gap-2",
            isLabelled ? "ml-2 max-w-56 opacity-100" : "max-w-0 opacity-0",
          )}
        >
          {labelPlacement === "stacked" ? (
            <>
              {/*
                The SDK sets these at 11px over 13px/600. The type scale has no
                role at either size yet — §5.11 rounds 11.008 and 13.008 and
                adds 12 and 15 — so this reaches for the nearest roles and the
                deviation is recorded in the gap list rather than hard-coded
                here.
              */}
              <span className="truncate text-xs text-muted-foreground">
                {label}
              </span>
              {stateLabel && (
                <span className="truncate text-sm font-semibold">
                  {stateLabel}
                </span>
              )}
            </>
          ) : (
            <>
              <span className="min-w-0 truncate">{label}</span>
              {stateLabel && (
                <span className="shrink-0 font-semibold">{stateLabel}</span>
              )}
            </>
          )}
        </span>
      </Button>
    );
  },
);

MapControlButton.displayName = "MapControlButton";

export { MapControlButton };
