import React from "react";
import type {
  POIAction,
  POIDetailsPresentation,
  POIPresentation,
  POISupplementaryAction,
} from "@kozmos/product-contracts";
import {
  Bookmark,
  CalendarCheck,
  Heart,
  Navigation,
  Phone,
  Share2,
  ShoppingBag,
  X,
} from "lucide-react";
import { cn } from "../../utils";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import { Heading } from "../Heading";
import { POIMediaGallery } from "../POIMediaGallery";
import { POIDetailContent, POIDetailSummaryStrip } from "./POIDetailContent";

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
  /** Additive details; basic POI consumers do not need category-specific fields. */
  details?: POIDetailsPresentation;
  actionLabels: Readonly<Record<POIAction, string>>;
  actionStates?: Partial<Record<POIAction, POIActionState>>;
  onAction: (action: POIAction, poiId: string) => void;
  /** Supplementary capabilities do not widen the required action label record. */
  onSupplementaryAction?: (
    action: POISupplementaryAction,
    poiId: string,
  ) => void;
  supplementaryActionStates?: Partial<
    Record<POISupplementaryAction, POIActionState>
  >;
  onClose?: () => void;
  closeLabel?: string;
  mediaLabel?: string;
  mediaPositionLabel?: (current: number, total: number) => string;
  mediaPreviousLabel?: string;
  mediaNextLabel?: string;
  mediaUnavailableLabel?: string;
  accessRestrictionsHeading?: string;
  servicesHeading?: string;
  readMoreLabel?: string;
  readLessLabel?: string;
  tagsLabel?: string;
  presentation?: "inline" | "sheet" | "panel";
  titleLevel?: 2 | 3;
}

const actionIcons = {
  navigate: Navigation,
  favourite: Heart,
  bookmark: Bookmark,
  share: Share2,
  order: ShoppingBag,
};
const supplementaryIcons = { book: CalendarCheck, call: Phone };
const isToggle = (action: POIAction) =>
  action === "favourite" || action === "bookmark";

function ActionMessage({ state }: { state?: POIActionState }) {
  if (!state?.message) return null;
  return (
    <p
      className="kozmos-poi-action-message"
      role={state.messageTone === "error" ? "alert" : "status"}
    >
      {state.message}
    </p>
  );
}

const POIDetailPanel = React.forwardRef<HTMLElement, POIDetailPanelProps>(
  (
    {
      className,
      poi,
      details,
      actionLabels,
      actionStates = {},
      onAction,
      onSupplementaryAction,
      supplementaryActionStates = {},
      onClose,
      closeLabel = "Close details",
      mediaLabel = `${poi.name} photos`,
      mediaPositionLabel = (current, total) => `Image ${current} of ${total}`,
      mediaPreviousLabel = "Previous image",
      mediaNextLabel = "Next image",
      mediaUnavailableLabel = "Image unavailable",
      accessRestrictionsHeading = "Access restrictions",
      servicesHeading = "Service options",
      readMoreLabel = "Read more",
      readLessLabel = "Read less",
      tagsLabel = "Tags",
      presentation = "inline",
      titleLevel = 2,
      ...props
    },
    ref,
  ) => {
    const titleId = React.useId();
    const locationLabel = [poi.floorLabel, poi.buildingLabel]
      .filter(Boolean)
      .join(" / ");
    const actions = poi.actions.filter((action) => !isToggle(action));
    const SectionHeading = titleLevel === 2 ? "h3" : "h4";
    const hasRestriction =
      poi.accessRestrictions !== undefined &&
      poi.accessRestrictions !== "none" &&
      Boolean(poi.accessRestrictionsLabel);
    const hasBody =
      hasRestriction ||
      poi.media.length > 0 ||
      Boolean(poi.services?.length) ||
      Boolean(
        details?.groups?.some((group) => group.items.length > 0) ||
        details?.openingHours ||
        details?.description?.preview ||
        details?.tags?.length,
      );
    return (
      <article
        ref={ref}
        aria-labelledby={titleId}
        className={cn("kozmos-reset kozmos-poi-detail", className)}
        data-presentation={presentation}
        {...props}
      >
        <header className="kozmos-poi-header">
          <div className="kozmos-poi-identity">
            {poi.logo && (
              <img
                alt={poi.logo.alt}
                className="kozmos-reset kozmos-poi-logo"
                src={poi.logo.src}
              />
            )}
            <Heading
              level={titleLevel}
              className="kozmos-poi-title"
              id={titleId}
            >
              {poi.name}
            </Heading>
          </div>
          <div className="kozmos-poi-header-actions">
            {poi.actions.filter(isToggle).map((action) => {
              const Icon = actionIcons[action];
              const state = actionStates[action];
              return (
                <IconButton
                  key={action}
                  variant="outline"
                  emotion="neutral"
                  aria-label={actionLabels[action]}
                  aria-pressed={state?.pressed ?? false}
                  disabled={state?.disabled}
                  isLoading={state?.loading}
                  onClick={() => onAction(action, poi.id)}
                  type="button"
                >
                  <Icon
                    aria-hidden="true"
                    size={18}
                    fill={state?.pressed ? "currentColor" : "none"}
                  />
                </IconButton>
              );
            })}
            {onClose && (
              <IconButton
                variant="outline"
                emotion="neutral"
                aria-label={closeLabel}
                onClick={onClose}
                type="button"
              >
                <X aria-hidden="true" size={18} />
              </IconButton>
            )}
          </div>
        </header>
        <div className="kozmos-poi-location">
          {locationLabel && <p>{locationLabel}</p>}
          {poi.availabilityLabel && (
            <p
              className="kozmos-poi-availability"
              data-availability={poi.availability ?? "unknown"}
            >
              {poi.availabilityLabel}
            </p>
          )}
        </div>
        {poi.description && (
          <p className="kozmos-poi-intro">{poi.description}</p>
        )}
        {(actions.length > 0 ||
          Boolean(details?.supplementaryActions?.length)) && (
          <div className="kozmos-poi-actions">
            {actions.map((action) => {
              const Icon = actionIcons[action];
              const state = actionStates[action];
              const estimate =
                action === "navigate" ? details?.travelEstimate : undefined;
              return (
                <Button
                  key={action}
                  className="kozmos-poi-action"
                  disabled={state?.disabled}
                  isLoading={state?.loading}
                  onClick={() => onAction(action, poi.id)}
                  type="button"
                  variant={action === "navigate" ? "default" : "outline"}
                  emotion={action === "navigate" ? "themed" : "neutral"}
                  aria-label={
                    estimate
                      ? [
                          actionLabels[action],
                          estimate.durationLabel,
                          estimate.distanceLabel,
                        ]
                          .filter(Boolean)
                          .join(" ")
                      : undefined
                  }
                >
                  <Icon aria-hidden="true" size={20} />
                  <span>
                    {actionLabels[action]}
                    {estimate && (
                      <small className="kozmos-poi-estimate">
                        {" "}
                        {[estimate.durationLabel, estimate.distanceLabel]
                          .filter(Boolean)
                          .join(" · ")}
                      </small>
                    )}
                  </span>
                </Button>
              );
            })}
            {details?.supplementaryActions?.map(({ action, label }) => {
              const Icon = supplementaryIcons[action];
              const state = supplementaryActionStates[action];
              return (
                <Button
                  key={action}
                  className="kozmos-poi-action"
                  variant="outline"
                  emotion="neutral"
                  type="button"
                  disabled={!onSupplementaryAction || state?.disabled}
                  isLoading={state?.loading}
                  onClick={() => onSupplementaryAction?.(action, poi.id)}
                >
                  <Icon aria-hidden="true" size={18} />
                  {label}
                </Button>
              );
            })}
          </div>
        )}
        {poi.actions.map((action) => (
          <ActionMessage key={action} state={actionStates[action]} />
        ))}
        {details?.supplementaryActions?.map(({ action }) => (
          <ActionMessage
            key={action}
            state={supplementaryActionStates[action]}
          />
        ))}
        {details && <POIDetailSummaryStrip details={details} />}
        {hasBody && (
          <div className="kozmos-poi-body">
            {poi.accessRestrictions !== undefined &&
              poi.accessRestrictions !== "none" &&
              poi.accessRestrictionsLabel && (
                <section
                  aria-label={accessRestrictionsHeading}
                  className="kozmos-reset kozmos-poi-restrictions"
                >
                  {poi.accessRestrictionsLabel}
                </section>
              )}
            <POIMediaGallery
              key={`media-${poi.id}`}
              label={mediaLabel}
              media={poi.media}
              positionLabel={mediaPositionLabel}
              previousLabel={mediaPreviousLabel}
              nextLabel={mediaNextLabel}
              unavailableLabel={mediaUnavailableLabel}
            />
            {Boolean(poi.services?.length) && (
              <section aria-label={servicesHeading}>
                <SectionHeading className="kozmos-poi-section-heading">
                  {servicesHeading}
                </SectionHeading>
                <ul className="kozmos-poi-chips">
                  {poi.services!.map((service) => (
                    <li className="kozmos-reset" key={service.id}>
                      {service.label}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {details && (
              <POIDetailContent
                key={poi.id}
                details={details}
                titleLevel={titleLevel}
                readMoreLabel={readMoreLabel}
                readLessLabel={readLessLabel}
                tagsLabel={tagsLabel}
              />
            )}
          </div>
        )}
      </article>
    );
  },
);

POIDetailPanel.displayName = "POIDetailPanel";
export { POIDetailPanel };
