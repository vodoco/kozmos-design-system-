import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils';
import { FieldWrapper } from '../FieldWrapper';

const textareaVariants = cva(
  'flex min-h-20 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50'
);

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  VariantProps<typeof textareaVariants> {
    error?: boolean | string;
    label?: string;
    wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, wrapperClassName, error, label, ...props }, ref) => {
    const errorId = React.useId();
    const hasError = !!error;
    const isStringError = typeof error === 'string';

    const defaultInputId = React.useId();
    const inputId = props.id || defaultInputId;

    return (
      <FieldWrapper error={error} errorId={errorId} label={label} inputId={inputId} className={wrapperClassName}>
        <textarea
          id={inputId}
          className={cn(
            textareaVariants(),
            hasError && "border-destructive text-destructive focus-visible:ring-destructive placeholder:text-destructive/60",
            className
          )}
          ref={ref}
          aria-invalid={hasError}
          aria-describedby={hasError && isStringError ? errorId : undefined}
          {...props}
        />
      </FieldWrapper>
    );
  }
);

Textarea.displayName = 'Textarea';
