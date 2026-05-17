import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';

const meta: Meta<typeof SegmentedControl> = {
    title: 'Action/SegmentedControl',
    component: SegmentedControl,
    };

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

export const Default: Story = {
    args: {
        defaultValue: 'daily',
        items: [
            { value: 'daily', label: 'Daily' },
            { value: 'weekly', label: 'Weekly' },
            { value: 'monthly', label: 'Monthly' },
        ]
    },
};
