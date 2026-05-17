import type { Meta, StoryObj } from '@storybook/react';
import { Container } from './Container';

const meta: Meta<typeof Container> = {
    title: 'Foundations/Container',
    component: Container,
    };

export default meta;
type Story = StoryObj<typeof Container>;

export const Default: Story = {
    args: {
        children: (
            <div className="bg-muted p-4 border border-dashed text-center">
                Container Content (Max Width 7xl)
            </div>
        ),
    },
};

export const Fluid: Story = {
    args: {
        centered: false,
        children: (
            <div className="bg-muted p-4 border border-dashed text-center">
                Fluid Container (Full Width)
            </div>
        ),
    },
};
