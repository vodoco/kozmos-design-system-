import * as React from "react"
import { cn } from "../../utils"
import { Text } from "../Text"

export interface EmptyStateProps extends React.HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}

const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, icon, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center h-full w-full",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 flex items-center justify-center text-muted-foreground w-16 h-16 rounded-full bg-muted">
          {icon}
        </div>
      )}
      <Text size="base" weight="medium" className="mb-1 text-foreground">
        {title}
      </Text>
      {description && (
        <Text size="sm" className="mb-4 text-muted-foreground max-w-[280px]">
          {description}
        </Text>
      )}
      {action && <div>{action}</div>}
    </div>
  )
)
EmptyState.displayName = "EmptyState"

export { EmptyState }
