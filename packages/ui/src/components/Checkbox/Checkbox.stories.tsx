import type { Meta, StoryObj } from '@storybook/react';
import Checkbox from './Checkbox';

const meta: Meta<typeof Checkbox> = {
    title: 'Components/Checkbox',
    component: Checkbox,
    tags: ['autodocs'],
    argTypes:{
        variant:{
            control: 'select',
            options: ['primary']
        },
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        },
        boxcolor:{
            control: 'select',
            options: ['primary', 'secondary']
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
        boxcolor: 'primary',
        children: 'checkbox'
    }
}

export const OnlyInput: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        boxcolor: 'secondary',
        children: ''
    }
}

export const Disabled: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        boxcolor: 'primary',
        children: 'checkbox',
        disabled: true
    }
}