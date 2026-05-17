import React from 'react';
import { cn } from '../../utils';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface BottomNavigationProps extends React.HTMLAttributes<HTMLElement> {
    items: {
        icon: React.ReactNode;
        label: string;
        onClick?: () => void;
        active?: boolean;
    }[];
}

const BottomNavigation = React.forwardRef<HTMLElement, BottomNavigationProps>(
    ({ className, items, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();
        return (
            <nav
                ref={ref}
                className={cn(
                    'fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t bg-background px-4 pb-safe',
                    className
                )}
                {...props}
            >
                {items.map((item, index) => (
                    <button
                        key={index}
                        onClick={() => {
                            trackEvent('BottomNavigation', 'bottom_nav_item_clicked', { label: item.label });
                            item.onClick?.();
                        }}
                        className={cn(
                            'flex flex-col items-center justify-center gap-1 text-xs font-medium text-muted-foreground transition-colors hover:text-primary',
                            item.active && 'text-primary'
                        )}
                    >
                        {item.icon}
                        <span>{item.label}</span>
                    </button>
                ))}
            </nav>
        );
    }
);
BottomNavigation.displayName = 'BottomNavigation';

export { BottomNavigation };
