import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '../../utils';

export interface SpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
    ({ className, size = 'md', ...props }, ref) => {
        const sizeClasses = {
            sm: 'h-4 w-4',
            md: 'h-6 w-6',
            lg: 'h-8 w-8',
            xl: 'h-12 w-12',
        };

        return (
            <div
                ref={ref}
                className={cn('flex items-center justify-center', className)}
                role="status"
                {...props}
            >
                <Loader2 className={cn('animate-spin', sizeClasses[size])} />
                <span className="sr-only">Loading...</span>
            </div>
        );
    }
);
Spinner.displayName = 'Spinner';

export { Spinner };
