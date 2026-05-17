import { render, screen } from '@testing-library/react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './Tabs';
import { describe, it, expect } from 'vitest';

describe('Tabs', () => {
    it('renders correctly', () => {
        render(
            <Tabs defaultValue="tab1">
                <TabsList>
                    <TabsTrigger value="tab1">Tab 1</TabsTrigger>
                </TabsList>
                <TabsContent value="tab1">Content 1</TabsContent>
            </Tabs>
        );
        expect(screen.getByText('Tab 1')).toBeInTheDocument();
        expect(screen.getByText('Content 1')).toBeInTheDocument();
    });
});
