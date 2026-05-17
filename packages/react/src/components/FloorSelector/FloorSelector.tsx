import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { useKozmosAnalytics } from '../../utils/analytics';

interface FloorSelectorProps extends React.HTMLAttributes<HTMLDivElement> {
    floors: string[];
    selectedFloor: string;
    onFloorSelect: (floor: string) => void;
}

const FloorSelector = React.forwardRef<HTMLDivElement, FloorSelectorProps>(
    ({ className, floors, selectedFloor, onFloorSelect, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();

        const handleFloorSelect = (floor: string) => {
            trackEvent('FloorSelector', 'floor_selected', { floor });
            onFloorSelect(floor);
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'flex flex-col bg-background/80 backdrop-blur-sm border border-border rounded-[length:var(--primitives-radius-lg)] p-1 shadow-md w-12',
                    className
                )}
                {...props}
            >
                {floors.map((floor) => (
                    <Button
                        key={floor}
                        variant={selectedFloor === floor ? 'default' : 'ghost'}
                        size="sm"
                        className={cn(
                            'w-10 h-10 p-0 font-medium',
                            selectedFloor === floor && 'shadow-sm'
                        )}
                        onClick={() => handleFloorSelect(floor)}
                    >
                        {floor}
                    </Button>
                ))}
            </div>
        );
    }
);
FloorSelector.displayName = 'FloorSelector';

export { FloorSelector };
