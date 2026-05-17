import { render, screen, fireEvent } from '@testing-library/react';
import { Tag } from './Tag';
import { describe, it, expect, vi } from 'vitest';

describe('Tag', () => {
    it('renders correctly', () => {
        render(<Tag>Test Tag</Tag>);
        expect(screen.getByText('Test Tag')).toBeInTheDocument();
    });

    it('handles remove click', () => {
        const handleRemove = vi.fn();
        render(<Tag onRemove={handleRemove}>Removable</Tag>);
        fireEvent.click(screen.getByRole('button', { name: /remove/i }));
        expect(handleRemove).toHaveBeenCalled();
    });
});
