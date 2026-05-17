import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { Home, User, Settings, AlertCircle } from 'lucide-react';

const meta: Meta<typeof Icon> = {
    title: 'Foundations/Icon',
    component: Icon,
    argTypes: {
        size: { control: 'select', options: ['xs', 'sm', 'md', 'lg', 'xl'] },
        color: { control: 'select', options: ['default', 'muted', 'primary', 'destructive'] },
    },
};

export default meta;
type Story = StoryObj<typeof Icon>;

export const Default: Story = {
    args: {
        icon: Home,
    },
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-end gap-4">
            <Icon icon={User} size="xs" />
            <Icon icon={User} size="sm" />
            <Icon icon={User} size="md" />
            <Icon icon={User} size="lg" />
            <Icon icon={User} size="xl" />
        </div>
    )
};

export const Colors: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <Icon icon={Settings} color="default" />
            <Icon icon={Settings} color="muted" />
            <Icon icon={Settings} color="primary" />
            <Icon icon={Settings} color="destructive" />
        </div>
    )
};
