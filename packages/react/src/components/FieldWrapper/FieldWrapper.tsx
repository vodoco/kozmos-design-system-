import React from "react";
import { cn } from "../../utils";
import { Label } from "../Label";

export type FieldStatus = "default" | "error" | "warning" | "success";

export interface FieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  error?: boolean | string;
  errorId?: string;
  helperText?: string;
  helperId?: string;
  label?: string;
  inputId?: string;
  status?: FieldStatus;
  children: React.ReactNode;
}

export const FieldWrapper = React.forwardRef<HTMLDivElement, FieldWrapperProps>(
  (
    {
      className,
      error,
      errorId,
      helperText,
      helperId,
      label,
      inputId,
      status = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const isStringError = typeof error === "string";
    const message = isStringError ? error : helperText;
    const messageId = isStringError ? errorId : helperId;
    const messageStatus = isStringError ? "error" : status;

    return (
      <div
        ref={ref}
        className={cn("relative w-full flex flex-col gap-1.5", className)}
        {...props}
      >
        {label && (
          <Label
            htmlFor={inputId}
            className="text-sm font-semibold text-foreground"
          >
            {label}
          </Label>
        )}
        {children}
        {message && (
          <p
            id={messageId}
            className={cn(
              "text-sm",
              messageStatus === "error" && "text-destructive",
              messageStatus === "warning" && "text-warning",
              messageStatus === "success" && "text-success",
              messageStatus === "default" && "text-muted-foreground",
            )}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

FieldWrapper.displayName = "FieldWrapper";
