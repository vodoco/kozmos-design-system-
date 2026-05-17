import { render, screen, fireEvent } from '@testing-library/react';
import { ToggleButton } from './ToggleButton';
import { describe, it, expect } from 'vitest';

describe('ToggleButton', () => {
    it('toggles state', () => {
        render(<ToggleButton>Toggle</ToggleButton>);
        const button = screen.getByRole('button');
        fireEvent.click(button);
        expect(button).toHaveAttribute('data-state', 'on');
        fireEvent.click(button);
        expect(button).toHaveAttribute('data-state', 'off');
    });
});
