import React from 'react';
import { MapPin } from 'lucide-react';
import { cn } from '../../utils';
import { useKozmosAnalytics } from '../../utils/analytics';

interface LocationPinProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'primary' | 'secondary' | 'accent';
    size?: 'sm' | 'md' | 'lg';
}

const LocationPin = React.forwardRef<HTMLDivElement, LocationPinProps>(
    ({ className, variant = 'primary', size = 'md', onClick, ...props }, ref) => {
        const { trackEvent } = useKozmosAnalytics();
        
        const sizeClasses = {
            sm: 'w-6 h-6',
            md: 'w-8 h-8',
            lg: 'w-10 h-10',
        };

        const variantClasses = {
            default: 'text-foreground',
            primary: 'text-primary fill-primary/20',
            secondary: 'text-secondary fill-secondary/20',
            accent: 'text-accent fill-accent/20',
        };

        const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
            trackEvent('LocationPin', 'location_pin_clicked', { variant, size });
            if (onClick) onClick(e);
        };

        return (
            <div
                ref={ref}
                onClick={handleClick}
                className={cn(
                    'absolute -translate-x-1/2 -translate-y-full hover:scale-110 transition-transform cursor-pointer',
                    className
                )}
                {...props}
            >
                <MapPin className={cn(sizeClasses[size], variantClasses[variant])} />
            </div>
        );
    }
);
LocationPin.displayName = 'LocationPin';

export { LocationPin };
