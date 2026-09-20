import React from "react";
import type {
  POIPresentation,
  POIResultPresentation,
} from "@kozmos/product-contracts";
import { cn } from "../../utils";
import { POIResultCard } from "../POIResultCard";

export interface POIResultListItem {
  poi: POIPresentation;
  result: POIResultPresentation;
}

export interface POIResultListProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onSelect"
> {
  items: readonly POIResultListItem[];
  onSelect: (poiId: string) => void;
  selectedPoiId?: string;
  label?: string;
  resultCountLabel: string;
  emptyState?: React.ReactNode;
  featuredLabel?: string;
  /** The floor the map shows: a result on it carries a dot before its floor. */
  currentFloorId?: string;
}

const POIResultList = React.forwardRef<HTMLElement, POIResultListProps>(
  (
    {
      className,
      items,
      onSelect,
      selectedPoiId,
      label = "Points of interest",
      resultCountLabel,
      emptyState,
      featuredLabel,
      currentFloorId,
      ...props
    },
    ref,
  ) => {
    return (
      <section
        ref={ref}
        aria-label={label}
        className={cn("min-w-0", className)}
        {...props}
      >
        <p aria-live="polite" className="sr-only">
          {resultCountLabel}
        </p>
        {items.length === 0 ? (
          <div className="rounded-container border border-dashed border-border bg-muted/40 p-6 text-center text-sm text-muted-foreground">
            {emptyState}
          </div>
        ) : (
          <ul className="m-0 flex list-none flex-col gap-3 p-0">
            {items.map(({ poi, result }) => (
              <li key={poi.id}>
                <POIResultCard
                  currentFloorId={currentFloorId}
                  featuredLabel={featuredLabel}
                  onSelect={onSelect}
                  poi={poi}
                  result={{
                    ...result,
                    selected:
                      selectedPoiId === undefined
                        ? result.selected
                        : selectedPoiId === poi.id,
                  }}
                />
              </li>
            ))}
          </ul>
        )}
      </section>
    );
  },
);

POIResultList.displayName = "POIResultList";

export { POIResultList };
