import type { CategoryTint } from "../CategoryTile/CategoryTint";
import React from "react";
import { X } from "lucide-react";
import { cn } from "../../utils";

export interface CategoryFieldProps extends Omit<
  React.HTMLAttributes<HTMLDivElement>,
  "children"
> {
  /** The category's name. */
  label: string;
  /** How many places it holds; omitted, no pill. */
  count?: number;
  /**
   * The category's colour as a CSS colour, normally a token variable such
   * as `var(--semantics-data-yellow)`; the theme's colour by default.
   */
  tint?: CategoryTint;
  /** The category's icon, drawn at 28 in the colour; decorative, since the label names it. */
  icon?: React.ReactNode;
  clearLabel?: string;
  onClear?: () => void;
  countLabel?: (count: number) => string;
}

/**
 * The search field's form once a quick-access category is chosen — the
 * prototype's, measured: 48 tall, the control radius, the category's colour
 * at 12 % with a 1-pixel border of it, the icon at 28 in the colour, the name
 * at 15 semibold in the foreground, a 22-tall count pill filled with the
 * colour, a 32 clear at the trailing edge with its cross in the foreground.
 * It takes the field's place in the search row. The name and the cross are
 * in the foreground because the category colour on its own wash fails 4.5:1
 * for seven of the eight tints (Olcay, 2026-09-21).
 *
 * Mirrors `KozmosCategoryField` on iOS and Compose.
 */
const CategoryField = React.forwardRef<HTMLDivElement, CategoryFieldProps>(
  (
    {
      className,
      label,
      count,
      tint = {
        accent: "var(--primitives-colors-theme-500)",
        fill: "var(--components-primary-buttons-themed-button-background-idle)",
        onFill:
          "var(--components-primary-buttons-themed-button-foreground-content-idle)",
      },
      icon,
      clearLabel = "Clear category",
      onClear,
      countLabel = (n) => `${n} places`,
      style,
      ...props
    },
    ref,
  ) => (
    <div
      ref={ref}
      role="group"
      aria-label={
        count === undefined ? label : `${label}, ${countLabel(count)}`
      }
      className={cn(
        "kozmos-reset kozmos-category-field flex h-12 min-w-0 items-center gap-2 rounded-control border pl-3 pr-2 text-foreground",
        className,
      )}
      style={
        {
          "--kozmos-category-tint": tint.accent,
          borderColor: "var(--kozmos-category-tint)",
          background:
            "color-mix(in srgb, var(--kozmos-category-tint) 12%, transparent)",
          ...style,
        } as React.CSSProperties
      }
      {...props}
    >
      {icon && (
        <span
          aria-hidden="true"
          className="flex h-7 w-7 shrink-0 items-center justify-center [&>svg]:h-7 [&>svg]:w-7 [&>img]:h-7 [&>img]:w-7"
          style={{ color: "var(--kozmos-category-tint)" }}
        >
          {icon}
        </span>
      )}
      <span className="min-w-0 truncate text-[15px] font-semibold">
        {label}
      </span>
      {count !== undefined && (
        <span
          className="inline-flex h-[22px] min-w-[22px] shrink-0 items-center justify-center rounded-pill px-1.5 text-xs font-semibold"
          style={{ background: tint.fill, color: tint.onFill }}
          aria-label={countLabel(count)}
        >
          {count}
        </span>
      )}
      <span className="flex-1" />
      <button
        type="button"
        aria-label={clearLabel}
        onClick={onClear}
        className="kozmos-reset flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-pill bg-transparent p-0 text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <X aria-hidden="true" className="h-4 w-4" />
      </button>
    </div>
  ),
);
CategoryField.displayName = "CategoryField";
export { CategoryField };
