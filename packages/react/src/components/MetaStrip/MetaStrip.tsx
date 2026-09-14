import * as React from "react";
import { cn } from "../../utils";

/**
 * A row of small facts about one thing, each a label and a value.
 *
 * Measured from the SDK's POI detail card (`HbFSXhCPxKUy2fWa5x9TKO`, node
 * `241:4772`, 2026-09-14): a 64-tall strip of bordered tiles carrying travel
 * time, distance, rating, price band, wheelchair access, crowd level and access
 * restriction. The scan found the strip on four surfaces and its tiles on more
 * — the rating tile alone on four, the accessibility glyph 1,213 times across
 * seven.
 *
 * It is a description list, because that is what it is: every tile pairs a
 * label with a value. A tile may hide its label visually — a price band reads
 * "$$$$" and a rating reads "4.5" — but the label is always in the accessible
 * name, so the strip does not become a row of unexplained glyphs to a screen
 * reader.
 *
 * Domain-neutral by design (§5.5): it knows nothing about POIs, only about
 * facts. What each tile means is the caller's business.
 */
const MetaStrip = React.forwardRef<
  HTMLDListElement,
  React.HTMLAttributes<HTMLDListElement>
>(({ className, children, ...props }, ref) => (
  <dl
    ref={ref}
    className={cn(
      // The source strip is wider than the card that holds it, so it scrolls
      // rather than wraps: a fact tile that has wrapped to a second row reads
      // as a different kind of thing.
      "m-0 flex h-16 items-stretch overflow-x-auto overscroll-x-contain border-y border-border bg-background p-0",
      "divide-x divide-border",
      className,
    )}
    data-slot="meta-strip"
    {...props}
  >
    {children}
  </dl>
));
MetaStrip.displayName = "MetaStrip";

export interface MetaStripItemProps extends React.HTMLAttributes<HTMLDivElement> {
  /** What the value is. Always read out, even when it is not drawn. */
  label: string;
  /** Draw the label under the value. Off for tiles that read on their own. */
  showLabel?: boolean;
  /** A glyph in front of the value. Decorative: the label carries the meaning. */
  icon?: React.ReactNode;
}

const MetaStripItem = React.forwardRef<HTMLDivElement, MetaStripItemProps>(
  ({ className, label, showLabel = false, icon, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        // `dt` must come before its `dd` for the pair to be read as a pair, and
        // the label is drawn under the value — so the DOM order is the accessible
        // one and `flex-col-reverse` does the drawing.
        "flex min-w-32 shrink-0 flex-col-reverse items-center justify-center gap-0.5 px-4",
        className,
      )}
      data-slot="meta-strip-item"
      {...props}
    >
      <dt
        className={cn("text-xs text-muted-foreground", !showLabel && "sr-only")}
      >
        {label}
      </dt>
      <dd className="m-0 flex items-center gap-1 text-base font-medium text-foreground">
        {icon ? (
          <span aria-hidden="true" className="flex shrink-0 items-center">
            {icon}
          </span>
        ) : null}
        {children}
      </dd>
    </div>
  ),
);
MetaStripItem.displayName = "MetaStripItem";

export { MetaStrip, MetaStripItem };
