import React from "react";
import { cn } from "../../utils";
import { Label } from "../Label";

export type FieldStatus = "default" | "error" | "warning" | "success";

export interface FieldWrapperProps extends React.HTMLAttributes<HTMLDivElement> {
  description?: React.ReactNode;
  descriptionId?: string;
  error?: boolean | string;
  errorId?: string;
  helperText?: string;
  helperId?: string;
  hideLabel?: boolean;
  label?: string;
  labelAction?: React.ReactNode;
  inputId?: string;
  /** Name a group of individually labelled controls, not one input. */
  group?: boolean;
  optionalText?: string;
  required?: boolean;
  status?: FieldStatus;
  children: React.ReactNode;
}

function fieldMessageClass(status: FieldStatus) {
  return cn(
    "kozmos-reset kozmos-field-message",
    status === "error" && "kozmos-field-error",
    status === "warning" && "kozmos-field-warning",
    status === "success" && "kozmos-field-success",
    status === "default" && "kozmos-field-default",
  );
}

export const FieldWrapper = React.forwardRef<HTMLDivElement, FieldWrapperProps>(
  (
    {
      className,
      description,
      descriptionId,
      error,
      errorId,
      helperText,
      helperId,
      hideLabel,
      label,
      labelAction,
      inputId,
      group = false,
      optionalText,
      required,
      status = "default",
      children,
      ...props
    },
    ref,
  ) => {
    const groupLabelId = React.useId();
    const LabelElement = group ? "span" : Label;
    const isStringError = typeof error === "string" && error.length > 0;
    const message = isStringError ? error : helperText;
    const messageId = isStringError ? errorId : helperId;
    const messageStatus = isStringError ? "error" : status;
    const showRequiredMark = required && !hideLabel;
    const showOptionalText = Boolean(
      !required && optionalText && label && !hideLabel,
    );

    return (
      <div
        ref={ref}
        className={cn("kozmos-reset kozmos-field", className)}
        data-status={messageStatus}
        role={group ? "group" : undefined}
        aria-labelledby={group && label ? groupLabelId : undefined}
        {...props}
      >
        {label && (
          <div className="kozmos-reset kozmos-field-heading">
            <LabelElement
              {...(group ? { id: groupLabelId } : { htmlFor: inputId })}
              className={cn(
                "kozmos-field-label",
                hideLabel && "kozmos-field-hidden",
              )}
            >
              {label}
              {showRequiredMark && (
                <span
                  aria-hidden="true"
                  className="kozmos-reset kozmos-field-required"
                  data-slot="required-mark"
                >
                  *
                </span>
              )}
            </LabelElement>
            {(showOptionalText || labelAction) && (
              <span className="kozmos-reset kozmos-field-optional">
                {labelAction || optionalText}
              </span>
            )}
          </div>
        )}
        {description && (
          <p
            id={descriptionId}
            className="kozmos-reset kozmos-field-message kozmos-field-default"
          >
            {description}
          </p>
        )}
        {children}
        {message && (
          <p
            id={messageId}
            className={fieldMessageClass(messageStatus)}
            role={messageStatus === "error" ? "alert" : undefined}
          >
            {message}
          </p>
        )}
      </div>
    );
  },
);

FieldWrapper.displayName = "FieldWrapper";

export type FormFieldProps = FieldWrapperProps;
export const FormField = FieldWrapper;
