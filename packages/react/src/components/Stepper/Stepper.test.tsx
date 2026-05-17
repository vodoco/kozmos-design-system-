import { render, screen } from '@testing-library/react';
import { Stepper } from './Stepper';
import { describe, it, expect } from 'vitest';

describe('Stepper', () => {
    it('renders correctly', () => {
        render(<Stepper steps={['One', 'Two']} currentStep={0} />);
        expect(screen.getByText('One')).toBeInTheDocument();
        expect(screen.getByText('Two')).toBeInTheDocument();
    });
});
