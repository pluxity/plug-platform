import type { Meta, StoryObj } from '@storybook/react';
import Time from './Time';

const meta: Meta<typeof Time> = {
  title: 'Components/Time',
  component: Time,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary'],
    },
    size: {
      control: 'select',
      options: ['small', 'medium', 'large'],
    },
    format:{
      control: 'select',
      options:[
        'HH:mm:ss', 'HH시 mm분 ss초', 'YYYY-MM-DD' , 'YYYY년 MM월 DD일',
        'YYYY년 MM월 DD일 HH:mm:ss', 'YYYY년 MM월 DD일 HH시 mm분 ss초',
        'YYYY년 MM월 DD일(요일)', 'HH:mm', 'HH시 mm분'
      ]
    }
  },
};

export default meta;

type Story = StoryObj<typeof Time>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    size:'small',
    format : 'YYYY-MM-DD HH:mm:ss',
  },
};



