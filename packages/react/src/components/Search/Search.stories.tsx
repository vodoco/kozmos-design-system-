import type { Meta, StoryObj } from '@storybook/react';
import { Search } from './Search';

const meta: Meta<typeof Search> = {
    title: 'Inputs/Search',
    component: Search,
    };

export default meta;
type Story = StoryObj<typeof Search>;

export const Default: Story = {
    render: () => <Search placeholder="Search..." className="w-72" />,
};
