import type { Meta, StoryObj } from '@storybook/react';
import { Textarea } from './Textarea';

const meta: Meta<typeof Textarea> = {
    title: 'Components/Textarea',
    tags: ['autodocs'],
    argTypes:{
        resize:{
            control: 'select',
            options: ['both', 'horizontal', 'vertical', 'none']
        }
    }
}

export default meta;

export const Default: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '텍스트를 입력하세요.',
        resize: 'none',
        helperControl:true,
        helperText:'에러 문구가 노출됩니다. 스타일과 위치는 추가 수정이 있을 수 있습니다.'
    }
}

export const Invalid: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        invalid: true,
        placeholder: '텍스트를 입력하세요.',
    }
}

export const Disabled: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '텍스트를 입력하세요.',
        disabled: true
    }
}

export const Resize: StoryObj<typeof Textarea> = {
    render: (args) => <Textarea {...args} />,
    args: {
        placeholder: '사이즈 조절할 수 있습니다.',
        resize: 'both'
    }
}