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
          "flex min-h-28 w-full flex-col items-center justify-center gap-2 rounded-container border bg-background p-3 text-center text-sm font-medium text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          category.selected
            ? "border-primary bg-primary/5 ring-1 ring-primary/20"
            : "border-border hover:bg-muted/60",
          className,
        )}
        data-category-id={category.id}
        disabled={disabled}
        onClick={() => onSelect(category.id)}
        type={type}
        {...props}
      >
        <span
          aria-hidden="true"
          className="flex h-10 w-10 items-center justify-center text-primary"
        >
          {icon}
        </span>
        <span className="max-w-full text-balance leading-tight">
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
