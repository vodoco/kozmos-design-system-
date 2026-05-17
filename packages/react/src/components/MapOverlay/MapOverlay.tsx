import React from 'react';

export interface MapOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
    /**
     * The structural GIS positioning matrix over the parent container.
     * @default 'top-left'
     */
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'top-center' | 'bottom-center';
}

export const MapOverlay = React.forwardRef<HTMLDivElement, MapOverlayProps>(
    ({ className, position = 'top-left', children, ...props }, ref) => {
        let positionClasses = "";
        
        switch (position) {
            case 'top-left':
                positionClasses = "top-4 left-4 right-4 md:right-auto md:w-96";
                break;
            case 'top-right':
                positionClasses = "top-4 left-4 right-4 md:left-auto md:w-96";
                break;
            case 'bottom-left':
                // pb-8 clears the native MapLibre logo
                positionClasses = "bottom-8 left-4 right-4 md:right-auto md:w-96 pb-8";
                break;
            case 'bottom-right':
                // pb-8 clears the native MapLibre attribution telemetry block
                positionClasses = "bottom-8 left-4 right-4 md:left-auto md:w-96 pb-8";
                break;
            case 'top-center':
                positionClasses = "top-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96";
                break;
            case 'bottom-center':
                positionClasses = "bottom-8 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-96 pb-8";
                break;
        }

        const containerClasses = [
            "absolute z-50 pointer-events-none flex flex-col gap-4",
            positionClasses,
            className
        ].filter(Boolean).join(" ");

        return (
            <div ref={ref} className={containerClasses} {...props}>
                {/* 
                    Map Pan/Zoom pointer-events pass cleanly through the outer container. 
                    The internal `pointer-events-auto` restores interactivity strictly over the DOM overlay nodes. 
                */}
                <div className="pointer-events-auto w-full max-h-[85vh] overflow-y-auto flex flex-col gap-4">
                    {children}
                </div>
            </div>
        );
    }
);

MapOverlay.displayName = 'MapOverlay';
