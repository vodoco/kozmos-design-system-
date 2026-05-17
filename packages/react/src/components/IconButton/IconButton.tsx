import React from 'react';
import { cn } from '../../utils';
import { Button, type ButtonProps } from '../Button/Button';

export type IconButtonProps = ButtonProps;

const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
    ({ className, size = 'icon', variant = 'ghost', ...props }, ref) => {
        return (
            <Button
                ref={ref}
                size={size}
                variant={variant}
                className={cn("rounded-full", className)}
                {...props}
            />
        );
    }
);
IconButton.displayName = 'IconButton';

export { IconButton };
