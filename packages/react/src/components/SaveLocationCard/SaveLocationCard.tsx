import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { Car, Navigation, MapPin, Edit3 } from 'lucide-react';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface SaveLocationCardProps extends React.HTMLAttributes<HTMLDivElement> {
    title?: string;
    description?: string;
    isSaved?: boolean;
    onSaveToggle?: () => void;
    onRouteToLocation?: () => void;
    onEditNote?: () => void;
}

const SaveLocationCard = React.forwardRef<HTMLDivElement, SaveLocationCardProps>(
    ({ className, title = "Mark My Car", description = "Remember where you parked", isSaved = false, onSaveToggle, onRouteToLocation, onEditNote, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();

        return (
            <div
                ref={ref}
                className={cn(
                    'bg-white/70 dark:bg-black/70 backdrop-blur-3xl ring-1 ring-black/5 dark:ring-white/10 shadow-2xl rounded-[length:var(--primitives-radius-2xl)] p-5 flex flex-col gap-4 transition-all duration-300',
                    className
                )}
                {...props}
            >
                {/* Header Information */}
                <div className="flex items-center gap-4">
                    <div className={cn("w-12 h-12 rounded-full flex items-center justify-center shrink-0 shadow-sm ring-1 ring-black/5 dark:ring-white/10", isSaved ? "bg-primary text-primary-foreground" : "bg-white dark:bg-black/50 text-foreground")}>
                        <Car className="w-6 h-6" />
                    </div>
                    <div className="flex flex-col flex-1">
                        <span className="font-semibold text-base text-foreground tracking-tight">{title}</span>
                        <span className="text-sm text-muted-foreground">{description}</span>
                    </div>
                    {isSaved && onEditNote && (
                        <Button variant="ghost" size="icon" onClick={onEditNote} className="shrink-0 text-muted-foreground">
                            <Edit3 className="w-4 h-4" />
                        </Button>
                    )}
                </div>

                {/* Primary Actions */}
                <div className="flex items-center gap-3 w-full mt-2">
                    <Button
                        variant={isSaved ? "outline" : "default"}
                        className="flex-1 font-medium"
                        onClick={() => {
                            trackEvent('SaveLocationCard', 'save_toggled', { isSaved: !isSaved });
                            onSaveToggle?.();
                        }}
                    >
                        <MapPin className="w-4 h-4 mr-2" />
                        {isSaved ? "Remove Location" : "Save Location"}
                    </Button>
                    
                    {isSaved && onRouteToLocation && (
                        <Button
                            variant="default"
                            className="flex-1 font-medium bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => {
                                trackEvent('SaveLocationCard', 'route_requested', {});
                                onRouteToLocation();
                            }}
                        >
                            <Navigation className="w-4 h-4 mr-2" />
                            Guide Me
                        </Button>
                    )}
                </div>
            </div>
        );
    }
);

SaveLocationCard.displayName = 'SaveLocationCard';

export { SaveLocationCard };
