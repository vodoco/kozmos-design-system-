import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils';

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
    steps: string[];
    currentStep: number;
}

const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
    ({ className, steps, currentStep, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn('flex w-full items-center', className)}
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
                                        'flex h-8 w-8 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                                        isCompleted
                                            ? 'border-primary bg-primary text-primary-foreground'
                                            : isCurrent
                                                ? 'border-primary text-foreground'
                                                : 'border-muted text-muted-foreground'
                                    )}
                                >
                                    {isCompleted ? (
                                        <Check className="h-4 w-4" />
                                    ) : (
                                        index + 1
                                    )}
                                </div>
                                <span
                                    className={cn(
                                        'text-xs',
                                        isCurrent ? 'font-medium text-foreground' : 'text-muted-foreground'
                                    )}
                                >
                                    {step}
                                </span>
                            </div>
                            {!isLast && (
                                <div
                                    className={cn(
                                        'mx-4 h-[1px] flex-1',
                                        index < currentStep ? 'bg-primary' : 'bg-muted'
                                    )}
                                />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        );
    }
);
Stepper.displayName = 'Stepper';

export { Stepper };
