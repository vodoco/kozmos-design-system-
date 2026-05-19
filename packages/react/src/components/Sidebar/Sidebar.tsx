import React from "react";
import { cn } from "../../utils";

export interface SidebarProps extends React.HTMLAttributes<HTMLElement> {
  collapsible?: boolean;
}

const Sidebar = React.forwardRef<HTMLElement, SidebarProps>(
  ({ className, collapsible, children, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        data-collapsible={collapsible ? "true" : undefined}
        className={cn(
          "flex h-full w-64 flex-col border-r bg-background px-4 py-6",
          collapsible && "transition-[width]",
          className,
        )}
        {...props}
      >
        {children}
      </aside>
    );
  },
);
Sidebar.displayName = "Sidebar";

export { Sidebar };
