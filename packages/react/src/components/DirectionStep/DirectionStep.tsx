import React from 'react';
import { ArrowBigRight, ArrowBigLeft, ArrowBigUp, MapPin } from 'lucide-react';
import { cn } from '../../utils';

export type DirectionType = 'straight' | 'left' | 'right' | 'destination';

interface DirectionStepProps extends React.HTMLAttributes<HTMLDivElement> {
    type: DirectionType;
    instruction: string;
    distance?: string;
    duration?: string;
}

const DirectionStep = React.forwardRef<HTMLDivElement, DirectionStepProps>(
    ({ className, type, instruction, distance, duration, ...props }, ref) => {
        const getIcon = () => {
            switch (type) {
                case 'straight':
                    return <ArrowBigUp className="w-6 h-6" />;
                case 'left':
                    return <ArrowBigLeft className="w-6 h-6" />;
                case 'right':
                    return <ArrowBigRight className="w-6 h-6" />;
                case 'destination':
                    return <MapPin className="w-6 h-6" />;
            }
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'flex items-center p-3 bg-background border border-border rounded-[length:var(--primitives-radius-lg)] shadow-sm',
                    className
                )}
                {...props}
            >
                <div className="flex items-center justify-center w-10 h-10 mr-3 text-primary bg-primary/10 rounded-full">
                    {getIcon()}
                </div>
                <div className="flex-1">
                    <p className="font-medium text-foreground">{instruction}</p>
                    {(distance || duration) && (
                        <p className="text-sm text-muted-foreground">
                            {distance} {duration && `• ${duration}`}
                        </p>
                    )}
                </div>
            </div>
        );
    }
);
DirectionStep.displayName = 'DirectionStep';

export { DirectionStep };
