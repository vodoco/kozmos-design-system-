import React from 'react';
import { cn } from '../../utils';
import { Box, type BoxProps } from '../Box/Box';

export interface ContainerProps extends BoxProps {
    centered?: boolean;
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
    ({ className, centered = true, ...props }, ref) => {
        return (
            <Box
                ref={ref}
                className={cn(
                    'w-full px-4 sm:px-6 lg:px-8', // Basic responsive padding
                    centered && 'mx-auto max-w-7xl', // Centered with max width
                    className
                )}
                {...props}
            />
        );
    }
);

Container.displayName = 'Container';
export { Container };
