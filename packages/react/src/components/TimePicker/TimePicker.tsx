import React from "react";
import { Clock } from "lucide-react";
import { cn } from "../../utils";
import { useKozmosAnalytics } from "../../utils/analytics";
import { FieldWrapper } from "../FieldWrapper";
import { inputVariants, type InputStatus } from "../Input/Input";

export interface TimePickerProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  description?: React.ReactNode;
  error?: boolean | string;
  helperText?: string;
  label?: string;
  status?: InputStatus;
  wrapperClassName?: string;
}

function describedByIds({
  description,
  descriptionId,
  error,
  errorId,
  helperId,
  helperText,
}: {
  description?: React.ReactNode;
  descriptionId?: string;
  error?: boolean | string;
  errorId?: string;
  helperId?: string;
  helperText?: string;
}) {
  return [
    description ? descriptionId : null,
    error && typeof error === "string" ? errorId : helperText ? helperId : null,
  ]
    .filter(Boolean)
    .join(" ");
}

const TimePicker = React.forwardRef<HTMLInputElement, TimePickerProps>(
  (
    {
      className,
      description,
      disabled,
      error,
      helperText,
      id,
      label,
      onChange,
      required,
      status = "default",
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const { trackEvent } = useKozmosAnalytics();
    const defaultInputId = React.useId();
    const descriptionId = React.useId();
    const errorId = React.useId();
    const helperId = React.useId();
    const inputId = id || defaultInputId;
    const resolvedStatus: InputStatus = error ? "error" : status;
    const describedBy = describedByIds({
      description,
      descriptionId,
      error,
      errorId,
      helperId,
      helperText,
    });

    return (
      <FieldWrapper
        className={wrapperClassName}
        description={description}
        descriptionId={descriptionId}
        error={error}
        errorId={errorId}
        helperId={helperId}
        helperText={helperText}
        inputId={inputId}
        label={label}
        required={required}
        status={resolvedStatus}
      >
        <div className="relative">
          <Clock
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <input
            ref={ref}
            id={inputId}
            type="time"
            aria-describedby={describedBy || undefined}
            aria-invalid={resolvedStatus === "error" || undefined}
            className={cn(
              inputVariants({ status: resolvedStatus }),
              "block w-full appearance-none pl-9",
              className,
            )}
            disabled={disabled}
            required={required}
            onChange={(event) => {
              trackEvent("TimePicker", "time_selected", {
                value: event.target.value,
              });
              onChange?.(event);
            }}
            {...props}
          />
        </div>
      </FieldWrapper>
    );
  },
);
TimePicker.displayName = "TimePicker";

export { TimePicker };
