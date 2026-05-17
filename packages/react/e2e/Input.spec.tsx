import { test, expect } from '@playwright/experimental-ct-react';
import { Input } from '../src/components/Input';
import React from 'react';

test.describe('Input Behavioral Matrix', () => {
    test('accepts user keystrokes accurately reflecting mechanical state updates', async ({ mount }) => {
        const component = await mount(<Input placeholder="Type here" />);
        // Wait for hydration physically
        await expect(component).toBeVisible();
        await component.locator('input').fill('Automation Execution');
        await expect(component.locator('input')).toHaveValue('Automation Execution');
    });

    test('validates destructive semantic error props natively scaling aria-invalid bounds', async ({ mount }) => {
        const component = await mount(<Input error="Invalid entry" />);
        const inputLocator = component.locator('input');
        await expect(inputLocator).toHaveAttribute('aria-invalid', 'true');
        await expect(component).toContainText('Invalid entry');
    });
});
