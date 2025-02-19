import type { Meta, StoryObj } from '@storybook/react';
import Time from './Time';

const meta: Meta<typeof Time> = {
  title: 'Components/Time',
  component: Time,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['black', 'white'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    format:{
      control: 'select',
      options:['HH:mm:ss', 'HH:mm', 'YYYY-MM-DD', 'locale']
    }
  },
};

export default meta;

type Story = StoryObj<typeof Time>;

export const Primary: Story = {
  args: {
    variant: 'black',
    size:'small',
    format : 'YYYY-MM-DD HH:mm:ss',
  },
};



