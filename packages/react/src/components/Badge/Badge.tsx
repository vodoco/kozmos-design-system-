import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";

const badgeVariants = cva(
  "inline-flex items-center justify-center gap-1.5 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary text-[var(--primitives-colors-foreground-1000)] hover:bg-primary/90",
        destructive:
          "bg-destructive text-[var(--primitives-colors-foreground-1000)] hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent/10 hover:text-accent",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-11 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface BadgeProps
  extends
    React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  asChild?: boolean;
  counter?: React.ReactNode;
  icon?: React.ReactNode;
  showCounter?: boolean;
}

function formatBadgeCounter(counter: React.ReactNode) {
  if (typeof counter !== "string" && typeof counter !== "number") {
    return counter;
  }

  const value = String(counter).trim();
  if (value.startsWith("(") && value.endsWith(")")) {
    return value.slice(1, -1).trim();
  }

  return value;
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  (
    {
      asChild: _asChild,
      children,
      className,
      counter,
      icon,
      showCounter = false,
      size,
      variant,
      ...props
    },
    ref,
  ) => {
    const isIconOnly = size === "icon";
    const hasCounter =
      !isIconOnly &&
      showCounter &&
      counter !== undefined &&
      counter !== null &&
      counter !== false;

    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size, className }))}
        {...props}
      >
        {icon ? (
          <span
            aria-hidden="true"
            className="inline-flex h-4 w-4 shrink-0 items-center justify-center [&_svg]:h-4 [&_svg]:w-4"
            data-slot="badge-icon"
          >
            {icon}
          </span>
        ) : isIconOnly ? (
          children
        ) : null}
        {!isIconOnly ? children : null}
        {hasCounter ? (
          <span
            className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:color-mix(in_srgb,currentColor_14%,transparent)] px-1.5 text-xs font-semibold leading-none tabular-nums"
            data-slot="badge-counter"
          >
            {formatBadgeCounter(counter)}
          </span>
        ) : null}
      </div>
    );
  },
);

Badge.displayName = "Badge";
