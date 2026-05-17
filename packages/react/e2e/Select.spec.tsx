import { test, expect } from '@playwright/experimental-ct-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '../src/components/Select';
import React from 'react';

test.describe('Select Behavioral CT', () => {
    test('dropdown opens, item selection updates value, error prop sets aria-invalid', async ({ mount, page }) => {
        const component = await mount(<Select>
            <SelectTrigger error={true}><SelectValue placeholder="Choose" /></SelectTrigger>
            <SelectContent>
                <SelectItem value="1">Option 1</SelectItem>
            </SelectContent>
        </Select>);
        const trigger = component.locator('button[role="combobox"]');
        await expect(trigger).toHaveAttribute('aria-invalid', 'true');
        await trigger.click();
        await page.locator('text=Option 1').click();
        await expect(trigger).toContainText('Option 1');
    });
});