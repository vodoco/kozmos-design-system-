import type { Meta, StoryObj } from '@storybook/react';
import { Backdrop } from './Backdrop';

const meta: Meta<typeof Backdrop> = {
    title: 'Feedback/Backdrop',
    component: Backdrop,
    };

export default meta;
type Story = StoryObj<typeof Backdrop>;

export const Default: Story = {
    render: () => (
        <div className="h-64 w-full relative border">
            <div className="absolute inset-0 flex items-center justify-center">
                Content behind backdrop
            </div>
            <Backdrop className="absolute" />
        </div>
    ),
};
