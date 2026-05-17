import type { Meta, StoryObj } from '@storybook/react';
import {
    Timeline,
    TimelineItem,
    TimelineTime,
    TimelineTitle,
    TimelineDescription,
} from './Timeline';

const meta: Meta<typeof Timeline> = {
    title: 'Data Display/Timeline',
    component: Timeline,
    };

export default meta;
type Story = StoryObj<typeof Timeline>;

export const Default: Story = {
    render: () => (
        <Timeline>
            <TimelineItem>
                <TimelineTime>February 2022</TimelineTime>
                <TimelineTitle>Application UI code in Tailwind CSS</TimelineTitle>
                <TimelineDescription>
                    Get access to over 20+ pages including a dashboard layout, charts,
                    kanban board, calendar, and pre-order E-commerce & Marketing pages.
                </TimelineDescription>
            </TimelineItem>
            <TimelineItem>
                <TimelineTime>March 2022</TimelineTime>
                <TimelineTitle>Marketing UI design in Figma</TimelineTitle>
                <TimelineDescription>
                    All of the pages and components are first designed in Figma and we keep
                    a parity between the two versions even as we update the project.
                </TimelineDescription>
            </TimelineItem>
            <TimelineItem>
                <TimelineTime>April 2022</TimelineTime>
                <TimelineTitle>E-Commerce UI code in Tailwind CSS</TimelineTitle>
                <TimelineDescription>
                    Get started with dozens of web components and interactive elements
                    built on top of Tailwind CSS.
                </TimelineDescription>
            </TimelineItem>
        </Timeline>
    ),
};
