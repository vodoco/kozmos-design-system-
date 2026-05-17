import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Box } from './Box';

describe('Box', () => {
    it('renders correctly', () => {
        render(<Box>Box Content</Box>);
        expect(screen.getByText('Box Content')).toBeInTheDocument();
    });

    it('renders as a different element when asChild is true', () => {
        render(
            <Box asChild>
                <span data-testid="span-child">Child Content</span>
            </Box>
        );
        const element = screen.getByTestId('span-child');
        expect(element.tagName).toBe('SPAN');
    });

    it('applies custom classes', () => {
        render(<Box className="custom-class">Content</Box>);
        const element = screen.getByText('Content');
        expect(element).toHaveClass('custom-class');
    });
});
