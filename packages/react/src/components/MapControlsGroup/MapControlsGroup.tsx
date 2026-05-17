import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { Plus, Minus, Compass, Focus } from 'lucide-react';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface MapControlsGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    onZoomIn?: () => void;
    onZoomOut?: () => void;
    onCompassReset?: () => void;
    onMyLocation?: () => void;
    compassBearing?: number;
}

const MapControlsGroup = React.forwardRef<HTMLDivElement, MapControlsGroupProps>(
    ({ className, onZoomIn, onZoomOut, onCompassReset, onMyLocation, compassBearing = 0, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();

        const handleZoomIn = () => {
             trackEvent('MapControls', 'zoom_in', {});
             onZoomIn?.();
        };

        const handleZoomOut = () => {
             trackEvent('MapControls', 'zoom_out', {});
             onZoomOut?.();
        };

        return (
            <div ref={ref} className={cn('flex flex-col gap-2 relative pointer-events-auto', className)} {...props}>
                {/* Zoom Cluster */}
                <div className="flex flex-col bg-white/70 dark:bg-black/70 backdrop-blur-2xl ring-1 ring-black/5 dark:ring-white/10 rounded-[length:var(--primitives-radius-lg)] shadow-2xl overflow-hidden w-11">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full h-11 rounded-none border-b border-border/50 hover:bg-secondary text-foreground"
                        onClick={handleZoomIn}
                        aria-label="Zoom In"
                    >
                        <Plus className="w-5 h-5" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-full h-11 rounded-none hover:bg-secondary text-foreground"
                        onClick={handleZoomOut}
                        aria-label="Zoom Out"
                    >
                        <Minus className="w-5 h-5" />
                    </Button>
                </div>

                {/* Compass */}
                {onCompassReset && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="w-11 h-11 rounded-[length:var(--primitives-radius-lg)] bg-white/70 dark:bg-black/70 backdrop-blur-2xl shadow-2xl ring-1 ring-black/5 dark:ring-white/10 hover:bg-white/90 dark:hover:bg-black/90 text-foreground transition-all duration-300"
                        onClick={() => {
                            trackEvent('MapControls', 'compass_reset', {});
                            onCompassReset();
                        }}
                        aria-label="Reset Bearing"
                    >
                        <Compass
                            className="w-5 h-5 transition-transform duration-300"
                            style={{ transform: `rotate(${compassBearing}deg)` }}
                        />
                    </Button>
                )}

                {/* My Location */}
                {onMyLocation && (
                    <Button
                        variant="default"
                        size="icon"
                        className="w-11 h-11 rounded-[length:var(--primitives-radius-lg)] shadow-md"
                        onClick={() => {
                            trackEvent('MapControls', 'my_location_triggered', {});
                            onMyLocation();
                        }}
                        aria-label="Locate me"
                    >
                        <Focus className="w-5 h-5" />
                    </Button>
                )}
            </div>
        );
    }
);

MapControlsGroup.displayName = 'MapControlsGroup';

export { MapControlsGroup };
