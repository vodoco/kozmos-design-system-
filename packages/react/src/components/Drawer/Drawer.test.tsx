import { render, screen } from '@testing-library/react';
import { Drawer, DrawerContent, DrawerTrigger } from './Drawer';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('Drawer', () => {
    it('opens on click', async () => {
        const user = userEvent.setup();
        render(
            <Drawer>
                <DrawerTrigger>Open</DrawerTrigger>
                <DrawerContent>Content</DrawerContent>
            </Drawer>
        );

        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Content')).toBeInTheDocument();
    });
});
