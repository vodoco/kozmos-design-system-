import React, { useState } from "react";
import { Star01 as Star } from "@kozmos-ds/icons";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

interface RatingProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "onChange"
> {
  max?: number;
  value?: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    { className, max = 5, value = 0, onChange, readOnly = false, ...props },
    ref,
  ) => {
    const [hoverValue, setHoverValue] = useState<number | null>(null);
    const { trackEvent } = useKozmosAnalytics();

    const displayValue = hoverValue !== null ? hoverValue : value;

    return (
      <div
        ref={ref}
        role="radiogroup"
        aria-label="Rating"
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {Array.from({ length: max }).map((_, index) => {
          const ratingValue = index + 1;
          const isFilled = ratingValue <= displayValue;

          return (
            <button
              key={index}
              type="button"
              role="radio"
              aria-checked={ratingValue === displayValue}
              aria-label={`Rate ${ratingValue} out of ${max} stars`}
              className={cn(
                "focus:outline-none transition-colors duration-200",
                readOnly ? "cursor-default" : "cursor-pointer",
              )}
              onClick={() => {
                if (!readOnly) {
                  trackEvent("Rating", "rating_changed", {
                    value: ratingValue,
                    max,
                  });
                  onChange?.(ratingValue);
                }
              }}
              onMouseEnter={() => !readOnly && setHoverValue(ratingValue)}
              onMouseLeave={() => !readOnly && setHoverValue(null)}
              disabled={readOnly}
            >
              <Star
                className={cn(
                  "w-6 h-6",
                  isFilled
                    ? "fill-data-yellow text-data-yellow"
                    : "text-muted-foreground",
                )}
              />
            </button>
          );
        })}
      </div>
    );
  },
);
Rating.displayName = "Rating";

export { Rating };
