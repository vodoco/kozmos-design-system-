import type { Meta, StoryObj } from '@storybook/react';
import { Slider } from './Slider';

const meta: Meta<typeof Slider> = {
    title: 'Inputs/Slider',
    component: Slider,
    };

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
    render: () => <Slider defaultValue={[50]} max={100} step={1} className="w-3/5" />,
};
