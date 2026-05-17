import type { Meta, StoryObj } from '@storybook/react';
import { Stack } from './Stack';
import { Box } from '../Box/Box';

const meta: Meta<typeof Stack> = {
    title: 'Foundations/Stack',
    component: Stack,
    argTypes: {
        direction: { control: 'radio', options: ['row', 'column'] },
        gap: { control: 'select', options: [0, 1, 2, 4, 8] },
    },
};

export default meta;
type Story = StoryObj<typeof Stack>;

const BoxItem = ({ children, color = 'bg-primary' }: { children: React.ReactNode, color?: string }) => (
    <Box className={`p-4 rounded text-white ${color}`}>
        {children}
    </Box>
);

export const Default: Story = {
    args: {
        children: (
            <>
                <BoxItem>Item 1</BoxItem>
                <BoxItem color="bg-secondary">Item 2</BoxItem>
                <BoxItem color="bg-accent">Item 3</BoxItem>
            </>
        ),
    },
};

export const Horizontal: Story = {
    args: {
        direction: 'row',
        gap: 4,
        children: (
            <>
                <BoxItem>Item 1</BoxItem>
                <BoxItem color="bg-secondary">Item 2</BoxItem>
                <BoxItem color="bg-accent">Item 3</BoxItem>
            </>
        ),
    },
};
