import type { Meta, StoryObj } from '@storybook/react';
import Button from './BasicButton';

const meta: Meta<typeof Button> = {
  title: 'Components/Atoms/Buttons/BasicButton',
  component: Button,
  tags: ['autodocs'], // Storybook 8.5에 추가된 기능: 자동 문서화
  argTypes: {
    variant: { control: 'select', options: ['text', 'outlined', 'icon'] },
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    color: { control: 'select', options: ['primary', 'secondary', 'transparent'] },
    isLoading: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: 'Button',
    variant: 'text',
    size: 'medium',
    color: 'primary',
    isLoading: false,
  },
};

export const Outlined: Story = {
  args: {
    children: 'Outlined Button',
    variant: 'outlined',
    size: 'medium',
    color: 'secondary',
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading Button',
    isLoading: true,
  },
};
