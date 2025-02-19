import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes:{
        variant:{
            control: 'select',
            options: ['primary', 'secondary']
        },
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        }
    }

}

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Primary: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        children: 'checkbox'
    }
}