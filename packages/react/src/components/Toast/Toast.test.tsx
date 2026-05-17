import { render, screen } from '@testing-library/react';
import { Toast, ToastProvider, ToastViewport, ToastTitle } from './Toast';
import { describe, it, expect } from 'vitest';

describe('Toast', () => {
    it('renders correctly', () => {
        render(
            <ToastProvider>
                <Toast open={true}>
                    <ToastTitle>Test Toast</ToastTitle>
                </Toast>
                <ToastViewport />
            </ToastProvider>
        );
        expect(screen.getByText('Test Toast')).toBeInTheDocument();
    });
});
