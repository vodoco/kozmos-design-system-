import React, { useRef, useState, useEffect } from 'react';
import { cn } from '../../utils';
import { inputVariants } from '../Input/Input';
import { FieldWrapper } from '../FieldWrapper';
import { useKozmosAnalytics } from '../../utils/analytics';

interface OTPInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    length?: number;
    value?: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    error?: boolean | string;
}

const OTPInput = React.forwardRef<HTMLDivElement, OTPInputProps>(
    ({ className, length = 6, value = '', onChange, disabled, error, ...props }, ref) => {
        const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));
        const inputs = useRef<(HTMLInputElement | null)[]>([]);
        const errorId = React.useId();
        const hasError = !!error;
        const isStringError = typeof error === 'string';
        const { trackEvent } = useKozmosAnalytics();

        useEffect(() => {
            if (value === otp.join('')) return;
            const newOtp = value.split('').slice(0, length);
            while (newOtp.length < length) newOtp.push('');
            setOtp(newOtp);
        }, [value, length]);

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
            const val = e.target.value;
            if (isNaN(Number(val))) return;

            const newOtp = [...otp];
            newOtp[index] = val.slice(-1);
            setOtp(newOtp);
            const joined = newOtp.join('');
            onChange?.(joined);
            if (joined.length === length && !joined.includes('')) {
                trackEvent('OTPInput', 'otp_code_completed', { length });
            }

            if (val && index < length - 1) {
                inputs.current[index + 1]?.focus();
            }
        };

        const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
            if (e.key === 'Backspace' && !otp[index] && index > 0) {
                inputs.current[index - 1]?.focus();
            }
        };

        const handlePaste = (e: React.ClipboardEvent) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text/plain').slice(0, length);
            if (!/^\d+$/.test(pastedData)) return;

            const newOtp = pastedData.split('');
            while (newOtp.length < length) newOtp.push('');
            setOtp(newOtp);
            onChange?.(newOtp.join(''));
        };

        return (
            <FieldWrapper error={error} errorId={errorId} className="w-max">
                <div
                    ref={ref}
                    className={cn('flex items-center gap-2', className)}
                    {...props}
                >
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            ref={(el) => (inputs.current[index] = el)}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                            onPaste={handlePaste}
                            disabled={disabled}
                            aria-invalid={hasError}
                            aria-describedby={hasError && isStringError ? errorId : undefined}
                            aria-label={`Digit ${index + 1} of ${length}`}
                            className={cn(
                                inputVariants({ error: hasError }),
                                "w-10 h-12 text-center text-lg p-0"
                            )}
                        />
                    ))}
                </div>
            </FieldWrapper>
        );
    }
);
OTPInput.displayName = 'OTPInput';

export { OTPInput };
