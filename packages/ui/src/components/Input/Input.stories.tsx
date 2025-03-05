import type { Meta, StoryObj } from '@storybook/react';
import {InputText} from './InputText';

const meta: Meta = {
    title: 'Components/Input',
    tags: ['autodocs'],
    argTypes: {
        invalid: {
            control: 'boolean'
        }
    },
}

export default meta;

export const TextInput: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        labelControl:true,
        placeholder: '텍스트를 입력해주세요',
        disabled: true
    }
}

export const TextInputDisabled: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        placeholder: '텍스트를 입력해주세요',
        disabled: false,
    }
}

