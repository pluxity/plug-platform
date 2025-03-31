import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import { ko } from 'date-fns/locale'

const meta: Meta<typeof Calendar> = {
    title: 'Components/Calendar',
    component: Calendar,
    tags: ['autodocs'],  
    argTypes: {
        className: { 
            control: 'text' 
        },
        showOutsideDays: { 
            control: 'boolean' 
        },
        locale: { 
            control: 'select', 
            options: [ko] 
        },
        captionLayout: { 
            control: 'select', 
            options: ['default', 'dropdown'] 
        },
        disabled: { 
            control: 'object' 
        },
    }
};

export default meta;

type Story = StoryObj<typeof Calendar>

export const Default: Story = {
    render: () => (
        <Calendar className="w-80" />
    )
}

export const showOutsideDays: Story = {
    render: () => (
        <Calendar className="w-80" showOutsideDays={true}/>
    )
}

export const locale: Story = {
    render: () => (
        <Calendar className="w-80" locale={ko}/>
    )
}

export const captionLayout: Story = {
    render: () => (
        <Calendar className="w-80" captionLayout="dropdown" />
    )
}

export const Disabled: Story = {
    render: () => (
        <Calendar className="w-80" disabled={{ dayOfWeek: [0, 6] }} />
    )
}
