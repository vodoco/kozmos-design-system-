import type { Meta, StoryObj } from '@storybook/react';
import { Tree, type TreeItem } from './Tree';

const meta: Meta<typeof Tree> = {
    title: 'Data Display/Tree',
    component: Tree,
    };

export default meta;
type Story = StoryObj<typeof Tree>;

const sampleData: TreeItem[] = [
    {
        id: '1',
        name: 'src',
        children: [
            {
                id: '2',
                name: 'components',
                children: [
                    { id: '3', name: 'Button.tsx' },
                    { id: '4', name: 'Input.tsx' },
                ],
            },
            { id: '5', name: 'App.tsx' },
            { id: '6', name: 'index.tsx' },
        ],
    },
    {
        id: '7',
        name: 'package.json',
    },
];

export const Default: Story = {
    render: () => <Tree data={sampleData} />,
};
