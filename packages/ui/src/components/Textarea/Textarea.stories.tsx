import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
    title: 'Component/Textarea',
    tags: ['autodocs'],
}

export default meta;

export const Default: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        
    }
}
export const multi: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        
    }
}