import React from "react";
import type { CategoryPresentation } from "@kozmos/product-contracts";
import { cn } from "../../utils";

export interface CategoryTileProps extends Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "onSelect"
> {
  category: CategoryPresentation;
  icon: React.ReactNode;
  onSelect: (categoryId: string) => void;
}

const CategoryTile = React.forwardRef<HTMLButtonElement, CategoryTileProps>(
  (
    {
      className,
      category,
      icon,
      onSelect,
      type = "button",
      disabled: disabledProp,
      ...props
    },
    ref,
  ) => {
    const disabled = category.disabled || disabledProp;

    return (
      <button
        ref={ref}
        aria-pressed={category.selected}
        className={cn(
          "kozmos-category-tile flex w-full flex-col items-center gap-1.5 rounded-control bg-transparent p-1 text-center text-[11px] font-normal leading-[14px] text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className,
        )}
        data-category-id={category.id}
        disabled={disabled}
        onClick={() => onSelect(category.id)}
        type={type}
        {...props}
      >
        {/* The icon's square: 64, radius Control, the container edge; the
            selection shows on it. The label sits under it, two lines at most. */}
        <span
          aria-hidden="true"
          className={cn(
            "flex h-16 w-16 shrink-0 items-center justify-center rounded-control border bg-background text-primary transition-colors [&>svg]:h-6 [&>svg]:w-6",
            category.selected
              ? "border-primary bg-primary/5 ring-1 ring-primary/20"
              : "border-border",
          )}
        >
          {icon}
        </span>
        <span className="line-clamp-2 max-w-full text-balance">
          {category.label}
        </span>
        {category.resultCountLabel && (
          <span className="text-xs font-normal text-muted-foreground">
            {category.resultCountLabel}
          </span>
        )}
      </button>
    );
  },
);

CategoryTile.displayName = "CategoryTile";

export { CategoryTile };
