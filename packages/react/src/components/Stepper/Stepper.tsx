import React from "react";
import { Check } from "lucide-react";
import { cn } from "../../utils";

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: string[];
  currentStep: number;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex w-full items-center", className)}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={step}>
              <div className="flex flex-col items-center gap-2">
                <div
                  className={cn(
                    "flex h-8 w-8 items-center justify-center rounded-pill border text-sm font-medium transition-colors",
                    // The current and completed steps' ring is 2, a pending
                    // one's 1, as the plugin paints them; the current step's
                    // was 1 until 2026-09-22.
                    isCompleted
                      ? "border-2 border-primary bg-primary text-primary-foreground"
                      : isCurrent
                        ? "border-2 border-primary text-foreground"
                        : // A pending step's ring is its glyph: foreground/500,
                          // as Figma and the natives draw it. `border-muted`
                          // read 1.2:1 on the page until 2026-09-22.
                          "border-[color:var(--primitives-colors-foreground-500)] text-muted-foreground",
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                </div>
                <span
                  className={cn(
                    "text-xs",
                    isCurrent
                      ? "font-medium text-foreground"
                      : "text-muted-foreground",
                  )}
                >
                  {step}
                </span>
              </div>
              {!isLast && (
                <div
                  className={cn(
                    "mx-4 h-[1px] flex-1",
                    index < currentStep ? "bg-primary" : "bg-border",
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  },
);
Stepper.displayName = "Stepper";

export { Stepper };
