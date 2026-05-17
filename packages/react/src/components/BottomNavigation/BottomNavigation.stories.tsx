import type { Meta, StoryObj } from '@storybook/react';
import { BottomNavigation } from './BottomNavigation';
import { Home, Search, Settings } from 'lucide-react';

const meta: Meta<typeof BottomNavigation> = {
    title: 'Navigation/BottomNavigation',
    component: BottomNavigation,
    };

export default meta;
type Story = StoryObj<typeof BottomNavigation>;

export const Default: Story = {
    render: () => (
        <div className="relative h-[400px] w-mobile border">
            <BottomNavigation
                className="absolute"
                items={[
                    { icon: <Home className="h-5 w-5" />, label: 'Home', active: true },
                    { icon: <Search className="h-5 w-5" />, label: 'Search' },
                    { icon: <Settings className="h-5 w-5" />, label: 'Settings' },
                ]}
            />
        </div>
    ),
};
