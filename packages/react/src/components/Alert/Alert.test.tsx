import { render, screen } from '@testing-library/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';
import { describe, it, expect } from 'vitest';

describe('Alert', () => {
    it('renders correctly', () => {
        render(
            <Alert>
                <AlertTitle>Test Alert</AlertTitle>
                <AlertDescription>Description</AlertDescription>
            </Alert>
        );
        expect(screen.getByText('Test Alert')).toBeInTheDocument();
        expect(screen.getByText('Description')).toBeInTheDocument();
    });
});
