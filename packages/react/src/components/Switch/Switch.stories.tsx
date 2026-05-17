import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';
import { Label } from '../Label/Label';

const meta = {
  title: 'Components/Switch',
  component: Switch,
  parameters: { layout: 'centered' }
} satisfies Meta<typeof Switch>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <Label htmlFor="airplane-mode">Airplane Mode</Label>
    </div>
  ),
};

export const Disabled: Story = {
  render: () => (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode-disabled" disabled />
      <Label htmlFor="airplane-mode-disabled">Airplane Mode</Label>
    </div>
  ),
};
