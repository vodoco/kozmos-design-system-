import type { Meta, StoryObj } from '@storybook/react';
import { Navbar } from './Navbar';
import { Button } from '../Button/Button';
import { User } from 'lucide-react';

const meta: Meta<typeof Navbar> = {
    title: 'Navigation/Navbar',
    component: Navbar,
    };

export default meta;
type Story = StoryObj<typeof Navbar>;

export const Default: Story = {
    render: () => (
        <Navbar
            logo={<div className="font-bold text-xl">Kozmos</div>}
            actions={
                <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                </Button>
            }
        >
            <a href="#" className="text-sm font-medium hover:text-primary">
                Dashboard
            </a>
            <a href="#" className="text-sm font-medium hover:text-primary">
                Settings
            </a>
        </Navbar>
    ),
};
