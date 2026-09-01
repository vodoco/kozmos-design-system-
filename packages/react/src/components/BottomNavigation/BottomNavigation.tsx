import React from "react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";
import {
  NavigationItem,
  type NavigationItemProps,
} from "../NavigationItem/NavigationItem";

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
  items: {
    badge?: React.ReactNode;
    disabled?: boolean;
    href?: string;
    icon: React.ReactNode;
    label: string;
    onClick?: () => void;
    active?: boolean;
  }[];
  density?: NavigationItemProps["density"];
}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
  (
    {
      "aria-label": ariaLabel = "Bottom navigation",
      className,
      density = "compact",
      items,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();
    return (
      <nav
        ref={ref}
        aria-label={ariaLabel}
        data-slot="bottom-navigation"
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around gap-1 border-t bg-background px-2 pb-safe",
          className,
        )}
        {...props}
      >
        {items.map((item, index) => (
          <NavigationItem
            key={index}
            badge={item.badge}
            className="h-full w-auto flex-1"
            content={item.badge ? "badge" : "icon-label"}
            density={density}
            disabled={item.disabled}
            href={item.href}
            icon={item.icon}
            onClick={() => {
              trackEvent("BottomNavigation", "bottom_nav_item_clicked", {
                label: item.label,
              });
              item.onClick?.();
            }}
            placement="rail"
            selected={item.active}
          >
            {item.label}
          </NavigationItem>
        ))}
      </nav>
    );
  },
);
BottomNavigation.displayName = "BottomNavigation";

export { BottomNavigation };
