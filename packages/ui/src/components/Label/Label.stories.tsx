import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';
import Input from '../Input';

const meta: Meta<typeof Label> = {
    title: 'Components/Label',
    component: Label,
    tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id1"></Label>
    ),
    args:{
        children: '기본 라벨 텍스트입니다.'
    }
}
export const Disabled: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id2" disabled></Label>
    ),
    args:{
        children: '비활성화 상태'
    }
}
export const Error: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id3" error></Label>
    ),
    args:{
        children: '에러 상태'
    }
}
export const Focused: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id3" focused></Label>
    ),
    args:{
        children: '포커스 상태'
    }
}
export const Required: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id4" required></Label>
    ),
    args:{
        children: '필수 입력 상태'
    }
}

export const WithInput: Story = {
    render: (args) => (
        <div className="flex gap-1 items-center">
            <Label {...args} htmlFor="label-id5" required></Label>
            <Input.Text id="label-id5" placeholder="텍스트를 입력하세요" />
        </div>
    ),
    args:{
        children: 'Input 등 입력 요소들과 같이 사용 가능합니다.'
    }
}