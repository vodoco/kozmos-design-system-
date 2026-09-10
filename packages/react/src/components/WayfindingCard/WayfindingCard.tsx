import React from "react";
import { cn } from "../../utils";
import { Card, CardContent, CardHeader, CardTitle } from "../Card/Card";
import { Button } from "../Button/Button";
import { X, MapPin, ArrowDownUp } from "lucide-react";
import { inputVariants } from "../Input/Input";
import { useKozmosAnalytics } from "../../utils/analytics";

export interface WayfindingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  onClose?: () => void;
  children: React.ReactNode;
}

const WayfindingCard = React.forwardRef<HTMLDivElement, WayfindingCardProps>(
  ({ className, title = "Navigation", onClose, children, ...props }, ref) => {
    const { trackEvent } = useKozmosAnalytics();

    const handleClose = () => {
      trackEvent("WayfindingCard", "wayfinding_card_closed");
      if (onClose) onClose();
    };

    return (
      <Card
        ref={ref}
        className={cn("w-full max-w-sm shadow-floating", className)}
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="h-8 w-8"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </CardHeader>
        <CardContent>
          <div className="space-y-4">{children}</div>
        </CardContent>
      </Card>
    );
  },
);
WayfindingCard.displayName = "WayfindingCard";

export interface WayfindingInputRowProps extends React.HTMLAttributes<HTMLDivElement> {
  originValue?: string;
  onOriginChange?: (val: string) => void;
  destinationValue?: string;
  onDestinationChange?: (val: string) => void;
  onSwap?: () => void;
  originPlaceholder?: string;
  destinationPlaceholder?: string;
}

export const WayfindingInputRow = React.forwardRef<
  HTMLDivElement,
  WayfindingInputRowProps
>(
  (
    {
      className,
      originValue,
      onOriginChange,
      destinationValue,
      onDestinationChange,
      onSwap,
      originPlaceholder = "Choose starting point...",
      destinationPlaceholder = "Choose destination...",
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();

    return (
      <div
        ref={ref}
        className={cn("relative flex gap-3", className)}
        {...props}
      >
        <div className="flex flex-col items-center justify-between py-3">
          <div className="w-2.5 h-2.5 rounded-pill border-2 border-primary" />
          <div className="w-[2px] h-full bg-border rounded-pill" />
          <MapPin className="w-4 h-4 text-primary" />
        </div>

        <div className="flex-1 flex flex-col gap-2 relative">
          <input
            value={originValue}
            onChange={(e) => onOriginChange?.(e.target.value)}
            placeholder={originPlaceholder}
            className={cn(
              inputVariants(),
              "h-10 border-none shadow-raised bg-muted/50 focus-visible:ring-1",
            )}
          />
          <input
            value={destinationValue}
            onChange={(e) => onDestinationChange?.(e.target.value)}
            placeholder={destinationPlaceholder}
            className={cn(
              inputVariants(),
              "h-10 border-none shadow-raised bg-muted/50 focus-visible:ring-1",
            )}
          />

          <Button
            size="icon"
            variant="secondary"
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-pill shadow-raised z-10"
            onClick={() => {
              trackEvent("WayfindingInputRow", "wayfinding_route_swapped", {
                origin: originValue,
                destination: destinationValue,
              });
              onSwap?.();
            }}
            type="button"
          >
            <ArrowDownUp className="w-4 h-4" />
          </Button>
        </div>
      </div>
    );
  },
);
WayfindingInputRow.displayName = "WayfindingInputRow";

export { WayfindingCard };
