import { render, screen } from '@testing-library/react';
import { Menu, MenuTrigger, MenuContent, MenuItem } from './Menu';
import { describe, it, expect } from 'vitest';
import userEvent from '@testing-library/user-event';

describe('Menu', () => {
    it('opens on click', async () => {
        const user = userEvent.setup();
        render(
            <Menu>
                <MenuTrigger>Open</MenuTrigger>
                <MenuContent>
                    <MenuItem>Item 1</MenuItem>
                </MenuContent>
            </Menu>
        );

        await user.click(screen.getByText('Open'));
        expect(screen.getByText('Item 1')).toBeInTheDocument();
    });
});
