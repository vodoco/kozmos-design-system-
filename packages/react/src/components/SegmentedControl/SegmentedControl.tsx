import React from 'react';
import { cn } from '../../utils';
import * as ToggleGroupPrimitive from '@radix-ui/react-toggle-group';
import { FieldWrapper } from '../FieldWrapper';
import { useKozmosAnalytics } from '../../utils/analytics';

export type SegmentedControlProps = Omit<React.ComponentPropsWithoutRef<typeof ToggleGroupPrimitive.Root>, 'type' | 'value' | 'defaultValue' | 'onValueChange'> & {
    items: { value: string; label: string | React.ReactNode }[];
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    label?: string;
    error?: boolean | string;
    wrapperClassName?: string;
};

const SegmentedControl = React.forwardRef<React.ElementRef<typeof ToggleGroupPrimitive.Root>, SegmentedControlProps>(
    ({ className, items, value, defaultValue, onValueChange, label, error, wrapperClassName, ...props }, ref) => {
        const errorId = React.useId();
        const hasError = !!error;
        const isStringError = typeof error === 'string';
        const inputId = props.id || React.useId();
        const { trackEvent } = useKozmosAnalytics();

        return (
            <FieldWrapper error={error} errorId={errorId} label={label} inputId={inputId} className={wrapperClassName}>
                <ToggleGroupPrimitive.Root
                    ref={ref}
                    id={inputId}
                    type="single"
                    value={value}
                    defaultValue={defaultValue}
                    onValueChange={(val) => {
                        if (val) {
                            trackEvent('SegmentedControl', 'segmented_control_toggled', { value: val });
                        }
                        onValueChange?.(val);
                    }}
                    aria-invalid={hasError}
                    aria-describedby={hasError && isStringError ? errorId : undefined}
                    className={cn(
                        "inline-flex h-9 items-center justify-center rounded-[length:var(--primitives-radius-md)] bg-muted p-1 text-muted-foreground",
                        hasError && "ring-1 ring-destructive",
                        className
                    )}
                    {...props}
                >
                    {items.map((item) => (
                        <ToggleGroupPrimitive.Item
                            key={item.value}
                            value={item.value}
                            className={cn(
                                "inline-flex items-center justify-center whitespace-nowrap rounded-[length:calc(var(--primitives-radius-md)_-_4px)] px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-background data-[state=on]:text-foreground data-[state=on]:shadow",
                                hasError && "data-[state=on]:text-destructive"
                            )}
                        >
                            {item.label}
                        </ToggleGroupPrimitive.Item>
                    ))}
                </ToggleGroupPrimitive.Root>
            </FieldWrapper>
        );
    }
);
SegmentedControl.displayName = ToggleGroupPrimitive.Root.displayName;

export { SegmentedControl };
