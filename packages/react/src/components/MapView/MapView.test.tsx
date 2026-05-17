import { render, screen } from '@testing-library/react';
import { MapView } from './MapView';
import { describe, it, expect } from 'vitest';

describe('MapView', () => {
    it('renders children', () => {
        render(<MapView><div>Map Content</div></MapView>);
        expect(screen.getByText('Map Content')).toBeInTheDocument();
    });
});
