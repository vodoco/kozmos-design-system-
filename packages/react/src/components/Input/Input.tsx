import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import { FieldWrapper } from '../FieldWrapper';

export const inputVariants = cva(
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
  {
    variants: {
      error: {
        true: "border-destructive text-destructive focus-visible:ring-destructive placeholder:text-destructive/60",
      }
    }
  }
);

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement>,
  Omit<VariantProps<typeof inputVariants>, 'error'> {
    error?: boolean | string;
    label?: string;
    wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, wrapperClassName, ...props }, ref) => {
    const errorId = React.useId();
    const hasError = !!error;

    const defaultInputId = React.useId();
    const inputId = props.id || defaultInputId;

    return (
      <FieldWrapper error={error} errorId={errorId} label={label} inputId={inputId} className={wrapperClassName}>
        <input
          type={type}
          id={inputId}
          className={cn(
            inputVariants({ error: hasError }),
            className
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={hasError && typeof error === 'string' ? errorId : undefined}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

Input.displayName = 'Input';

