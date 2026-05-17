import { test, expect } from '@playwright/experimental-ct-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../src/components/Tabs';
import React from 'react';

test.describe('Tabs Behavioral CT', () => {
    test('clicking tab switches content, active tab has aria-selected=true', async ({ mount }) => {
        const component = await mount(<Tabs defaultValue="1">
            <TabsList>
                <TabsTrigger value="1">Tab 1</TabsTrigger>
                <TabsTrigger value="2">Tab 2</TabsTrigger>
            </TabsList>
            <TabsContent value="1">Panel 1</TabsContent>
            <TabsContent value="2">Panel 2</TabsContent>
        </Tabs>);
        
        await expect(component.locator('text=Panel 1')).toBeVisible(); // Default visible
        
        const t2 = component.locator('button[role="tab"]', { hasText: 'Tab 2' });
        await t2.click();
        await expect(t2).toHaveAttribute('aria-selected', 'true');
        await expect(component.locator('text=Panel 2')).toBeVisible();
        await expect(component.locator('text=Panel 1')).not.toBeVisible(); // Others hidden
    });

    test('ArrowRight moves focus seamlessly natively', async ({ mount, page }) => {
        const component = await mount(<Tabs defaultValue="1">
            <TabsList>
                <TabsTrigger value="1">T1</TabsTrigger>
                <TabsTrigger value="2">T2</TabsTrigger>
            </TabsList>
        </Tabs>);
        
        const t1 = component.locator('text=T1');
        const t2 = component.locator('text=T2');
        
        await t1.focus();
        await expect(t1).toBeFocused();
        
        await page.keyboard.press('ArrowRight');
        
        // Evaluate Radix accessibility Native physical transfer inherently
        await expect(t2).toBeFocused(); 
    });
});