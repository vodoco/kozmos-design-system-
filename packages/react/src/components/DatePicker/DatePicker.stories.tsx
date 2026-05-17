import type { Meta, StoryObj } from '@storybook/react';
import { DatePicker } from './DatePicker';

const meta: Meta<typeof DatePicker> = {
    title: 'Input/DatePicker',
    component: DatePicker,
    };

export default meta;
type Story = StoryObj<typeof DatePicker>;

export const Default: Story = {
    args: {
        placeholder: 'Select a date',
    },
};
