import { test, expect } from '@playwright/experimental-ct-react';
import { Dialog, DialogContent, DialogTrigger } from '../src/components/Dialog';
import React from 'react';

test.describe('Dialog Behavioral CT', () => {
    test('opens on trigger click, closes on Escape, role=dialog present', async ({ mount, page }) => {
        const component = await mount(<Dialog>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>Content bounds</DialogContent>
        </Dialog>);
        const trigger = component.locator('text=Open');
        await trigger.click();
        const content = page.locator('[role="dialog"]');
        await expect(content).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(content).not.toBeVisible();
    });
});