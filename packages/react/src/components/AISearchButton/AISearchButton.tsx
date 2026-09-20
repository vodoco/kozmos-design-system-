import React from "react";
import { Sparkles } from "lucide-react";
import { cn } from "../../utils";

export interface AISearchButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** What assistive technology hears; the button shows an icon alone. */
  label?: string;
}

/**
 * The AI search: a 48 disc inside a 66 ring whose gradient runs through the
 * theme's own ramp — the first gradient made of tokens — with a 16 icon.
 * The ring is drawn by `.kozmos-ai-search-ring` in the owned CSS, from
 * `--primitives-colors-theme-300` to `-600` and back.
 */
const AISearchButton = React.forwardRef<HTMLButtonElement, AISearchButtonProps>(
  ({ className, label = "AI search", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      className={cn(
        "kozmos-reset kozmos-ai-search relative inline-flex h-[66px] w-[66px] shrink-0 items-center justify-center rounded-pill bg-transparent p-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      <span
        aria-hidden="true"
        className="kozmos-ai-search-ring absolute inset-0 rounded-pill"
      />
      <span
        aria-hidden="true"
        className="absolute inset-[9px] rounded-pill bg-background shadow-raised"
      />
      <Sparkles aria-hidden="true" className="relative h-4 w-4 text-primary" />
    </button>
  ),
);
AISearchButton.displayName = "AISearchButton";

export { AISearchButton };
