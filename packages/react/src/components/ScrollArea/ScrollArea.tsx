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
        className={cn("relative overflow-hidden w-full h-full", className)}
        {...props}
      >
        <div
          className={cn(
            "h-full w-full rounded-[inherit] outline-none",
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
