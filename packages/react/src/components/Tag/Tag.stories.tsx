import type { Meta, StoryObj } from '@storybook/react';
import { Tag } from './Tag';

const meta: Meta<typeof Tag> = {
    title: 'Data Display/Tag',
    component: Tag,
    };

export default meta;
type Story = StoryObj<typeof Tag>;

export const Default: Story = {
    render: () => <Tag>Tag</Tag>,
};

export const Removable: Story = {
    render: () => <Tag onRemove={() => alert('Removed')}>Removable Tag</Tag>,
};
