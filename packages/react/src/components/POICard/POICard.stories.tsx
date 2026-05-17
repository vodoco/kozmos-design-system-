import type { Meta, StoryObj } from '@storybook/react';
import { POICard } from './POICard';
import { MapOverlay } from '../MapOverlay';
import React from 'react';
import { Badge } from '../Badge/Badge';
import { Button } from '../Button/Button';
import { MapPin, Navigation, Share2, Star } from 'lucide-react';

const meta = {
    title: 'Components/POICard',
    component: POICard,
    parameters: {
        layout: 'centered',
    },
    } satisfies Meta<typeof POICard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        title: 'Starbucks Coffee',
        subtitle: 'Floor 1 • Terminal A',
        className: 'w-[380px]',
        description: 'Cozy Seattle-based coffeehouse chain known for its signature roasts, light bites, and free WiFi availability.',
        badges: (
            <>
                <Badge variant="default" className="bg-green-600 hover:bg-green-700">Open Now</Badge>
                <Badge variant="secondary">Café</Badge>
            </>
        ),
        actions: (
            <>
                <Button className="flex-1" size="sm">
                    <Navigation className="w-4 h-4 mr-2" /> Navigate
                </Button>
                <Button variant="outline" size="sm">
                    <Share2 className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                    <Star className="w-4 h-4" />
                </Button>
            </>
        )
    }
};

export const WithHeroImage: Story = {
    args: {
        ...Default.args,
        imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=2000&auto=format&fit=crop',
    }
};

export const InsideMapOverlay: Story = {
    render: (args) => (
        <div className="relative w-full min-w-[320px] md:min-w-[800px] h-[500px] bg-slate-100 rounded-xl overflow-hidden border">
            <span className="absolute inset-0 flex items-center justify-center text-muted-foreground font-mono">Simulated Map Environment</span>
            <MapOverlay position="bottom-left">
                <POICard {...args} />
            </MapOverlay>
            <MapOverlay position="top-right">
                <POICard {...args} title="Secondary Overlay" className="w-[300px]" />
            </MapOverlay>
        </div>
    ),
    args: Default.args
};
