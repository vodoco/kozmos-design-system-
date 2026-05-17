import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DatePicker } from './DatePicker';
import '@testing-library/jest-dom/vitest';

describe('DatePicker', () => {
    it('renders date input', () => {
        render(<DatePicker data-testid="dp" />);
        const input = screen.getByTestId('dp');
        expect(input).toBeInTheDocument();
        expect(input).toHaveAttribute('type', 'date');
    });

    it('renders label with correct htmlFor association', () => {
        render(<DatePicker label="Start date" data-testid="dp" />);
        const input = screen.getByTestId('dp');
        const label = screen.getByText('Start date');
        expect(label).toBeInTheDocument();
        expect(label).toHaveAttribute('for', input.id);
    });

    it('renders error message with aria-describedby linkage', () => {
        render(<DatePicker error="Invalid date" data-testid="dp" />);
        const input = screen.getByTestId('dp');
        expect(input).toHaveAttribute('aria-invalid', 'true');
        expect(input).toHaveAttribute('aria-describedby');

        const errorMessage = screen.getByText('Invalid date');
        expect(errorMessage).toBeInTheDocument();
        expect(input.getAttribute('aria-describedby')).toBe(errorMessage.id);
    });
});
