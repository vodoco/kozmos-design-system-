import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

const searchBarVariants = cva(
  "flex items-center w-full rounded-control bg-background shadow-floating px-3 h-11 border border-input transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        floating: "w-full", // Top-level structural coordinates are explicitly delegated natively to the `MapOverlay` container primitive
        inline: "relative",
      },
    },
    defaultVariants: {
      variant: "inline",
    },
  },
);

export interface SearchBarProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "value" | "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
  onClear?: () => void;
  containerClassName?: string;
  variant?: "floating" | "inline";
}

export const SearchBar = forwardRef<HTMLInputElement, SearchBarProps>(
  (
    {
      className,
      containerClassName,
      variant,
      value,
      onChange,
      onClear,
      placeholder = "Search...",
      type = "search",
      "aria-label": ariaLabel,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();

    return (
      <div
        className={cn(searchBarVariants({ variant }), containerClassName)}
        role="search"
      >
        <Search
          aria-hidden="true"
          className="h-[18px] w-[18px] text-muted-foreground mr-2 shrink-0"
        />
        <input
          ref={ref}
          className={cn(
            "min-w-0 flex-1 bg-transparent border-none outline-none text-[15px] placeholder:text-muted-foreground",
            className,
          )}
          aria-label={ariaLabel ?? placeholder}
          placeholder={placeholder}
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              trackEvent("SearchBar", "search_initiated", { query: value });
            }
            props.onKeyDown?.(e);
          }}
          {...props}
        />
        {value && value.length > 0 && (
          <button
            onClick={() => {
              trackEvent("SearchBar", "search_cleared");
              onChange?.("");
              onClear?.();
            }}
            className="ml-1 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-pill transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Clear search"
            type="button"
          >
            {/* A 24 grey circle to see; the 44 button around it to hit. */}
            <span
              aria-hidden="true"
              className="flex h-6 w-6 items-center justify-center rounded-pill bg-muted text-muted-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          </button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
