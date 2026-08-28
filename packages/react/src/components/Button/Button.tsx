import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

export const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-control text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--components-primary-buttons-themed-button-background-idle)] text-[var(--components-primary-buttons-themed-button-foreground-content-idle)] hover:bg-[var(--components-primary-buttons-themed-button-background-hover)]",
        destructive:
          "bg-[var(--components-primary-buttons-danger-button-background-idle)] text-[var(--components-primary-buttons-danger-button-foreground-content-idle)] hover:bg-[var(--components-primary-buttons-danger-button-background-hover)]",
        outline:
          "border border-[var(--components-secondary-buttons-themed-button-foreground-content-idle)] bg-background text-[var(--components-secondary-buttons-themed-button-foreground-content-idle)] hover:border-[var(--components-secondary-buttons-themed-button-foreground-content-hover)] hover:text-[var(--components-secondary-buttons-themed-button-foreground-content-hover)]",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost:
          "text-[var(--components-secondary-buttons-themed-button-foreground-content-idle)] hover:bg-accent/10 hover:text-[var(--components-secondary-buttons-themed-button-foreground-content-hover)]",
        link: "text-[var(--components-secondary-buttons-themed-button-foreground-content-idle)] underline-offset-4 hover:text-[var(--components-secondary-buttons-themed-button-foreground-content-hover)] hover:underline",
        glass:
          "glass glass-spotlight glass-bevel text-foreground hover:bg-white/10 active:scale-[0.98]",
      },
      size: {
        default: "h-11 px-4 py-2",
        sm: "h-11 rounded-control px-3",
        lg: "h-11 rounded-control px-8",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      isLoading,
      children,
      onClick,
      disabled,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      trackEvent("Button", "button_clicked", {
        variant: variant || "default",
        disabled,
      });
      onClick?.(e);
    };

    return (
      <button
        className={cn(buttonVariants({ variant, size }), className)}
        ref={ref}
        disabled={isLoading || disabled}
        onClick={handleClick}
        {...props}
      >
        {isLoading && (
          <Loader2 aria-hidden="true" className="mr-2 h-4 w-4 animate-spin" />
        )}
        {children}
      </button>
    );
  },
);

Button.displayName = "Button";
