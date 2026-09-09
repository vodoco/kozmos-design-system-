import React from "react";
import { cn } from "../../utils";
import { motion, AnimatePresence, type HTMLMotionProps } from "framer-motion";

export type DynamicIslandState = "compact" | "expanded" | "minimal";

export interface DynamicIslandProps extends Omit<
  HTMLMotionProps<"div">,
  "children"
> {
  islandState?: DynamicIslandState;
  compactLeading?: React.ReactNode;
  compactTrailing?: React.ReactNode;
  expandedContent?: React.ReactNode;
  minimalContent?: React.ReactNode;
}

const springConfig = {
  type: "spring",
  stiffness: 400,
  damping: 30,
};

const DynamicIsland = React.forwardRef<HTMLDivElement, DynamicIslandProps>(
  (
    {
      className,
      islandState = "compact",
      compactLeading,
      compactTrailing,
      expandedContent,
      minimalContent,
      ...props
    },
    ref,
  ) => {
    return (
      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100]" ref={ref}>
        <motion.div
          initial={false}
          animate={{
            width:
              islandState === "expanded"
                ? "calc(100vw - 32px)"
                : islandState === "minimal"
                  ? 56
                  : 240,
            maxWidth: 360,
            height:
              islandState === "expanded"
                ? 160
                : islandState === "minimal"
                  ? 56
                  : 44,
            borderRadius: islandState === "expanded" ? 32 : 100,
          }}
          transition={springConfig}
          className={cn(
            "bg-foreground text-background overflow-hidden shadow-overlay relative max-w-[calc(100vw-32px)]",
            className,
          )}
          {...props}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {islandState === "compact" && (
              <motion.div
                key="compact"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-between px-4"
              >
                <div className="flex items-center select-none">
                  {compactLeading}
                </div>
                <div className="flex items-center select-none">
                  {compactTrailing}
                </div>
              </motion.div>
            )}

            {islandState === "expanded" && (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="absolute inset-0 p-4"
              >
                {expandedContent}
              </motion.div>
            )}

            {islandState === "minimal" && (
              <motion.div
                key="minimal"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.2 }}
                className="absolute inset-0 flex items-center justify-center"
              >
                {minimalContent}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    );
  },
);

DynamicIsland.displayName = "DynamicIsland";

export { DynamicIsland };
