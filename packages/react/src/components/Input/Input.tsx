import React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../../utils";
import { FieldWrapper } from "../FieldWrapper";

export type InputStatus = "default" | "error" | "warning" | "success";

export const inputVariants = cva(
  "flex h-11 w-full rounded-control border border-[color:var(--primitives-colors-foreground-500)] bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-[color:var(--primitives-colors-foreground-400)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground disabled:opacity-100",
  {
    variants: {
      status: {
        default: "",
        error:
          "border-destructive text-destructive focus-visible:ring-destructive",
        warning: "border-warning text-warning focus-visible:ring-warning",
        success: "border-success text-success focus-visible:ring-success",
      },
      error: {
        true: "border-destructive text-destructive focus-visible:ring-destructive",
      },
    },
  },
);

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
          aria-invalid={isInvalid || undefined}
          aria-describedby={describedBy}
          {...props}
        />
      </FieldWrapper>
    );
  },
);

Input.displayName = "Input";
