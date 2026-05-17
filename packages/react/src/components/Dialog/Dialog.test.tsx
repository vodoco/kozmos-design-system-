import { render, screen } from '@testing-library/react';
import { Dialog, DialogTrigger, DialogContent } from './Dialog';
import { describe, it, expect } from 'vitest';

describe('Dialog', () => {
    it('renders correctly', () => {
        render(
            <Dialog>
                <DialogTrigger>Open</DialogTrigger>
                <DialogContent>Content</DialogContent>
            </Dialog>
        );
        expect(screen.getByText('Open')).toBeInTheDocument();
    });
});
