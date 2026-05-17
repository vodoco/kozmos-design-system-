import { render, fireEvent, screen } from '@testing-library/react';
import { OTPInput } from './OTPInput';
import { describe, it, expect, vi } from 'vitest';

describe('OTPInput', () => {
    it('renders correct number of inputs', () => {
        render(<OTPInput length={4} />);
        expect(screen.getAllByRole('textbox')).toHaveLength(4);
    });

    it('focuses next input on change', () => {
        render(<OTPInput length={4} />);
        const inputs = screen.getAllByRole('textbox');
        fireEvent.change(inputs[0], { target: { value: '1' } });
        expect(document.activeElement).toBe(inputs[1]);
    });

    it('renders error messages and aria attributes correctly', () => {
        const { container } = render(<OTPInput length={4} error="OTP is invalid" />);
        const inputs = screen.getAllByRole('textbox');
        inputs.forEach(input => {
            expect(input).toHaveAttribute('aria-invalid', 'true');
            expect(input).toHaveAttribute('aria-describedby');
            const errorId = input.getAttribute('aria-describedby');
            expect(document.getElementById(errorId!)).toBeInTheDocument();
        });
        expect(screen.getByText('OTP is invalid')).toBeInTheDocument();
    });
});
