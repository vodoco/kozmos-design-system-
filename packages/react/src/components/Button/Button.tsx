import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

/**
 * The six emotions the product drives, and which `Components.{Primary,
 * Secondary,Tertiary} Buttons` have carried in the tokens since before this
 * prop existed. Measured 2026-09-14, the product uses all six across its
 * surfaces; until now only `danger` was reachable, spelled `destructive`.
 */
export const BUTTON_EMOTIONS = [
  "themed",
  "neutral",
  "success",
  "danger",
  "informative",
  "alert",
] as const;

export type ButtonEmotion = (typeof BUTTON_EMOTIONS)[number];

type ButtonVariant =
  | "default"
  | "destructive"
  | "outline"
  | "secondary"
  | "ghost"
  | "link"
  | "glass";

/**
 * `variant` says how much the button weighs and what shape it takes;
 * `emotion` says what it means. The token tiers already split the same way —
 * Primary is filled, Secondary is bordered, Tertiary is text — so a variant
 * maps to a tier and a treatment, and the emotion picks the colour within it.
 *
 * `glass` is an effect rather than a weight and takes no emotion.
 */
const VARIANT_TOKENS: Record<
  ButtonVariant,
  {
    tier: "primary" | "secondary";
    treatment: "filled" | "outline" | "text";
  } | null
> = {
  default: { tier: "primary", treatment: "filled" },
  secondary: { tier: "primary", treatment: "filled" },
  destructive: { tier: "primary", treatment: "filled" },
  outline: { tier: "secondary", treatment: "outline" },
  ghost: { tier: "secondary", treatment: "text" },
  link: { tier: "secondary", treatment: "text" },
  glass: null,
};

/**
 * One indirection, set as a custom property, rather than a class per
 * tier-and-emotion pair. Tailwind only ever sees these four literals, so the
 * JIT has nothing to miss, and `cn` is tailwind-merge, so these win over the
 * colour utilities the variant already carries.
 */
const TREATMENT_CLASSES = {
  filled:
    "bg-[var(--kz-button-bg)] text-[var(--kz-button-fg)] hover:bg-[var(--kz-button-bg-hover)]",
  outline:
    "border-[var(--kz-button-fg)] text-[var(--kz-button-fg)] hover:border-[var(--kz-button-fg-hover)] hover:text-[var(--kz-button-fg-hover)]",
  text: "text-[var(--kz-button-fg)] hover:text-[var(--kz-button-fg-hover)]",
} as const;

function emotionCustomProperties(
  tier: "primary" | "secondary",
  emotion: ButtonEmotion,
): React.CSSProperties {
  const prefix = `--components-${tier}-buttons-${emotion}`;
  return {
    "--kz-button-bg": `var(${prefix}-button-background-idle)`,
    "--kz-button-bg-hover": `var(${prefix}-button-background-hover)`,
    "--kz-button-fg": `var(${prefix}-button-foreground-content-idle)`,
    "--kz-button-fg-hover": `var(${prefix}-button-foreground-content-hover)`,
  } as React.CSSProperties;
}

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
  /**
   * What the button means. Leave it unset and the variant renders exactly as
   * it always has: `secondary` is `neutral` and `destructive` is `danger`
   * already, by the values in the tokens. Set it and the emotion decides the
   * colour, whatever the variant.
   *
   * `glass` takes no emotion.
   */
  emotion?: ButtonEmotion;
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
      emotion,
      style,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();

    const tokens = VARIANT_TOKENS[(variant ?? "default") as ButtonVariant];
    const emotional = emotion && tokens ? tokens : null;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      trackEvent("Button", "button_clicked", {
        variant: variant || "default",
        emotion: emotion || null,
        disabled,
      });
      onClick?.(e);
    };

    return (
      <button
        className={cn(
          buttonVariants({ variant, size }),
          emotional && TREATMENT_CLASSES[emotional.treatment],
          className,
        )}
        style={
          emotional
            ? {
                ...emotionCustomProperties(emotional.tier, emotion!),
                ...style,
              }
            : style
        }
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
