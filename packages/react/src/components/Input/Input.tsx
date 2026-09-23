import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn, mergeAriaIds } from "../../utils";
import { FieldWrapper } from "../FieldWrapper";

export type InputStatus = "default" | "error" | "warning" | "success";

export const inputVariants = cva("kozmos-reset kozmos-input", {
  variants: {
    status: {
      default: "",
      error: "kozmos-input-error",
      warning: "kozmos-input-warning",
      success: "kozmos-input-success",
    },
    error: {
      true: "kozmos-input-error",
    },
  },
});

export interface InputProps
  extends
    React.InputHTMLAttributes<HTMLInputElement>,
    Omit<VariantProps<typeof inputVariants>, "error" | "status"> {
  error?: boolean | string;
  helperText?: string;
  label?: string;
  status?: InputStatus;
  wrapperClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      type,
      error,
      helperText,
      label,
      status = "default",
      wrapperClassName,
      "aria-describedby": callerDescribedBy,
      "aria-invalid": callerInvalid,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();
    const helperId = React.useId();
    const hasError = !!error;
    const resolvedStatus: InputStatus = hasError ? "error" : status;
    const isInvalid = resolvedStatus === "error";
    const describedBy =
      hasError && typeof error === "string"
        ? errorId
        : helperText
          ? helperId
          : undefined;

    const defaultInputId = React.useId();
    const inputId = props.id || defaultInputId;

    return (
      <FieldWrapper
        error={error}
        errorId={errorId}
        helperId={helperId}
        helperText={helperText}
        label={label}
        inputId={inputId}
        status={resolvedStatus}
        className={wrapperClassName}
      >
        <input
          type={type}
          id={inputId}
          className={cn(inputVariants({ status: resolvedStatus }), className)}
          ref={ref}
          aria-invalid={isInvalid ? true : callerInvalid}
          aria-describedby={mergeAriaIds(callerDescribedBy, describedBy)}
          {...props}
        />
      </FieldWrapper>
    );
  },
);

Input.displayName = "Input";
