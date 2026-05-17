import { render, screen } from '@testing-library/react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './Tooltip';
import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';

describe('Tooltip', () => {
    it('renders trigger correctly', () => {
        render(
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        expect(screen.getByText('Hover me')).toBeInTheDocument();
    });

    it('renders tooltip content in the DOM (sr-only until activated)', () => {
        render(
            <TooltipProvider>
                <Tooltip open>
                    <TooltipTrigger>Hover me</TooltipTrigger>
                    <TooltipContent>Content</TooltipContent>
                </Tooltip>
            </TooltipProvider>
        );

        // Radix renders tooltip content as a visually hidden span for screen readers
        // even before pointer activation. With open=true, the content should be queryable.
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });
});
