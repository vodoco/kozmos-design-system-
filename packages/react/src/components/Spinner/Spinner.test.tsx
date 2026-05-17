import { render, screen } from '@testing-library/react';
import { Spinner } from './Spinner';
import { describe, it, expect } from 'vitest';

describe('Spinner', () => {
    it('renders correctly', () => {
        render(<Spinner />);
        expect(screen.getByRole('status')).toBeInTheDocument();
    });
});
