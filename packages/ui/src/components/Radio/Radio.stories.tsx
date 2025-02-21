import type { Meta, StoryObj } from '@storybook/react';
import Radio from './Radio';

const meta: Meta<typeof Radio > = {
    title: 'Components/Radio',
    component: Radio,
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

type Story = StoryObj<typeof Radio>;

export const Default: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        value: 'radio',
        children: 'radio'
    }
}

export const Disabled: Story = {
    args:{
        variant: 'primary',
        size: 'small',
        value: 'radio',
        children: 'radio',
        disabled: true
    }
}