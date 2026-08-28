import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

export const counterVariants = cva(
  "inline-flex items-center justify-center rounded-pill font-semibold leading-none tabular-nums",
  {
    variants: {
      tone: {
        neutral: "bg-secondary text-secondary-foreground",
        brand: "bg-primary text-[var(--primitives-colors-foreground-1000)]",
        destructive:
          "bg-destructive text-[var(--primitives-colors-foreground-1000)]",
        inverse: "bg-background text-foreground",
      },
      size: {
        sm: "h-[18px] min-w-[18px] px-[5px] text-[11px]",
        default: "h-5 min-w-5 px-1.5 text-xs",
      },
    },
    defaultVariants: {
      tone: "neutral",
      size: "default",
    },
  },
);

export interface CounterProps
  extends
    React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof counterVariants> {}

export function formatCounterValue(value: React.ReactNode) {
  if (typeof value !== "string" && typeof value !== "number") {
    return value;
  }

  const text = String(value).trim();
  if (text.startsWith("(") && text.endsWith(")")) {
    return text.slice(1, -1).trim();
  }

  return text;
}

export const Counter = React.forwardRef<HTMLSpanElement, CounterProps>(
  ({ children, className, tone, size, ...props }, ref) => (
    <span
      ref={ref}
      className={cn(counterVariants({ tone, size, className }))}
      data-slot="counter"
      {...props}
    >
      {formatCounterValue(children)}
    </span>
  ),
);

Counter.displayName = "Counter";
