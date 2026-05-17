import type { Meta, StoryObj } from '@storybook/react';
import { FloorSelector } from './FloorSelector';

const meta: Meta<typeof FloorSelector> = {
    title: 'Map/FloorSelector',
    component: FloorSelector,
    };

export default meta;
type Story = StoryObj<typeof FloorSelector>;

export const Default: Story = {
    args: {
        floors: ['L3', 'L2', 'L1', 'G', 'B1'],
        selectedFloor: 'L1',
        onFloorSelect: (floor) => console.log('Selected:', floor),
    },
};
