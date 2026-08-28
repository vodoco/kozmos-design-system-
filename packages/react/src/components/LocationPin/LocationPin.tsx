import React from "react";
import { MapPin, Star } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

export interface LocationPinProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "primary" | "secondary" | "accent";
  size?: "sm" | "md" | "lg";
  label?: string;
  number?: number;
  markerContent?: React.ReactNode;
  selected?: boolean;
  featured?: boolean;
  disabled?: boolean;
  offFloor?: boolean;
  externalLabel?: string;
  labelPlacement?: "top" | "right" | "bottom" | "left";
  resultId?: string;
}

const LocationPin = React.forwardRef<HTMLDivElement, LocationPinProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      label = "Location",
      number,
      markerContent,
      selected = false,
      featured = false,
      disabled = false,
      offFloor = false,
      externalLabel,
      labelPlacement = "bottom",
      resultId,
      onClick,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();

    const sizeClasses = {
      sm: "w-6 h-6",
      md: "w-8 h-8",
      lg: "w-10 h-10",
    };

    const variantClasses = {
      default: "text-foreground",
      primary: "text-primary fill-primary/20",
      secondary: "text-secondary fill-secondary/20",
      accent: "text-accent fill-accent/20",
    };

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      trackEvent("LocationPin", "location_pin_clicked", {
        variant,
        size,
        number,
        selected,
      });
      onClick?.(e);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
      if (
        onClick &&
        !disabled &&
        (event.key === "Enter" || event.key === " ")
      ) {
        event.preventDefault();
        event.currentTarget.click();
      }
      onKeyDown?.(event);
    };

    const isInteractive = Boolean(onClick);
    const visibleContent = markerContent ?? number;
    const externalLabelClasses = {
      top: "bottom-full left-1/2 mb-1 -translate-x-1/2",
      right: "left-full top-1/2 ml-1 -translate-y-1/2",
      bottom: "left-1/2 top-full mt-1 -translate-x-1/2",
      left: "right-full top-1/2 mr-1 -translate-y-1/2",
    };

    return (
      <div
        ref={ref}
        aria-controls={resultId}
        aria-current={selected ? "location" : undefined}
        aria-disabled={isInteractive && disabled ? true : undefined}
        aria-label={label}
        className={cn(
          "absolute flex min-h-11 min-w-11 -translate-x-1/2 -translate-y-full items-center justify-center transition-transform",
          isInteractive &&
            "cursor-pointer hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
          selected && "scale-110",
          offFloor && "opacity-50",
          disabled && "cursor-not-allowed opacity-50",
          className,
        )}
        data-featured={featured || undefined}
        data-off-floor={offFloor || undefined}
        data-selected={selected || undefined}
        onClick={isInteractive ? handleClick : undefined}
        onKeyDown={handleKeyDown}
        role={isInteractive ? "button" : "img"}
        tabIndex={isInteractive && !disabled ? 0 : undefined}
        {...props}
      >
        <span className="relative flex items-center justify-center">
          <MapPin
            aria-hidden="true"
            className={cn(sizeClasses[size], variantClasses[variant])}
          />
          {visibleContent !== undefined && visibleContent !== null && (
            <span
              aria-hidden="true"
              className="absolute inset-x-0 top-[18%] truncate px-1 text-center text-[10px] font-bold leading-none text-primary-foreground"
            >
              {visibleContent}
            </span>
          )}
          {featured && (
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-pill bg-background text-primary shadow-sm ring-1 ring-border">
              <Star aria-hidden="true" className="h-2.5 w-2.5 fill-current" />
            </span>
          )}
        </span>
        {externalLabel && (
          <span
            aria-hidden="true"
            className={cn(
              "absolute max-w-48 whitespace-nowrap rounded-control bg-background px-2 py-1 text-xs font-medium text-foreground shadow-md ring-1 ring-border",
              externalLabelClasses[labelPlacement],
            )}
          >
            {externalLabel}
          </span>
        )}
      </div>
    );
  },
);
LocationPin.displayName = "LocationPin";

export { LocationPin };
