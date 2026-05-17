import type { Meta, StoryObj } from '@storybook/react';
import { LocationPin } from './LocationPin';

const meta: Meta<typeof LocationPin> = {
    title: 'Map/LocationPin',
    component: LocationPin,
    };

export default meta;
type Story = StoryObj<typeof LocationPin>;

export const Default: Story = {
    args: {
        color: 'red',
        size: 'md',
    },
};
