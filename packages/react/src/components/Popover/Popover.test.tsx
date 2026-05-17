import { render, screen, fireEvent } from '@testing-library/react';
import { Popover, PopoverContent, PopoverTrigger } from './Popover';
import { describe, it, expect } from 'vitest';

describe('Popover', () => {
    it('shows content on click', () => {
        render(
            <Popover>
                <PopoverTrigger>Open</PopoverTrigger>
                <PopoverContent>Content</PopoverContent>
            </Popover>
        );

        fireEvent.click(screen.getByText('Open'));
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
