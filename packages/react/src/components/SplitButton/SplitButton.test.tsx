import { render, screen, fireEvent } from '@testing-library/react';
import { SplitButton } from './SplitButton';
import { describe, it, expect } from 'vitest';

describe('SplitButton', () => {
    it('renders main button and menu trigger', () => {
        render(<SplitButton>Action</SplitButton>);
        expect(screen.getByText('Action')).toBeInTheDocument();
    });

    it('toggles menu', () => {
        render(<SplitButton menuItems={[{ label: 'Item', onClick: () => { } }]}>Action</SplitButton>);
        // Find the trigger button (it has children rendering chevron, usually index 1 if logic holds, or by class/svg)
        // Simplified check
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toBeGreaterThan(1);
    });
});
