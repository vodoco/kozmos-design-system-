import { createThemePortal } from "../../theme/ThemePortal";
import * as React from "react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { cn } from "../../utils";

const PopoverPortal = createThemePortal(PopoverPrimitive.Portal);

const Popover = PopoverPrimitive.Root;

const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content> & {
    portalContainer?: React.ComponentPropsWithoutRef<
      typeof PopoverPrimitive.Portal
    >["container"];
  }
>(
  (
    { className, align = "center", sideOffset = 4, portalContainer, ...props },
    ref,
  ) => (
    <PopoverPortal container={portalContainer}>
      <PopoverPrimitive.Content
        ref={ref}
        align={align}
        sideOffset={sideOffset}
        className={cn("kozmos-reset kozmos-popover", className)}
        {...props}
      />
    </PopoverPortal>
  ),
);
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

/**
 * The pointer tying a popover to what opened it.
 *
 * Radix ships it and this surface used to hide it, so a popover hanging centred
 * below its anchor had nothing connecting the two. Opt-in rather than baked
 * into `PopoverContent` the way `Tooltip` bakes its own: a tooltip is always
 * about the thing it points at, while plenty of popovers are panels that read
 * better square.
 *
 * Defaults match `TooltipContent`'s arrow so the two agree on screen. Note it
 * inherits no border — `PopoverContent` is bordered and Radix's arrow is a
 * plain filled triangle, which is the same compromise `Tooltip` already makes.
 */
const PopoverArrow = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Arrow>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, width = 8, height = 4, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    width={width}
    height={height}
    className={cn("kozmos-reset kozmos-popover-arrow", className)}
    {...props}
  />
));
PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

export { Popover, PopoverTrigger, PopoverContent, PopoverArrow };
