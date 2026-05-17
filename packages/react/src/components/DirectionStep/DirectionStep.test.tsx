import { render, screen } from '@testing-library/react';
import { DirectionStep } from './DirectionStep';
import { describe, it, expect } from 'vitest';

describe('DirectionStep', () => {
    it('renders instruction and distance', () => {
        render(
            <DirectionStep
                type="left"
                instruction="Turn left"
                distance="50m"
            />
        );
        expect(screen.getByText('Turn left')).toBeInTheDocument();
        expect(screen.getByText(/50m/)).toBeInTheDocument();
    });
});
