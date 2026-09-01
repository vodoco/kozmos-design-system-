import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "../../utils";
import type { BoxProps } from "../Box/Box";

const textVariants = cva("text-foreground", {
  variants: {
    size: {
      xs: "text-xs",
      sm: "text-sm",
      base: "text-base",
      lg: "text-lg",
      xl: "text-xl",
      "2xl": "text-2xl",
      "3xl": "text-3xl",
      "4xl": "text-4xl",
    },
    weight: {
      normal: "font-normal",
      medium: "font-medium",
      semibold: "font-semibold",
      bold: "font-bold",
    },
    align: {
      left: "text-left",
      center: "text-center",
      right: "text-right",
      justify: "text-justify",
    },
    color: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      primary: "text-primary",
      destructive: "text-destructive",
      white: "text-white",
    },
    truncate: {
      true: "truncate",
    },
  },
  defaultVariants: {
    size: "base",
    weight: "normal",
    align: "left",
    color: "default",
  },
});

// Omit 'color' from BoxProps to avoid conflict with variant 'color'
export interface TextProps
  extends Omit<BoxProps, "color">, VariantProps<typeof textVariants> {
  as?: "span" | "p" | "div" | "label" | "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

const Text = React.forwardRef<HTMLElement, TextProps>(
  (
    {
      className,
      size,
      weight,
      align,
      color,
      truncate,
      as: Tag = "p",
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = (asChild ? Slot : Tag) as React.ElementType;
    return (
      <Comp
        {...props}
        className={cn(
          textVariants({ size, weight, align, color, truncate, className }),
        )}
        ref={ref as React.Ref<HTMLElement>}
      />
    );
  },
);

Text.displayName = "Text";
export { Text };
