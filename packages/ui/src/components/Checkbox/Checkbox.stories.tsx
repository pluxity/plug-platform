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
        },
        disabled:{
            boolean: false,
        }
    }

}

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        children: 'checkbox'
    }
}

export const OnlyInput: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        children: ''
    }
}

export const Disabled: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        children: 'checkbox',
        disabled: true
    }
}