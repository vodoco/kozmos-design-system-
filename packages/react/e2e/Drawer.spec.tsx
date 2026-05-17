import { test, expect } from '@playwright/experimental-ct-react';
import { Drawer, DrawerContent, DrawerTrigger } from '../src/components/Drawer';
import React from 'react';

test.describe('Drawer Behavioral CT', () => {
    test('opens on trigger click, closes on Escape', async ({ mount, page }) => {
        const component = await mount(<Drawer>
          <DrawerTrigger>Open</DrawerTrigger>
          <DrawerContent>Left Boundary</DrawerContent>
        </Drawer>);
        await component.locator('text=Open').click();
        const content = page.locator('[role="dialog"]');
        await expect(content).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(content).not.toBeVisible();
    });
});