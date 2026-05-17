import { render, screen } from '@testing-library/react';
import { Timeline, TimelineItem, TimelineTitle } from './Timeline';
import { describe, it, expect } from 'vitest';

describe('Timeline', () => {
    it('renders correctly', () => {
        render(
            <Timeline>
                <TimelineItem>
                    <TimelineTitle>Event 1</TimelineTitle>
                </TimelineItem>
                <TimelineItem>
                    <TimelineTitle>Event 2</TimelineTitle>
                </TimelineItem>
            </Timeline>
        );
        expect(screen.getByText('Event 1')).toBeInTheDocument();
        expect(screen.getByText('Event 2')).toBeInTheDocument();
        expect(screen.getAllByRole('listitem')).toHaveLength(2);
    });
});
