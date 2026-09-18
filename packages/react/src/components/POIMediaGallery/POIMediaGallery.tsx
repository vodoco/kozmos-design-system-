import React from "react";
import type { POIMediaPresentation } from "@kozmos/product-contracts";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../../utils";
import { IconButton } from "../IconButton";
import { scrollHorizontalWithKeyboard } from "../../utils/keyboard-scroll";

export interface POIMediaGalleryProps extends Omit<
  React.HTMLAttributes<HTMLElement>,
  "onChange"
> {
  media: readonly POIMediaPresentation[];
  label: string;
  activeIndex?: number;
  defaultActiveIndex?: number;
  onActiveIndexChange?: (index: number) => void;
  previousLabel?: string;
  nextLabel?: string;
  unavailableLabel?: string;
  positionLabel: (current: number, total: number) => string;
}

function MediaImage({
  item,
  eager,
  unavailableLabel,
}: {
  item: POIMediaPresentation;
  eager: boolean;
  unavailableLabel: string;
}) {
  const [failed, setFailed] = React.useState(false);
  return failed ? (
    <div
      className="kozmos-poi-media-unavailable"
      role="img"
      aria-label={`${item.alt}: ${unavailableLabel}`}
    >
      {unavailableLabel}
    </div>
  ) : (
    <img
      alt={item.alt}
      className="aspect-[4/3] w-full rounded-container bg-muted object-cover"
      loading={eager ? "eager" : "lazy"}
      src={item.src}
      onError={() => setFailed(true)}
    />
  );
}

const POIMediaGallery = React.forwardRef<HTMLElement, POIMediaGalleryProps>(
  (
    {
      className,
      media,
      label,
      activeIndex,
      defaultActiveIndex = 0,
      onActiveIndexChange,
      previousLabel = "Previous image",
      nextLabel = "Next image",
      unavailableLabel = "Image unavailable",
      positionLabel,
      ...props
    },
    ref,
  ) => {
    const [internalIndex, setInternalIndex] =
      React.useState(defaultActiveIndex);
    const listRef = React.useRef<HTMLUListElement>(null);
    const controlled = activeIndex !== undefined;
    const currentIndex = Math.min(
      Math.max(controlled ? activeIndex : internalIndex, 0),
      Math.max(media.length - 1, 0),
    );
    const galleryId = React.useId();

    if (media.length === 0) return null;

    const selectIndex = (index: number) => {
      const nextIndex = Math.min(Math.max(index, 0), media.length - 1);
      if (!controlled) setInternalIndex(nextIndex);
      onActiveIndexChange?.(nextIndex);
      listRef.current?.children[nextIndex]?.scrollIntoView?.({
        behavior: "auto",
        block: "nearest",
        inline: "start",
      });
    };

    return (
      <section
        ref={ref}
        aria-label={label}
        className={cn("min-w-0", className)}
        {...props}
      >
        <div className="mb-2 flex items-center justify-between gap-3">
          <p aria-live="polite" className="text-xs text-muted-foreground">
            {positionLabel(currentIndex + 1, media.length)}
          </p>
          {media.length > 1 && (
            <div
              aria-label={`${label} controls`}
              className="flex gap-2"
              role="group"
            >
              <IconButton
                aria-controls={galleryId}
                aria-label={previousLabel}
                className="bg-background shadow-raised ring-1 ring-border"
                disabled={currentIndex === 0}
                onClick={() => selectIndex(currentIndex - 1)}
                type="button"
              >
                <ChevronLeft aria-hidden="true" className="h-5 w-5" />
              </IconButton>
              <IconButton
                aria-controls={galleryId}
                aria-label={nextLabel}
                className="bg-background shadow-raised ring-1 ring-border"
                disabled={currentIndex === media.length - 1}
                onClick={() => selectIndex(currentIndex + 1)}
                type="button"
              >
                <ChevronRight aria-hidden="true" className="h-5 w-5" />
              </IconButton>
            </div>
          )}
        </div>
        <ul
          tabIndex={0}
          onKeyDown={scrollHorizontalWithKeyboard}
          ref={listRef}
          className="m-0 grid snap-x snap-mandatory auto-cols-[85%] grid-flow-col gap-3 overflow-x-auto overscroll-x-contain p-0 pb-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
          id={galleryId}
        >
          {media.map((item, index) => (
            <li
              className="list-none snap-start"
              data-active={index === currentIndex || undefined}
              key={item.id}
            >
              <MediaImage
                key={item.src}
                item={item}
                eager={index === 0}
                unavailableLabel={unavailableLabel}
              />
            </li>
          ))}
        </ul>
      </section>
    );
  },
);

POIMediaGallery.displayName = "POIMediaGallery";

export { POIMediaGallery };
