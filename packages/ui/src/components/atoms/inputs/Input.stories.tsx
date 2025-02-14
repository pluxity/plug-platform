import type { Meta, StoryObj } from '@storybook/react';
import Input from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Atoms/Inputs/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['small', 'medium', 'large'] },
    error: { control: 'boolean' },
  },
};

export default meta;

type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text',
    size: 'medium',
    error: false,
  },
};

export const ErrorState: Story = {
  args: {
    placeholder: 'Error input',
    size: 'medium',
    error: true,
  },
};

export const Large: Story = {
  args: {
    placeholder: 'Large input',
    size: 'large',
  },
};
