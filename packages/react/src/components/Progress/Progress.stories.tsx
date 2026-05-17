import type { Meta, StoryObj } from '@storybook/react';
import { Progress } from './Progress';
import React, { useEffect, useState } from 'react';

const meta: Meta<typeof Progress> = {
    title: 'Feedback/Progress',
    component: Progress,
    };

export default meta;
type Story = StoryObj<typeof Progress>;

export const Default: Story = {
    render: () => {
        const [progress, setProgress] = useState(13);
        useEffect(() => {
            const timer = setTimeout(() => setProgress(66), 500);
            return () => clearTimeout(timer);
        }, []);
        return <Progress value={progress} className="w-3/5" />;
    },
};
