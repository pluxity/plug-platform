import type { Meta, StoryObj } from '@storybook/react';
import {InputText} from './InputText';
import {InputIcon} from './InputIcon';
import {InputList, InputListItem} from './InputList';

const meta: Meta = {
    title: 'Components/Input',
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['text', 'outline']
        },
        invalid: {
            control: 'boolean'
        }
    },
}

export default meta;

export const TextInput: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        placeholder: '텍스트를 입력해주세요',
        labelControl: true,
    }
}

export const TextInputOutline: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        invalid: true,
        placeholder: '텍스트를 입력해주세요'
    }
}

export const TextInputDisabled: StoryObj<typeof InputText> = {
    render: (args) => <InputText {...args} />,
    args:{
        placeholder: '텍스트를 입력해주세요',
        disabled : true
    }
}

export const IconInputPassword: StoryObj<typeof InputIcon> = {
    render: (args) => <InputIcon {...args} />,
    args:{
        type: 'password', 
        position: 'right',
        placeholder: '텍스트를 입력해주세요',
        disabled: true,
        invalid: false,
    }
}

export const IconInputText: StoryObj<typeof InputIcon> = {
    render: (args) => <InputIcon {...args} />,
    args:{
        type: 'text', 
        position: 'left',
        placeholder: '텍스트를 입력해주세요',
        disabled: false,
        invalid: true,
    }
}

export const ListInput: StoryObj<typeof InputList> = {
    render: (args) => (
      <InputList {...args} >
        <InputListItem value="선택 1번"/>
        <InputListItem value="선택 2번" />
        <InputListItem value="선택 3번" />
        <InputListItem value="선택 4번" />
        <InputListItem value="선택 5번" />
        <InputListItem value="선택 6번" />
        <InputListItem value="선택 7번" />
        <InputListItem value="선택 8번" />
        <InputListItem value="선택 9번" />
      </InputList>
    ),
    args: {
        invalid: false,
        disabled: false,
    },
}