import React from "react";
import type {
  POIPresentation,
  POIResultPresentation,
} from "@kozmos/product-contracts";
import { Clock3, MapPin, Star } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

export function getPOIResultDomId(poiId: string) {
  return `poi-result-${encodeURIComponent(poiId)}`;
}

export interface POIResultCardProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onSelect"
> {
  poi: POIPresentation;
  result: POIResultPresentation;
  onSelect: (poiId: string) => void;
  featuredLabel?: string;
  selectionLabel?: string;
}

const POIResultCard = React.forwardRef<HTMLElement, POIResultCardProps>(
  (
    {
      className,
      poi,
      result,
      onSelect,
      featuredLabel = "Featured",
      selectionLabel,
      id = getPOIResultDomId(poi.id),
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();
    const available = result.available !== false;
    const unavailableId = `${id}-unavailable`;
    const locationLabel = [poi.floorLabel, poi.buildingLabel]
      .filter(Boolean)
      .join(" · ");

    const handleSelect = () => {
      if (!available) return;
      trackEvent("POIResultCard", "poi_result_selected", {
        poiId: poi.id,
        resultIndex: result.resultIndex,
        featured: result.featured,
      });
      onSelect(poi.id);
    };

    return (
      <article
        ref={ref}
        className={cn(
          "relative rounded-[var(--primitives-radius-lg)] border bg-card text-card-foreground shadow-sm transition-shadow",
          result.selected
            ? "border-primary ring-2 ring-primary/20"
            : "border-border",
          result.featured && "mt-3 border-warning",
          className,
        )}
        data-featured={result.featured || undefined}
        data-poi-id={poi.id}
        data-selected={result.selected || undefined}
        id={id}
        {...props}
      >
        {result.featured && (
          <span className="absolute bottom-full left-4 inline-flex h-6 items-center gap-1 rounded-t-md bg-warning px-2 text-xs font-semibold text-warning-foreground">
            <Star aria-hidden="true" className="h-3.5 w-3.5 fill-current" />
            {featuredLabel}
          </span>
        )}

        <button
          aria-describedby={!available ? unavailableId : undefined}
          aria-label={selectionLabel}
          aria-pressed={result.selected}
          className="grid min-h-24 w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-[inherit] p-4 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!available}
          onClick={handleSelect}
          type="button"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
            {result.resultIndex}
          </span>

          <span className="min-w-0">
            <span className="block truncate text-base font-semibold text-foreground">
              {poi.name}
            </span>
            {poi.categoryLabel && (
              <span className="mt-0.5 block truncate text-sm text-muted-foreground">
                {poi.categoryLabel}
              </span>
            )}
            <span className="mt-1 flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </span>
            {poi.availabilityLabel && (
              <span
                className={cn(
                  "mt-1 block text-xs font-semibold",
                  poi.availability === "open"
                    ? "text-success"
                    : "text-muted-foreground",
                )}
              >
                {poi.availabilityLabel}
              </span>
            )}
          </span>

          <span className="flex min-w-16 flex-col items-end gap-2">
            {poi.logo ? (
              <img
                alt={poi.logo.alt}
                className="h-10 w-10 rounded-md border border-border object-contain"
                src={poi.logo.src}
              />
            ) : (
              <span
                aria-hidden="true"
                className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-sm font-bold text-muted-foreground"
              >
                {poi.name.slice(0, 1).toUpperCase()}
              </span>
            )}
            {result.travelEstimate && (
              <span className="flex items-center gap-1 whitespace-nowrap text-xs font-medium text-foreground">
                <Clock3 aria-hidden="true" className="h-3.5 w-3.5" />
                {result.travelEstimate.durationLabel}
              </span>
            )}
          </span>
        </button>

        {!available && result.unavailableReason && (
          <p
            className="border-t border-border px-4 py-2 text-xs text-muted-foreground"
            id={unavailableId}
          >
            {result.unavailableReason}
          </p>
        )}
      </article>
    );
  },
);

POIResultCard.displayName = "POIResultCard";

export { POIResultCard };
