import React from 'react';
import * as RadioGroupPrimitive from '@radix-ui/react-radio-group';
import { Circle } from 'lucide-react';
import { cn } from '../../utils';
import { FieldWrapper } from '../FieldWrapper';
import { Label } from '../Label';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface RadioGroupProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Root> {
    label?: string;
    error?: boolean | string;
    wrapperClassName?: string;
}

const RadioGroup = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Root>,
    RadioGroupProps
>(({ className, label, error, wrapperClassName, ...props }, ref) => {
    const errorId = React.useId();
    const hasError = !!error;
    const { trackEvent } = useKozmosAnalytics();

    return (
        <FieldWrapper label={label} error={error} errorId={errorId} className={wrapperClassName}>
            <RadioGroupPrimitive.Root
                className={cn('grid gap-2', className)}
                aria-invalid={hasError}
                aria-describedby={hasError && typeof error === 'string' ? errorId : undefined}
                {...props}
                onValueChange={(value) => {
                    trackEvent('RadioGroup', 'radio_selection_changed', { value });
                    props.onValueChange?.(value);
                }}
                ref={ref}
            />
        </FieldWrapper>
    );
});
RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export interface RadioGroupItemProps extends React.ComponentPropsWithoutRef<typeof RadioGroupPrimitive.Item> {
    label?: string;
}

const RadioGroupItem = React.forwardRef<
    React.ElementRef<typeof RadioGroupPrimitive.Item>,
    RadioGroupItemProps
>(({ className, label, id, ...props }, ref) => {
    const defaultId = React.useId();
    const inputId = id || defaultId;

    return (
        <div className="flex items-center space-x-2">
            <RadioGroupPrimitive.Item
                ref={ref}
                id={inputId}
                className={cn(
                    'aspect-square h-4 w-4 shrink-0 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                {...props}
            >
                <RadioGroupPrimitive.Indicator className="flex items-center justify-center">
                    <Circle className="h-2.5 w-2.5 fill-current text-current" />
                </RadioGroupPrimitive.Indicator>
            </RadioGroupPrimitive.Item>
            {label && (
                <Label htmlFor={inputId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50">
                    {label}
                </Label>
            )}
        </div>
    );
});
RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;

export { RadioGroup, RadioGroupItem };
