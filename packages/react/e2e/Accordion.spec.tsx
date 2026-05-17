import { test, expect } from '@playwright/experimental-ct-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../src/components/Accordion';
import React from 'react';

test.describe('Accordion Behavioral CT', () => {
    test('expands on trigger click, collapses on second click (single)', async ({ mount }) => {
        const component = await mount(<Accordion type="single" collapsible>
            <AccordionItem value="1"><AccordionTrigger>Section 1</AccordionTrigger><AccordionContent>Content 1</AccordionContent></AccordionItem>
            <AccordionItem value="2"><AccordionTrigger>Section 2</AccordionTrigger><AccordionContent>Content 2</AccordionContent></AccordionItem>
        </Accordion>);
        const trigger = component.locator('button', { hasText: 'Section 1' });
        await trigger.click();
        await expect(component.locator('text=Content 1')).toBeVisible();
        await trigger.click();
        await expect(component.locator('text=Content 1')).not.toBeVisible();
        
        // Ensure Single closes others natively
        await trigger.click(); // open 1
        await component.locator('button', { hasText: 'Section 2' }).click(); // open 2
        await expect(component.locator('text=Content 1')).not.toBeVisible();
    });

    test('type="multiple" allows two open', async ({ mount }) => {
        const component = await mount(<Accordion type="multiple">
            <AccordionItem value="1"><AccordionTrigger>S1</AccordionTrigger><AccordionContent>C1</AccordionContent></AccordionItem>
            <AccordionItem value="2"><AccordionTrigger>S2</AccordionTrigger><AccordionContent>C2</AccordionContent></AccordionItem>
        </Accordion>);
        await component.locator('button', { hasText: 'S1' }).click();
        await component.locator('button', { hasText: 'S2' }).click();
        await expect(component.locator('text=C1')).toBeVisible();
        await expect(component.locator('text=C2')).toBeVisible();
    });
});