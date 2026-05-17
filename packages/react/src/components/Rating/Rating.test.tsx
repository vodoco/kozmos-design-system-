import { render, screen, fireEvent } from '@testing-library/react';
import { Rating } from './Rating';
import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Rating', () => {
    it('renders stars', () => {
        render(<Rating max={5} value={3} />);
        const radios = screen.getAllByRole('radio');
        expect(radios).toHaveLength(5);
    });

    it('calls onChange when clicked', () => {
        const onChange = vi.fn();
        render(<Rating max={5} onChange={onChange} />);
        const radios = screen.getAllByRole('radio');
        fireEvent.click(radios[3]); // 4th star (index 3) -> value 4
        expect(onChange).toHaveBeenCalledWith(4);
    });
});
