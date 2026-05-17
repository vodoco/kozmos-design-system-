import { render, screen } from '@testing-library/react';
import { Progress } from './Progress';
import { describe, it, expect } from 'vitest';

describe('Progress', () => {
    it('renders correctly', () => {
        render(<Progress value={50} aria-label="progress" />);
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
});
