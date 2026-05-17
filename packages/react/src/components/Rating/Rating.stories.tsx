import type { Meta, StoryObj } from '@storybook/react';
import { Rating } from './Rating';

const meta: Meta<typeof Rating> = {
    title: 'Input/Rating',
    component: Rating,
    };

export default meta;
type Story = StoryObj<typeof Rating>;

export const Default: Story = {
    args: {
        value: 3,
        onChange: (val) => console.log(val),
    },
};
