import { render, screen } from '@testing-library/react';
import { SegmentedControl } from './SegmentedControl';
import { describe, it, expect } from 'vitest';

describe('SegmentedControl', () => {
    it('renders items', () => {
        render(<SegmentedControl items={[{ value: '1', label: 'One' }, { value: '2', label: 'Two' }]} />);
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
    });
});
