import React from 'react';
import { cn } from '../../utils';

const Backdrop = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & { visible?: boolean }
>(({ className, visible = true, ...props }, ref) => {
    if (!visible) return null;
    return (
        <div
            ref={ref}
            className={cn(
                'fixed inset-0 z-50 bg-background/80 backdrop-blur-sm',
                className
            )}
            {...props}
        />
    );
});
Backdrop.displayName = 'Backdrop';

export { Backdrop };
