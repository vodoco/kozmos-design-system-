import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { Button } from '../Button/Button';

const meta: Meta<typeof Sidebar> = {
    title: 'Navigation/Sidebar',
    component: Sidebar,
    };

export default meta;
type Story = StoryObj<typeof Sidebar>;

export const Default: Story = {
    render: () => (
        <div className="flex h-96 border">
            <Sidebar>
                <div className="mb-8 font-bold text-xl">App</div>
                <nav className="flex flex-col gap-2">
                    <Button variant="ghost" className="justify-start">Home</Button>
                    <Button variant="ghost" className="justify-start">Profile</Button>
                    <Button variant="ghost" className="justify-start">Settings</Button>
                </nav>
            </Sidebar>
            <div className="flex-1 p-4 bg-muted/20">
                Content Area
            </div>
        </div>
    ),
};
