import { test, expect } from '@playwright/experimental-ct-react';
import { Checkbox } from '../src/components/Checkbox';
import React from 'react';

test.describe('Checkbox Behavioral Matrix', () => {
    test('toggles mechanical state dynamically asserting aria-checked parity', async ({ mount }) => {
        const component = await mount(<Checkbox />);
        const checkboxLocator = component.locator('button[role="checkbox"]');
        
        await expect(checkboxLocator).not.toBeChecked();
        
        // Behavioral Click natively asserting Radix DOM updates visually
        await checkboxLocator.click(); 
        
        // Final State Parity check natively validating actual `aria-checked="true"` React modifications 
        await expect(checkboxLocator).toBeChecked();
    });
});
