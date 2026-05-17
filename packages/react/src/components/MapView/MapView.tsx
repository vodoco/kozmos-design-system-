import React from 'react';
import { cn } from '../../utils';

interface MapViewProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
}

const MapView = React.forwardRef<HTMLDivElement, MapViewProps>(
    ({ className, children, ...props }, ref) => (
        <div
            ref={ref}
            className={cn(
                'relative w-full h-full min-h-[400px] bg-muted overflow-hidden rounded-[length:var(--primitives-radius-lg)] border border-border',
                className
            )}
            {...props}
        >
            {/* Mock Map Grid */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />
            {children}
        </div>
    )
);
MapView.displayName = 'MapView';

export { MapView };
