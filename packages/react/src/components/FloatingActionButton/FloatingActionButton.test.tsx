import { render, screen } from '@testing-library/react';
import { FloatingActionButton } from './FloatingActionButton';
import { describe, it, expect } from 'vitest';

describe('FloatingActionButton', () => {
    it('renders correctly', () => {
        render(<FloatingActionButton>Test</FloatingActionButton>);
        expect(screen.getByText('Test')).toBeInTheDocument();
    });
});
