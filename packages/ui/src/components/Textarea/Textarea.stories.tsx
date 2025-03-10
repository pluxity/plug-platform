import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
    title: 'Components/Textarea',
    tags: ['autodocs'],
    args: {
        placeholder: '텍스트를 입력하세요.',
        resize: 'none',
    }
}

export default meta;

export const Default: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '텍스트를 입력하세요.',
    }
}

export const TextareaInvalid: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        invalid: true,
        placeholder: '텍스트를 입력하세요.',
    }
}

export const TextareaDisabled: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '텍스트를 입력하세요.',
        disabled: true
    }
}

export const TextareaResize: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '사이즈를 조절할 수 있습니다.',
        resize: 'both'
    }
}

