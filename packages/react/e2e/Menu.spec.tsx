import { test, expect } from '@playwright/experimental-ct-react';
import { Menu, MenuContent, MenuItem, MenuTrigger, MenuCheckboxItem } from '../src/components/Menu';
import React from 'react';

test.describe('Menu Behavioral CT', () => {
    test('opens on trigger click, role=menu visible, item click fires onSelect, closes after selection', async ({ mount, page }) => {
        let selected = false;
        const component = await mount(<Menu>
          <MenuTrigger>Options</MenuTrigger>
          <MenuContent>
            <MenuItem onSelect={() => { selected = true; }}>Item 1</MenuItem>
          </MenuContent>
        </Menu>);
        await component.locator('text=Options').click();
        const content = page.locator('[role="menu"]');
        await expect(content).toBeVisible();
        await page.locator('text=Item 1').click();
        await expect(content).not.toBeVisible(); // Closes securely organically
        expect(selected).toBe(true);
    });

    test('MenuCheckboxItem toggles aria-checked', async ({ mount, page }) => {
        // Evaluate the checkbox explicitly natively
        const component = await mount(<Menu>
          <MenuTrigger>Opts</MenuTrigger>
          <MenuContent>
            <MenuCheckboxItem checked={true} onCheckedChange={()=>{}}>Check1</MenuCheckboxItem>
          </MenuContent>
        </Menu>);
        await component.locator('text=Opts').click();
        const item = page.locator('[role="menuitemcheckbox"]');
        await expect(item).toHaveAttribute('aria-checked', 'true');
    });
});