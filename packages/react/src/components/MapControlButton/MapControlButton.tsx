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
      pressed,
      type = "button",
      variant = pressed ? "default" : "ghost",
      ...props
    },
    ref,
  ) => {
    const accessibleLabel = stateLabel ? `${label}, ${stateLabel}` : label;

    return (
      <Button
        ref={ref}
        aria-label={accessibleLabel}
        aria-pressed={pressed}
        className={cn(
          "min-h-11 rounded-[var(--primitives-radius-lg)] bg-background/90 text-foreground shadow-md ring-1 ring-border backdrop-blur-xl hover:bg-secondary",
          presentation === "icon-only" ? "w-11 px-0" : "max-w-64 gap-2 px-3.5",
          pressed && "shadow-sm",
          className,
        )}
        data-presentation={presentation}
        type={type}
        variant={variant}
        {...props}
      >
        <span aria-hidden="true" className="flex shrink-0 items-center">
          {icon}
        </span>
        {presentation === "labelled" && (
          <span className="min-w-0 truncate">{label}</span>
        )}
        {presentation === "labelled" && stateLabel && (
          <span className="shrink-0 font-semibold">{stateLabel}</span>
        )}
      </Button>
    );
  },
);

MapControlButton.displayName = "MapControlButton";

export { MapControlButton };
