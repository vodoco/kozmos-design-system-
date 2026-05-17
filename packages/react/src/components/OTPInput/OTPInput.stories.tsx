import type { Meta, StoryObj } from '@storybook/react';
import { OTPInput } from './OTPInput';

const meta: Meta<typeof OTPInput> = {
    title: 'Input/OTPInput',
    component: OTPInput,
    };

export default meta;
type Story = StoryObj<typeof OTPInput>;

export const Default: Story = {
    args: {
        length: 6,
        onChange: (val) => console.log(val),
    },
};

export const WithError: Story = {
    args: {
        length: 6,
        error: "Invalid security code.",
        onChange: (val) => console.log(val),
    },
};
