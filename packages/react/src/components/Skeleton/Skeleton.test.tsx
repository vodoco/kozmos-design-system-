import { render, screen } from '@testing-library/react';
import { Skeleton } from './Skeleton';
import { describe, it, expect } from 'vitest';

describe('Skeleton', () => {
    it('renders correctly', () => {
        render(<Skeleton data-testid="skeleton" />);
        expect(screen.getByTestId('skeleton')).toBeInTheDocument();
    });
});
