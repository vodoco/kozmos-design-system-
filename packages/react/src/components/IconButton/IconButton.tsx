import React from "react";
import { cn } from "../../utils";
import { Button, type ButtonProps } from "../Button/Button";

export type IconButtonProps = ButtonProps;

function iconButtonSizeClass(size: ButtonProps["size"]) {
  if (size === "sm") return "h-11 w-11 px-0";
  // The large size is the prototype's 48: Filters and the AI search beside a 44 field.
  if (size === "lg") return "h-12 w-12 px-0 [&>svg]:h-5 [&>svg]:w-5";
  return "h-11 w-11 px-0";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "icon", variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn(iconButtonSizeClass(size), className)}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton };
