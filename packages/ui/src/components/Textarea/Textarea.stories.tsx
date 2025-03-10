import type { Meta, StoryObj } from '@storybook/react';
import Textarea from './index';

const meta: Meta = {
    title: 'Components/Textarea',
    tags: ['autodocs'],
    argTypes:{
        disabled: {
            control: 'boolean'
        },
        invalid: {
            control: 'boolean'
        },
        resize:{
            control: 'select',
            options: ['both', 'horizontal', 'vertical', 'none']
        }
    }
}

export default meta;

export const Default: StoryObj = {
    render: (args) => (
        <Textarea {...args} 
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const TextareaInvalid: StoryObj = {
    render: (args) => (
        <Textarea {...args} 
            invalid={true}
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const TextareaDisabled: StoryObj = {
    render: (args) => (
        <Textarea {...args} 
            disabled={true}
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const TextareaResize: StoryObj = {
    render: (args) => (
        <Textarea {...args} 
            resize='both'
            placeholder='사이즈를 조절할 수 있습니다.'
        />
    ),
}

export const TextareaWithHelperText: StoryObj = {
    render: (args) => (
        <Textarea.Box {...args}>
            <Textarea placeholder='텍스트를 입력해주세요' />
            <Textarea.HelperText>에러 문구 등 안내 문구 영역</Textarea.HelperText>
        </Textarea.Box>
    ),
}