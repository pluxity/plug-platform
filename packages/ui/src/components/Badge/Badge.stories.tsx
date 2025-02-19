import type { Meta, StoryObj } from '@storybook/react';
import Badge from './Badge';

const meta: Meta<typeof Badge> = {
    title: 'Components/Badge',
    component: Badge,
    tags: ['autodocs'],
    argTypes : {
        variant: {
            control : 'select',
            options : ['primary', 'destructive'],
        },
        size: {
            control : 'select',
            options : ['xsmall', 'small', 'medium', 'large'],
        }
    }   
};

export default meta;

type Story = StoryObj<typeof Badge>

export const Primary: Story = {
    args: {
      variant: 'primary',
      size:'xsmall',
      children: 'message',
      label: 'badge'
    },
  };

  export const Destructive: Story = {
    args: {
      variant: 'destructive',
      size:'xsmall',
      children: 'notice',
      label: 'badge'
    },
  };
  

