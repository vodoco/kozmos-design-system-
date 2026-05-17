import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Separator } from './Separator';
import '@testing-library/jest-dom/vitest';

describe('Separator', () => {
    it('renders horizontal separator', () => {
        render(<Separator orientation="horizontal" data-testid="sep" />);
        const separator = screen.getByTestId('sep');
        expect(separator).toBeInTheDocument();
        expect(separator).toHaveClass('h-px');
        expect(separator).toHaveClass('w-full');
    });

    it('renders vertical separator', () => {
        render(<Separator orientation="vertical" data-testid="sep" />);
        const separator = screen.getByTestId('sep');
        expect(separator).toHaveClass('w-px');
        expect(separator).toHaveClass('h-full');
    });

    it('renders non-decorative separator with separator role', () => {
        render(<Separator decorative={false} />);
        expect(screen.getByRole('separator')).toBeInTheDocument();
    });
});
