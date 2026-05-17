import { render, screen } from '@testing-library/react';
import { POICard } from './POICard';
import { describe, it, expect } from 'vitest';

describe('POICard', () => {
    it('renders title and subtitle', () => {
        render(<POICard title="Coffee Shop" subtitle="Food & Drink" />);
        expect(screen.getByText('Coffee Shop')).toBeInTheDocument();
        expect(screen.getByText('Food & Drink')).toBeInTheDocument();
    });
});
