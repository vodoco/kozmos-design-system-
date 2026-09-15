import * as React from "react";
import { cn } from "../../utils";

export interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "vertical" | "horizontal" | "both";
  hideScrollbar?: boolean;
  snap?: "none" | "x" | "y" | "both";
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  (
    {
      className,
      children,
      orientation = "vertical",
      hideScrollbar = true,
      snap = "none",
      ...props
    },
    ref,
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full overflow-hidden",
          // A vertical scroller needs a bounded height or it has nothing to
          // scroll. A horizontal one does not, and assuming `h-full` for both
          // meant that inside an auto-height column — a `Stack`, say — the
          // height resolved to 0 and the content vanished. Found while
          // rebuilding the SDK's POI detail card, whose action row scrolls
          // sideways and disappeared entirely.
          orientation !== "horizontal" && "h-full",
          className,
        )}
        {...props}
      >
        <div
          className={cn(
            "w-full rounded-[inherit] outline-none",
            orientation !== "horizontal" && "h-full",
            orientation === "vertical" && "overflow-y-auto overflow-x-hidden",
            orientation === "horizontal" &&
              "overflow-x-auto overflow-y-hidden text-nowrap",
            orientation === "both" && "overflow-auto",
            hideScrollbar &&
              "[&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
            snap === "x" && "snap-x snap-mandatory",
            snap === "y" && "snap-y snap-mandatory",
            snap === "both" && "snap-both snap-mandatory",
          )}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {children}
        </div>
      </div>
    );
  },
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
