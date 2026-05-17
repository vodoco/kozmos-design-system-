import { render, screen, fireEvent } from '@testing-library/react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './Accordion';
import { describe, it, expect } from 'vitest';

describe('Accordion', () => {
    it('expands and collapses', () => {
        render(
            <Accordion type="single" collapsible>
                <AccordionItem value="item-1">
                    <AccordionTrigger>Trigger</AccordionTrigger>
                    <AccordionContent>Content</AccordionContent>
                </AccordionItem>
            </Accordion>
        );

        const trigger = screen.getByText('Trigger');
        fireEvent.click(trigger);
        expect(screen.getByText('Content')).toBeVisible();
    });
});
