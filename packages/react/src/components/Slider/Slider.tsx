import React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "../../utils";
import { FieldWrapper } from "../FieldWrapper";
import { useKozmosAnalytics } from "../../utils/analytics";

export interface SliderProps extends React.ComponentPropsWithoutRef<
  typeof SliderPrimitive.Root
> {
  label?: string;
  error?: boolean | string;
  thumbCount?: number;
  thumbLabels?: string[];
  wrapperClassName?: string;
}

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(
  (
    {
      className,
      label,
      error,
      thumbCount,
      thumbLabels,
      wrapperClassName,
      ...props
    },
    ref,
  ) => {
    const errorId = React.useId();
    const generatedInputId = React.useId();
    const hasError = !!error;
    const isStringError = typeof error === "string";
    const inputId = props.id || generatedInputId;
    const { trackEvent } = useKozmosAnalytics();
    const inferredThumbCount = Math.max(
      1,
      thumbCount ??
        (Array.isArray(props.value) ? props.value.length : undefined) ??
        (Array.isArray(props.defaultValue)
          ? props.defaultValue.length
          : undefined) ??
        1,
    );
    const thumbs = Array.from({ length: inferredThumbCount });
    const min = typeof props.min === "number" ? props.min : 0;
    const max = typeof props.max === "number" ? props.max : 100;
    const fallbackDefaultValue =
      thumbCount &&
      !Array.isArray(props.value) &&
      !Array.isArray(props.defaultValue)
        ? Array.from({ length: inferredThumbCount }, (_, index) =>
            inferredThumbCount === 1
              ? min
              : min + ((max - min) * index) / (inferredThumbCount - 1),
          )
        : undefined;

    return (
      <FieldWrapper
        error={error}
        errorId={errorId}
        label={label}
        inputId={inputId}
        className={wrapperClassName}
      >
        <SliderPrimitive.Root
          ref={ref}
          id={inputId}
          aria-invalid={hasError}
          aria-describedby={hasError && isStringError ? errorId : undefined}
          className={cn(
            "relative flex w-full touch-none select-none items-center",
            hasError && "ring-1 ring-destructive rounded-full",
            className,
          )}
          {...props}
          defaultValue={props.defaultValue ?? fallbackDefaultValue}
          onValueCommit={(value) => {
            trackEvent("Slider", "slider_value_changed", { value });
            props.onValueCommit?.(value);
          }}
        >
          <SliderPrimitive.Track className="relative h-2 w-full grow overflow-hidden rounded-full border border-[color:var(--primitives-colors-foreground-500)] bg-secondary">
            <SliderPrimitive.Range
              className={cn(
                "absolute h-full bg-primary",
                hasError && "bg-destructive",
              )}
            />
          </SliderPrimitive.Track>
          {thumbs.map((_, index) => (
            <SliderPrimitive.Thumb
              key={index}
              aria-label={
                thumbLabels?.[index] ??
                (inferredThumbCount > 1
                  ? index === 0
                    ? "Minimum value"
                    : index === inferredThumbCount - 1
                      ? "Maximum value"
                      : `Value ${index + 1}`
                  : label)
              }
              className={cn(
                "block h-5 w-5 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                hasError && "border-destructive",
              )}
            />
          ))}
        </SliderPrimitive.Root>
      </FieldWrapper>
    );
  },
);
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
