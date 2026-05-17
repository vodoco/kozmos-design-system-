import type { Meta, StoryObj } from '@storybook/react';
import { DirectionStep } from './DirectionStep';

const meta: Meta<typeof DirectionStep> = {
    title: 'Map/DirectionStep',
    component: DirectionStep,
    };

export default meta;
type Story = StoryObj<typeof DirectionStep>;

export const Default: Story = {
    args: {
        type: 'straight',
        instruction: 'Head North',
        distance: '100m',
    },
};
