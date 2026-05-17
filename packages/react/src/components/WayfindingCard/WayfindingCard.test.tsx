import { render, screen, fireEvent } from '@testing-library/react';
import { WayfindingCard } from './WayfindingCard';
import { describe, it, expect, vi } from 'vitest';

describe('WayfindingCard', () => {
    it('renders title and children', () => {
        render(
            <WayfindingCard title="Test Route">
                <div>Step 1</div>
            </WayfindingCard>
        );
        expect(screen.getByText('Test Route')).toBeInTheDocument();
        expect(screen.getByText('Step 1')).toBeInTheDocument();
    });

    it('handles close', () => {
        const onClose = vi.fn();
        render(<WayfindingCard onClose={onClose}>Content</WayfindingCard>);
        fireEvent.click(screen.getByRole('button'));
        expect(onClose).toHaveBeenCalled();
    });
});
