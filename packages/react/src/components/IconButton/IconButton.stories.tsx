import type { Meta, StoryObj } from '@storybook/react';
import { IconButton } from './IconButton';
import { Search } from 'lucide-react';

const meta: Meta<typeof IconButton> = {
    title: 'Action/IconButton',
    component: IconButton,
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link', 'glass'],
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
        },
        disabled: { control: 'boolean' },
    },
};

export default meta;
type Story = StoryObj<typeof IconButton>;

export const Default: Story = {
    args: {
        children: <Search className="h-4 w-4" />,
        'aria-label': 'Search',
        variant: 'ghost',
        size: 'icon',
    },
};

export const Variants: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <IconButton variant="default" aria-label="Default"><Search className="h-4 w-4" /></IconButton>
            <IconButton variant="secondary" aria-label="Secondary"><Search className="h-4 w-4" /></IconButton>
            <IconButton variant="outline" aria-label="Outline"><Search className="h-4 w-4" /></IconButton>
            <IconButton variant="ghost" aria-label="Ghost"><Search className="h-4 w-4" /></IconButton>
            <IconButton variant="destructive" aria-label="Destructive"><Search className="h-4 w-4" /></IconButton>
        </div>
    ),
};

export const Sizes: Story = {
    render: () => (
        <div className="flex items-center gap-4">
            <IconButton size="sm" variant="outline" aria-label="Small"><Search className="h-3 w-3" /></IconButton>
            <IconButton size="default" variant="outline" aria-label="Default"><Search className="h-4 w-4" /></IconButton>
            <IconButton size="lg" variant="outline" aria-label="Large"><Search className="h-5 w-5" /></IconButton>
        </div>
    ),
};
