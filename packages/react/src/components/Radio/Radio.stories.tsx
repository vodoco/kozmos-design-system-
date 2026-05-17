import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './Radio';

const meta: Meta<typeof RadioGroup> = {
    title: 'Inputs/RadioGroup',
    component: RadioGroup,

};

export default meta;
type Story = StoryObj<typeof RadioGroup>;

export const Default: Story = {
    render: () => (
        <RadioGroup defaultValue="option-one">
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-one" />
                <label htmlFor="option-one">Option One</label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-two" />
                <label htmlFor="option-two">Option Two</label>
            </div>
        </RadioGroup>
    ),
};

export const Disabled: Story = {
    render: () => (
        <RadioGroup defaultValue="option-one" disabled>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-one" id="option-disabled-one" />
                <label htmlFor="option-disabled-one" className="text-muted-foreground">Option One</label>
            </div>
            <div className="flex items-center space-x-2">
                <RadioGroupItem value="option-two" id="option-disabled-two" />
                <label htmlFor="option-disabled-two" className="text-muted-foreground">Option Two</label>
            </div>
        </RadioGroup>
    ),
};
