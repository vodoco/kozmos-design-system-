import type { Meta, StoryObj } from '@storybook/react';
import { Chip, ChipGroup } from './Chip';
import { Utensils, Coffee, ShoppingBag, MapPin } from 'lucide-react';
import { useState } from 'react';

const meta = {
  title: 'Components/Chip',
  component: Chip,
  parameters: { layout: 'padded' },
} satisfies Meta<typeof Chip>;
export default meta;
type Story = StoryObj<typeof meta>;

const FilterDemo = () => {
  const [active, setActive] = useState<string>('all');
  
  return (
    <ChipGroup className="max-w-[400px]">
      <Chip active={active === 'all'} onClick={() => setActive('all')}>All Categories</Chip>
      <Chip active={active === 'food'} onClick={() => setActive('food')} icon={<Utensils />}>Food & Drink</Chip>
      <Chip active={active === 'coffee'} onClick={() => setActive('coffee')} icon={<Coffee />}>Coffee</Chip>
      <Chip active={active === 'shopping'} onClick={() => setActive('shopping')} icon={<ShoppingBag />}>Retail</Chip>
      <Chip active={active === 'places'} onClick={() => setActive('places')} icon={<MapPin />}>Points of Interest</Chip>
    </ChipGroup>
  );
};

export const Default: Story = {
  render: () => <FilterDemo />
};
