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
        iconPosition: {
            control: 'select',
            options: ['leading', 'trailing']
        }
    },
}

export default meta;

export const TextInput: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        labelControl:true,
        labelText: '라벨명',
        placeholder: '텍스트를 입력해주세요',
        helperText: '에러 문구가 노출됩니다. 스타일과 위치는 추가 수정이 있을 수 있습니다.',
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

export const InputIconLeading: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        iconPosition: 'leading',
        placeholder: '텍스트를 입력해주세요',
    }
}

export const PasswordInput: StoryObj<typeof InputPassword> = {
    render: (args) => <InputPassword {...args} />,
    args: {
        labelControl: true,
        labelText: '비밀번호',
        placeholder: '텍스트를 입력해주세요',
        helperText: '에러 문구가 노출됩니다.',
    }
}


