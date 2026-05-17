import type { Meta, StoryObj } from '@storybook/react';
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle, DrawerDescription } from './Drawer';
import { Button } from '../Button/Button';

const meta: Meta<typeof Drawer> = {
    title: 'Feedback/Drawer',
    component: Drawer,
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Default: Story = {
    render: () => (
        <Drawer>
            <DrawerTrigger asChild>
                <Button variant="outline">Open Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Are you absolutely sure?</DrawerTitle>
                    <DrawerDescription>This action cannot be undone.</DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                    Content goes here.
                </div>
            </DrawerContent>
        </Drawer>
    ),
};
