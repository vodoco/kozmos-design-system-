import React from 'react';
import { cn } from '../../utils';
import { Label } from '../Label';

export interface FieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
    error?: boolean | string;
    errorId?: string;
    label?: string;
    inputId?: string;
    children: React.ReactNode;
}

export const FieldWrapper = React.forwardRef<HTMLDivElement, FieldWrapperProps>(
    ({ className, error, errorId, label, inputId, children, ...props }, ref) => {
        const isStringError = typeof error === 'string';

        return (
            <div ref={ref} className={cn("relative w-full flex flex-col gap-1.5", className)} {...props}>
                {label && (
                    <Label htmlFor={inputId} className="text-sm font-semibold text-foreground">
                        {label}
                    </Label>
                )}
                {children}
                {isStringError && (
                    <p id={errorId} className="text-sm text-destructive">
                        {error}
                    </p>
                )}
            </div>
        );
    }
);

FieldWrapper.displayName = 'FieldWrapper';
