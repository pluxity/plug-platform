import type { Meta, StoryObj } from '@storybook/react';
import { Label } from './Label';

const meta: Meta<typeof Label> = {
    title: 'Components/Label',
    component: Label,
    tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof Label>;

export const Default: Story = {
    render: (args) => (
        <Label {...args} htmlFor="label-id"></Label>
    ),
    args:{
        children: '기본 라벨 텍스트입니다.'
    }
}