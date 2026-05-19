import React from "react";
import { cn } from "../../utils";
import { Button, type ButtonProps } from "../Button/Button";

export type IconButtonProps = ButtonProps;

function iconButtonSizeClass(size: ButtonProps["size"]) {
  if (size === "sm") return "h-11 w-11 px-0";
  if (size === "lg") return "h-11 w-11 px-0";
  return "h-11 w-11 px-0";
}

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, size = "icon", variant = "ghost", ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        variant={variant}
        className={cn("rounded-full", iconButtonSizeClass(size), className)}
        {...props}
      />
    );
  },
);
IconButton.displayName = "IconButton";

export { IconButton };
