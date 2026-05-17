import React from 'react';
import { cn } from '../../utils';
import { inputVariants } from '../Input/Input';
import { Calendar } from 'lucide-react';
import { FieldWrapper } from '../FieldWrapper';
import { useKozmosAnalytics } from '../../utils/analytics';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    error?: boolean | string;
    wrapperClassName?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
    ({ className, wrapperClassName, label, error, ...props }, ref) => {
        const errorId = React.useId();
        const inputId = props.id || React.useId();
        const hasError = !!error;
        const { trackEvent } = useKozmosAnalytics();

        return (
            <FieldWrapper error={error} errorId={errorId} label={label} inputId={inputId} className={wrapperClassName}>
                <div className="relative">
                    <input
                        type="date"
                        ref={ref}
                        id={inputId}
                        aria-invalid={hasError}
                        aria-describedby={hasError && typeof error === 'string' ? errorId : undefined}
                        className={cn(
                            inputVariants({ error: hasError }),
                            'w-full pl-10 block',
                            'appearance-none',
                            className
                        )}
                        {...props}
                        onChange={(e) => {
                            trackEvent('DatePicker', 'date_selected', { value: e.target.value });
                            props.onChange?.(e);
                        }}
                    />
                    <Calendar aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                </div>
            </FieldWrapper>
        );
    }
);
DatePicker.displayName = 'DatePicker';

export { DatePicker };
