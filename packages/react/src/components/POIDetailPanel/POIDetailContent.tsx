import React from "react";
import type { POIDetailsPresentation } from "@kozmos/product-contracts";
import { Accessibility, Clock, Leaf, Star } from "lucide-react";
import { Button } from "../Button";
import { MetaStrip, MetaStripItem } from "../MetaStrip";

const summaryIcons = {
  rating: Star,
  accessibility: Accessibility,
  dietary: Leaf,
  crowd: Clock,
  price: null,
};

export function POIDetailSummaryStrip({
  details,
}: {
  details: POIDetailsPresentation;
}) {
  if (!details.summary?.length) return null;
  return (
    <MetaStrip className="kozmos-poi-summary">
      {details.summary.map((item) => {
        const Icon = summaryIcons[item.kind];
        return (
          <MetaStripItem
            className="kozmos-poi-summary-item"
            key={item.id}
            label={item.label}
            icon={Icon ? <Icon size={20} /> : undefined}
          >
            <span className="kozmos-poi-summary-text">
              {item.value}
              {item.detail && <small>{item.detail}</small>}
            </span>
          </MetaStripItem>
        );
      })}
    </MetaStrip>
  );
}

export function POIDetailContent({
  details,
  titleLevel,
  readMoreLabel,
  readLessLabel,
  tagsLabel,
}: {
  details: POIDetailsPresentation;
  titleLevel: 2 | 3;
  readMoreLabel: string;
  readLessLabel: string;
  tagsLabel: string;
}) {
  const [expanded, setExpanded] = React.useState(false);
  const descriptionId = React.useId();
  const Heading = titleLevel === 2 ? "h3" : "h4";
  const description = details.description;
  const hasMore = Boolean(
    description?.full && description.full !== description.preview,
  );
  return (
    <div className="kozmos-poi-sections">
      {details.groups
        ?.filter((group) => group.items.length > 0)
        .map((group) => (
          <section aria-label={group.heading} key={group.id}>
            <Heading className="kozmos-poi-section-heading">
              {group.heading}
            </Heading>
            <ul className="kozmos-poi-chips">
              {group.items.map((item) => (
                <li className="kozmos-reset" key={item.id}>
                  {item.label}
                </li>
              ))}
            </ul>
          </section>
        ))}
      {details.openingHours && (
        <section aria-label={details.openingHours.label}>
          <Heading className="kozmos-poi-section-heading">
            {details.openingHours.label}
          </Heading>
          {details.openingHours.rows.length > 0 ? (
            <details className="kozmos-reset kozmos-poi-hours">
              <summary>{details.openingHours.summary}</summary>
              <dl className="kozmos-poi-hours-rows">
                {details.openingHours.rows.map((row) => (
                  <div key={row.id}>
                    <dt>{row.day}</dt>
                    <dd>{row.hours}</dd>
                  </div>
                ))}
              </dl>
              {details.openingHours.note && <p>{details.openingHours.note}</p>}
            </details>
          ) : (
            <p className="kozmos-poi-hours-note">
              {details.openingHours.summary}
              {details.openingHours.note && <> — {details.openingHours.note}</>}
            </p>
          )}
        </section>
      )}
      {description?.preview && (
        <div>
          <p className="kozmos-poi-description" id={descriptionId}>
            {expanded && hasMore ? description.full : description.preview}
          </p>
          {hasMore && (
            <Button
              variant="link"
              aria-controls={descriptionId}
              aria-expanded={expanded}
              onClick={() => setExpanded(!expanded)}
              type="button"
            >
              {expanded ? readLessLabel : readMoreLabel}
            </Button>
          )}
        </div>
      )}
      {Boolean(details.tags?.length) && (
        <ul className="kozmos-poi-chips" aria-label={tagsLabel}>
          {details.tags!.map((tag) => (
            <li className="kozmos-reset" key={tag.id}>
              {tag.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
