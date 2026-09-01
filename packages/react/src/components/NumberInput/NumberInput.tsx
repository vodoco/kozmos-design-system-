import React from "react";
import { Minus, Plus } from "lucide-react";
import { cn } from "../../utils";
import { FieldWrapper } from "../FieldWrapper";
import { inputVariants, type InputStatus } from "../Input/Input";

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  error?: boolean | string;
  helperText?: string;
  label?: string;
  onValueChange?: (value: number | null) => void;
  showSteppers?: boolean;
  status?: InputStatus;
  wrapperClassName?: string;
}

function numericValueFromInput(input: HTMLInputElement) {
  if (input.value === "") return null;
  return Number.isNaN(input.valueAsNumber) ? null : input.valueAsNumber;
}

function stepValue(
  input: HTMLInputElement,
  direction: "decrement" | "increment",
) {
  if (direction === "increment") {
    input.stepUp();
  } else {
    input.stepDown();
  }

  return numericValueFromInput(input);
}

export const NumberInput = React.forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      className,
      disabled,
      error,
      helperText,
      label,
      onChange,
      onValueChange,
      readOnly,
      showSteppers = true,
      status = "default",
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const internalRef = React.useRef<HTMLInputElement | null>(null);
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
    const stepperDisabled = disabled || readOnly;
    const fieldToneClass = cn(
      resolvedStatus === "error" &&
        "border-destructive focus-visible:ring-destructive",
      resolvedStatus === "warning" &&
        "border-warning focus-visible:ring-warning",
      resolvedStatus === "success" &&
        "border-success focus-visible:ring-success",
    );
    const stepperToneClass = cn(
      resolvedStatus === "error" &&
        "border-destructive text-destructive focus-visible:ring-destructive",
      resolvedStatus === "warning" &&
        "border-warning text-warning focus-visible:ring-warning",
      resolvedStatus === "success" &&
        "border-success text-success focus-visible:ring-success",
      resolvedStatus === "default" &&
        "border-[color:var(--primitives-colors-foreground-500)]",
    );

    const setRefs = React.useCallback(
      (node: HTMLInputElement | null) => {
        internalRef.current = node;
        if (typeof ref === "function") {
          ref(node);
        } else if (ref) {
          ref.current = node;
        }
      },
      [ref],
    );

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      onValueChange?.(numericValueFromInput(event.currentTarget));
    };

    const handleStep = (direction: "decrement" | "increment") => {
      const input = internalRef.current;
      if (!input || stepperDisabled) return;

      try {
        const value = stepValue(input, direction);
        onValueChange?.(value);
      } catch {
        onValueChange?.(numericValueFromInput(input));
      }
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
        <div className="flex w-full items-stretch">
          {showSteppers && (
            <button
              type="button"
              aria-label="Decrease value"
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-l-control border border-r-0 bg-background text-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
                stepperToneClass,
              )}
              disabled={stepperDisabled}
              onClick={() => handleStep("decrement")}
            >
              <Minus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
          <input
            type="number"
            id={inputId}
            className={cn(
              inputVariants({ status: "default" }),
              fieldToneClass,
              "text-foreground",
              "min-w-0 flex-1 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
              showSteppers && "rounded-none text-center",
              !showSteppers && "text-left",
              className,
            )}
            ref={setRefs}
            disabled={disabled}
            readOnly={readOnly}
            aria-invalid={isInvalid || undefined}
            aria-describedby={describedBy}
            onChange={handleChange}
            {...props}
          />
          {showSteppers && (
            <button
              type="button"
              aria-label="Increase value"
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-r-control border border-l-0 bg-background text-foreground ring-offset-background transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground",
                stepperToneClass,
              )}
              disabled={stepperDisabled}
              onClick={() => handleStep("increment")}
            >
              <Plus className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
      </FieldWrapper>
    );
  },
);

NumberInput.displayName = "NumberInput";
