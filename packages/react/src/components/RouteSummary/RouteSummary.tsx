import React from 'react';
import { cn } from '../../utils';
import { Button } from '../Button';
import { X, Navigation } from 'lucide-react';

export interface RouteSummaryProps extends React.HTMLAttributes<HTMLDivElement> {
    etaText: string;
    distanceText: string;
    onEndRoute: () => void;
    onStartNavigation?: () => void;
    transportModeIcon?: React.ReactNode;
    state?: 'preview' | 'active';
}

const RouteSummary = React.forwardRef<HTMLDivElement, RouteSummaryProps>(
    ({ className, etaText, distanceText, onEndRoute, onStartNavigation, transportModeIcon, state = 'active', ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(
                    'fixed bottom-4 left-4 right-4 tablet:left-auto tablet:right-4 tablet:w-96 bg-white/70 dark:bg-black/70 backdrop-blur-3xl ring-1 ring-black/5 dark:ring-white/10 shadow-2xl p-4 rounded-[length:var(--primitives-radius-2xl)] flex flex-col gap-4 z-50 transition-all duration-300',
                    className
                )}
                {...props}
            >
                {/* Information Row */}
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        {transportModeIcon && (
                            <div className="w-10 h-10 rounded-full bg-secondary text-primary flex items-center justify-center shrink-0">
                                {transportModeIcon}
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-xl font-bold tracking-tight text-foreground">{etaText}</span>
                            <span className="text-sm font-medium text-muted-foreground">{distanceText}</span>
                        </div>
                    </div>
                    {state === 'active' && (
                        <Button
                            variant="destructive"
                            size="icon"
                            className="rounded-full w-10 h-10 shrink-0"
                            onClick={onEndRoute}
                            aria-label="End route"
                        >
                            <X className="w-5 h-5" />
                        </Button>
                    )}
                </div>

                {/* Primary Action Row - if in preview mode */}
                {state === 'preview' && onStartNavigation && (
                    <Button 
                        size="lg" 
                        className="w-full h-12 rounded-full font-semibold text-base shadow-sm"
                        onClick={onStartNavigation}
                    >
                        <Navigation className="w-5 h-5 mr-2" />
                        Start Navigation
                    </Button>
                )}
            </div>
        );
    }
);

RouteSummary.displayName = 'RouteSummary';

export { RouteSummary };
