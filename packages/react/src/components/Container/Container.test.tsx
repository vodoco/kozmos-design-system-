import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Container } from './Container';

describe('Container', () => {
    it('renders content', () => {
        render(<Container>Content</Container>);
        expect(screen.getByText('Content')).toBeInTheDocument();
    });

    it('applies max-width by default', () => {
        const { container } = render(<Container>Content</Container>);
        expect(container.firstChild).toHaveClass('max-w-7xl');
        expect(container.firstChild).toHaveClass('mx-auto');
    });

    it('does not apply max-width when centered is false', () => {
        const { container } = render(<Container centered={false}>Content</Container>);
        expect(container.firstChild).not.toHaveClass('max-w-7xl');
        expect(container.firstChild).not.toHaveClass('mx-auto');
    });
});
