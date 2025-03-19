import type { Meta, StoryObj } from '@storybook/react';
import { Switch } from './Switch';

const meta: Meta<typeof Switch> = {
    title: 'Components/Switch',
    component: Switch,
    tags: ['autodocs'],
}

export default meta;
type Story = StoryObj<typeof Switch>;

export const Default: Story = {
    render: (args) => (
        <Switch {...args} label="레이블 문구가 들어갑니다."></Switch>
    ),
}

export const OnlyInput: Story = {
    render: (args) => (
        <Switch {...args} defaultChecked ></Switch>
    ),
}

export const Disabled: Story = {
    render: (args) => (
        <Switch {...args} disabled></Switch>
    ),
}