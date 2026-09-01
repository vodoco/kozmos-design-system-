import React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "../../utils";
import { FieldWrapper } from "../FieldWrapper";
import { inputVariants, type InputStatus } from "../Input/Input";

export interface PasswordInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  defaultVisible?: boolean;
  error?: boolean | string;
  helperText?: string;
  hidePasswordLabel?: string;
  label?: string;
  onVisibleChange?: (visible: boolean) => void;
  showPasswordLabel?: string;
  showToggle?: boolean;
  status?: InputStatus;
  visible?: boolean;
  wrapperClassName?: string;
}

export const PasswordInput = React.forwardRef<
  HTMLInputElement,
  PasswordInputProps
>(
  (
    {
      className,
      defaultVisible = false,
      disabled,
      error,
      helperText,
      hidePasswordLabel = "Hide password",
      label,
      onVisibleChange,
      showPasswordLabel = "Show password",
      showToggle = true,
      status = "default",
      visible,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const [internalVisible, setInternalVisible] =
      React.useState(defaultVisible);
    const isVisible = visible ?? internalVisible;
    const errorId = React.useId();
    const helperId = React.useId();
    const defaultInputId = React.useId();
    const inputId = props.id || defaultInputId;
    const hasError = !!error;
    const resolvedStatus: InputStatus = hasError ? "error" : status;
    const isInvalid = resolvedStatus === "error";
    const describedBy =
      hasError && typeof error === "string"
        ? errorId
        : helperText
          ? helperId
          : undefined;

    const handleToggle = () => {
      const nextVisible = !isVisible;
      if (visible === undefined) {
        setInternalVisible(nextVisible);
      }
      onVisibleChange?.(nextVisible);
    };

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
        <div className="relative flex items-center">
          <input
            {...props}
            type={isVisible ? "text" : "password"}
            id={inputId}
            className={cn(
              inputVariants({ status: resolvedStatus }),
              showToggle && "pr-12",
              className,
            )}
            ref={ref}
            disabled={disabled}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
          />
          {showToggle && (
            <button
              type="button"
              aria-label={isVisible ? hidePasswordLabel : showPasswordLabel}
              aria-pressed={isVisible}
              className="absolute right-0 inline-flex h-11 w-11 items-center justify-center rounded-r-control text-muted-foreground ring-offset-background transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:text-muted-foreground"
              disabled={disabled}
              onClick={handleToggle}
            >
              {isVisible ? (
                <EyeOff className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Eye className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  },
);

PasswordInput.displayName = "PasswordInput";
