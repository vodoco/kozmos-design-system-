import React, { forwardRef } from "react";
import { Search, X } from "lucide-react";
import { cva } from "class-variance-authority";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";

const searchBarVariants = cva(
  "flex items-center w-full rounded-2xl bg-background shadow-lg px-4 h-14 border border-input transition-all focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
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
          className="w-5 h-5 text-muted-foreground mr-3 shrink-0"
        />
        <input
          ref={ref}
          className={cn(
            "flex-1 bg-transparent border-none outline-none text-base placeholder:text-muted-foreground",
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
            <X aria-hidden="true" className="w-5 h-5 text-muted-foreground" />
          </button>
        )}
      </div>
    );
  },
);

SearchBar.displayName = "SearchBar";
