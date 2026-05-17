import React from 'react';
import { cn } from '../../utils';
import { Button, type ButtonProps } from '../Button/Button';
import { Plus } from 'lucide-react';

export type FloatingActionButtonProps = ButtonProps;

const FloatingActionButton = React.forwardRef<HTMLButtonElement, FloatingActionButtonProps>(
    ({ className, size = 'icon', variant = 'default', children, ...props }, ref) => {
        return (
            <Button
                ref={ref}
                variant={variant}
                size={size}
                className={cn(
                    'rounded-full shadow-lg w-14 h-14 p-0 fixed bottom-6 right-6 z-50', // Fixed positioning default
                    className
                )}
                {...props}
            >
                {children || <Plus className="h-6 w-6" />}
            </Button>
        );
    }
);
FloatingActionButton.displayName = 'FloatingActionButton';

export { FloatingActionButton };
