import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, mergeAriaIds } from "../../utils";
import { FieldWrapper } from "../FieldWrapper";

const textareaVariants = cva("kozmos-reset kozmos-textarea");

export interface TextareaProps
  extends
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    VariantProps<typeof textareaVariants> {
  error?: boolean | string;
  label?: string;
  wrapperClassName?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  (
    {
      className,
      wrapperClassName,
      error,
      label,
      "aria-describedby": callerDescribedBy,
      "aria-invalid": callerInvalid,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();
    const hasError = !!error;
    const isStringError = typeof error === "string";

    const defaultInputId = React.useId();
    const inputId = props.id || defaultInputId;

    return (
      <FieldWrapper
        error={error}
        errorId={errorId}
        label={label}
        inputId={inputId}
        className={wrapperClassName}
      >
        <textarea
          id={inputId}
          className={cn(
            textareaVariants(),
            hasError && "kozmos-textarea-error",
            className,
          )}
          ref={ref}
          aria-invalid={hasError ? true : (callerInvalid ?? false)}
          aria-describedby={mergeAriaIds(
            callerDescribedBy,
            hasError && isStringError ? errorId : undefined,
          )}
          {...props}
        />
      </FieldWrapper>
    );
  },
);

Textarea.displayName = "Textarea";
