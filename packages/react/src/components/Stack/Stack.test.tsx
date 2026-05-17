import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Stack } from './Stack';

describe('Stack', () => {
    it('renders children correctly', () => {
        render(<Stack><div>Child 1</div><div>Child 2</div></Stack>);
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
    });

    it('applies flex direction column by default', () => {
        const { container } = render(<Stack>Content</Stack>);
        expect(container.firstChild).toHaveClass('flex-col');
    });

    it('applies flex direction row when specified', () => {
        const { container } = render(<Stack direction="row">Content</Stack>);
        expect(container.firstChild).toHaveClass('flex-row');
    });

    it('applies gap classes', () => {
        const { container } = render(<Stack gap={4}>Content</Stack>);
        expect(container.firstChild).toHaveClass('gap-4');
    });
});
