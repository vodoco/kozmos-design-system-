import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Grid } from './Grid';

describe('Grid', () => {
    it('renders children correctly', () => {
        render(<Grid><div>Child 1</div></Grid>);
        expect(screen.getByText('Child 1')).toBeInTheDocument();
    });

    it('applies grid class by default', () => {
        const { container } = render(<Grid>Content</Grid>);
        expect(container.firstChild).toHaveClass('grid');
    });

    it('applies col classes', () => {
        const { container } = render(<Grid cols={3}>Content</Grid>);
        expect(container.firstChild).toHaveClass('grid-cols-3');
    });

    it('applies gap classes', () => {
        const { container } = render(<Grid gap={4}>Content</Grid>);
        expect(container.firstChild).toHaveClass('gap-4');
    });
});
