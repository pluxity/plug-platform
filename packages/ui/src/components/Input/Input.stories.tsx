import type { Meta, StoryObj } from '@storybook/react';
import {InputText} from './InputText';
import {InputPassword} from './InputPassword';

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
    },
}

export default meta;

export const TextInput: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        placeholder: '텍스트를 입력해주세요',
        iconPosition: 'leading'
    }
}

export const TextInputInvalid: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        placeholder: '텍스트를 입력해주세요',
        invalid: true,
    }
}

export const TextInputDisabled: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        placeholder: '텍스트를 입력해주세요',
        disabled: true,
    }
}

export const PasswordInput: StoryObj<typeof InputPassword> = {
    render: (args) => <InputPassword {...args} />,
    args: {
        placeholder: '텍스트를 입력해주세요',
    }
}


