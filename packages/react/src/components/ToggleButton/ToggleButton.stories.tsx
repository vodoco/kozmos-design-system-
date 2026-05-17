import type { Meta, StoryObj } from '@storybook/react';
import { ToggleButton } from './ToggleButton';
import { Bold } from 'lucide-react';

const meta: Meta<typeof ToggleButton> = {
    title: 'Action/ToggleButton',
    component: ToggleButton,
    };

export default meta;
type Story = StoryObj<typeof ToggleButton>;

export const Default: Story = {
    args: {
        'aria-label': 'Toggle bold',
        children: <Bold className="h-4 w-4" />,
    },
};
