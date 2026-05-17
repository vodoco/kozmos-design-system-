import type { Meta, StoryObj } from '@storybook/react';
import { Spinner } from './Spinner';

const meta: Meta<typeof Spinner> = {
    title: 'Feedback/Spinner',
    component: Spinner,
    };

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = {
    render: () => <Spinner />,
};

export const Small: Story = {
    render: () => <Spinner size="sm" />,
};

export const Large: Story = {
    render: () => <Spinner size="lg" />,
};
