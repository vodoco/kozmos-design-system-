import { render, screen, fireEvent } from '@testing-library/react';
import { FloorSelector } from './FloorSelector';
import { describe, it, expect, vi } from 'vitest';

describe('FloorSelector', () => {
    it('renders floors and handles selection', () => {
        const onSelect = vi.fn();
        render(
            <FloorSelector
                floors={['1', '2', '3']}
                selectedFloor="1"
                onFloorSelect={onSelect}
            />
        );

        expect(screen.getByText('1')).toBeInTheDocument();
        fireEvent.click(screen.getByText('2'));
        expect(onSelect).toHaveBeenCalledWith('2');
    });
});
