import { render } from '@testing-library/react';
import { LocationPin } from './LocationPin';
import { describe, it, expect } from 'vitest';

describe('LocationPin', () => {
    it('renders correctly', () => {
        const { container } = render(<LocationPin />);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });
});
