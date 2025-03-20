import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './index'; 

const meta: Meta = {
    title: 'Components/Input',
    tags: ['autodocs'],
    argTypes: {
        disabled: {
            control: 'boolean'
        },
        invalid: {
            control: 'boolean'
        },
        iconPosition: {
            control: 'select',
            options: ['leading', 'trailing']
        }
    },
}

export default meta;

export const TextInput: StoryObj = {
    render: (args) => (
        <Input.Text {...args} 
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const TextInputInvalid: StoryObj = {
    render: (args) => (
        <Input.Text {...args} 
            invalid={true}
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const TextInputDisabled: StoryObj = {
    render: (args) => (
        <Input.Text {...args} 
            disabled={true}
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const PasswordInput: StoryObj = {
    render: (args) => (
        <Input.Password {...args} 
            placeholder='텍스트를 입력해주세요'
        />
    ),
}

export const InputWithLabel: StoryObj = {
    render: (args) => (
        <Input.Box {...args}>
            <Input.Label>이름</Input.Label>
            <Input.Text placeholder='이름을 입력해주세요' />
        </Input.Box>
    ),
}

export const InputWithHelperText: StoryObj = {
    render: (args) => (
        <Input.Box {...args}>
            <Input.Label>이름</Input.Label>
            <Input.Text placeholder='이름을 입력해주세요' />
            <Input.HelperText>에러 문구 등 안내 문구 영역</Input.HelperText>
        </Input.Box>
    ),
}





