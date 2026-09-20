import React from "react";
import {
  ArrowBigRight,
  ArrowBigLeft,
  ArrowBigUp,
  MapPin,
  type LucideIcon,
} from "lucide-react";
import { cn } from "../../utils";

export type DirectionType = "straight" | "left" | "right" | "destination";

/** The arrow for each direction, one table for every part that draws one. */
export const DIRECTION_ICONS: Record<DirectionType, LucideIcon> = {
  straight: ArrowBigUp,
  left: ArrowBigLeft,
  right: ArrowBigRight,
  destination: MapPin,
};

/**
 * A direction's arrow. Decorative: the instruction beside it says what it
 * says, so assistive technology never hears it.
 */
export function DirectionIcon({
  type,
  className,
}: {
  type: DirectionType;
  className?: string;
}) {
  const Icon = DIRECTION_ICONS[type];
  return <Icon aria-hidden="true" className={className} />;
}

interface DirectionStepProps extends React.HTMLAttributes<HTMLDivElement> {
  type: DirectionType;
  instruction: string;
  distance?: string;
  duration?: string;
}

const DirectionStep = React.forwardRef<HTMLDivElement, DirectionStepProps>(
  ({ className, type, instruction, distance, duration, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center p-3 bg-background border border-border rounded-container shadow-raised",
          className,
        )}
        {...props}
      >
        <div className="flex items-center justify-center w-10 h-10 mr-3 text-primary bg-primary/10 rounded-pill">
          <DirectionIcon type={type} className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <p className="font-medium text-foreground">{instruction}</p>
          {(distance || duration) && (
            <p className="text-sm text-muted-foreground">
              {distance} {duration && `• ${duration}`}
            </p>
          )}
        </div>
      </div>
    );
  },
);
DirectionStep.displayName = "DirectionStep";

export { DirectionStep };
