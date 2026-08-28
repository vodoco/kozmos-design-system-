import React from "react";
import type { POIAction, POIPresentation } from "@kozmos/product-contracts";
import {
  Bookmark,
  Heart,
  MapPin,
  Navigation,
  Share2,
  ShoppingBag,
  X,
} from "lucide-react";
import { cn } from "../../utils";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { POIMediaGallery } from "../POIMediaGallery";

export interface POIActionState {
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  message?: string;
  messageTone?: "status" | "error";
}

export interface POIDetailPanelProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onAction"
> {
  poi: POIPresentation;
  actionLabels: Readonly<Record<POIAction, string>>;
  actionStates?: Partial<Record<POIAction, POIActionState>>;
  onAction: (action: POIAction, poiId: string) => void;
  onClose?: () => void;
  closeLabel?: string;
  mediaLabel?: string;
  mediaPositionLabel?: (current: number, total: number) => string;
  accessRestrictionsHeading?: string;
  servicesHeading?: string;
  presentation?: "inline" | "sheet" | "panel";
  titleLevel?: 2 | 3;
}

const actionIcons: Record<POIAction, React.ReactNode> = {
  navigate: <Navigation className="h-4 w-4" />,
  favourite: <Heart className="h-4 w-4" />,
  bookmark: <Bookmark className="h-4 w-4" />,
  share: <Share2 className="h-4 w-4" />,
  order: <ShoppingBag className="h-4 w-4" />,
};

const POIDetailPanel = React.forwardRef<HTMLElement, POIDetailPanelProps>(
  (
    {
      className,
      poi,
      actionLabels,
      actionStates = {},
      onAction,
      onClose,
      closeLabel = "Close details",
      mediaLabel = `${poi.name} photos`,
      mediaPositionLabel = (current, total) => `Image ${current} of ${total}`,
      accessRestrictionsHeading = "Access restrictions",
      servicesHeading = "Service options",
      presentation = "inline",
      titleLevel = 2,
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const Title = `h${titleLevel}` as "h2" | "h3";
    const locationLabel = [poi.floorLabel, poi.buildingLabel]
      .filter(Boolean)
      .join(" · ");

    return (
      <article
        ref={ref}
        aria-labelledby={titleId}
        className={cn(
          "flex min-w-0 flex-col bg-background text-foreground",
          presentation === "inline" &&
            "rounded-container border border-border shadow-lg",
          presentation === "sheet" && "rounded-t-container",
          presentation === "panel" &&
            "rounded-container border border-border shadow-xl",
          className,
        )}
        data-presentation={presentation}
        {...props}
      >
        <header className="flex items-start gap-3 border-b border-border p-4">
          {poi.logo ? (
            <img
              alt={poi.logo.alt}
              className="h-12 w-12 shrink-0 rounded-control border border-border object-contain"
              src={poi.logo.src}
            />
          ) : (
            <span
              aria-hidden="true"
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-control bg-muted text-base font-bold text-muted-foreground"
            >
              {poi.name.slice(0, 1).toUpperCase()}
            </span>
          )}

          <div className="min-w-0 flex-1">
            <Title
              className="truncate text-xl font-semibold tracking-tight"
              id={titleId}
            >
              {poi.name}
            </Title>
            <p className="mt-1 flex min-w-0 items-center gap-1 text-sm text-muted-foreground">
              <MapPin aria-hidden="true" className="h-4 w-4 shrink-0" />
              <span className="truncate">{locationLabel}</span>
            </p>
            {poi.availabilityLabel && (
              <p
                className={cn(
                  "mt-1 text-xs font-semibold",
                  poi.availability === "open"
                    ? "text-success"
                    : "text-muted-foreground",
                )}
              >
                <span className="sr-only">Availability: </span>
                {poi.availabilityLabel}
              </p>
            )}
          </div>

          {onClose && (
            <IconButton aria-label={closeLabel} onClick={onClose} type="button">
              <X aria-hidden="true" className="h-5 w-5" />
            </IconButton>
          )}
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
          {poi.description && (
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
              {poi.description}
            </p>
          )}

          {poi.actions.length > 0 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {poi.actions.map((action) => {
                const state = actionStates[action];
                return (
                  <Button
                    aria-pressed={
                      action === "favourite" || action === "bookmark"
                        ? state?.pressed
                        : undefined
                    }
                    className="gap-2"
                    disabled={state?.disabled}
                    isLoading={state?.loading}
                    key={action}
                    onClick={() => onAction(action, poi.id)}
                    type="button"
                    variant={action === "navigate" ? "default" : "outline"}
                  >
                    <span aria-hidden="true" className="flex items-center">
                      {actionIcons[action]}
                    </span>
                    {actionLabels[action]}
                  </Button>
                );
              })}
            </div>
          )}

          {poi.actions.map((action) => {
            const state = actionStates[action];
            if (!state?.message) return null;
            return (
              <p
                className={cn(
                  "mb-3 rounded-control bg-muted px-3 py-2 text-sm",
                  state.messageTone === "error" && "text-destructive",
                )}
                key={`${action}-message`}
                role={state.messageTone === "error" ? "alert" : "status"}
              >
                {state.message}
              </p>
            );
          })}

          {poi.accessRestrictions !== undefined &&
            poi.accessRestrictions !== "none" &&
            poi.accessRestrictionsLabel && (
              <section
                aria-label={accessRestrictionsHeading}
                className="mb-4 rounded-control border border-border bg-muted/40 px-3 py-2 text-sm"
              >
                {poi.accessRestrictionsLabel}
              </section>
            )}

          <POIMediaGallery
            className="mb-4"
            label={mediaLabel}
            media={poi.media}
            positionLabel={mediaPositionLabel}
          />

          {poi.services && poi.services.length > 0 && (
            <section aria-label={servicesHeading}>
              <h3 className="mb-2 text-sm font-semibold">{servicesHeading}</h3>
              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {poi.services.map((service) => (
                  <li
                    className="rounded-pill border border-border bg-background px-3 py-2 text-sm"
                    key={service.id}
                  >
                    {service.label}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </article>
    );
  },
);

POIDetailPanel.displayName = "POIDetailPanel";

export { POIDetailPanel };
