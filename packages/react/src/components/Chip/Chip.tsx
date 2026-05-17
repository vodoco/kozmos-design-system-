import * as React from "react"
import { cn } from "../../utils"

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

const Chip = React.forwardRef<HTMLButtonElement, ChipProps>(
  ({ className, active, icon, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
          active 
            ? "border-primary bg-primary text-primary-foreground shadow"
            : "border-input bg-background hover:bg-muted text-foreground",
          className
        )}
        {...props}
      >
        {icon && <span className="mr-2 h-4 w-4 shrink-0 flex items-center justify-center">{icon}</span>}
        {children}
      </button>
    )
  }
)
Chip.displayName = "Chip"

export type ChipGroupProps = React.HTMLAttributes<HTMLDivElement>;

const ChipGroup = React.forwardRef<HTMLDivElement, ChipGroupProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("flex flex-wrap gap-2", className)}
      {...props}
    />
  )
)
ChipGroup.displayName = "ChipGroup"

export { Chip, ChipGroup }
