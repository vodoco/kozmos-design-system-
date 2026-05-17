import React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';
import { cn } from '../../utils';
import { FieldWrapper } from '../FieldWrapper';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface SliderProps extends React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root> {
    label?: string;
    error?: boolean | string;
    wrapperClassName?: string;
}

const Slider = React.forwardRef<
    React.ElementRef<typeof SliderPrimitive.Root>,
    SliderProps
>(({ className, label, error, wrapperClassName, ...props }, ref) => {
    const errorId = React.useId();
    const hasError = !!error;
    const isStringError = typeof error === 'string';
    const inputId = props.id || React.useId();
    const { trackEvent } = useKozmosAnalytics();

    return (
        <FieldWrapper error={error} errorId={errorId} label={label} inputId={inputId} className={wrapperClassName}>
            <SliderPrimitive.Root
                ref={ref}
                id={inputId}
                aria-invalid={hasError}
                aria-describedby={hasError && isStringError ? errorId : undefined}
                className={cn(
                    'relative flex w-full touch-none select-none items-center',
                    hasError && 'ring-1 ring-destructive rounded-full',
                    className
                )}
                {...props}
                onValueCommit={(value) => {
                    trackEvent('Slider', 'slider_value_changed', { value });
                    props.onValueCommit?.(value);
                }}
            >
                <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary">
                    <SliderPrimitive.Range className={cn("absolute h-full bg-primary", hasError && "bg-destructive")} />
                </SliderPrimitive.Track>
                <SliderPrimitive.Thumb className={cn("block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50", hasError && "border-destructive")} />
            </SliderPrimitive.Root>
        </FieldWrapper>
    );
});
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
