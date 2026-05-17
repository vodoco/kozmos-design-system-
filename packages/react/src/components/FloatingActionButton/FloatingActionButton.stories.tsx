import type { Meta, StoryObj } from '@storybook/react';
import { FloatingActionButton } from './FloatingActionButton';

const meta: Meta<typeof FloatingActionButton> = {
    title: 'Action/FloatingActionButton',
    component: FloatingActionButton,
    };

export default meta;
type Story = StoryObj<typeof FloatingActionButton>;

export const Default: Story = {
    args: {
        children: '+',
    },
};
