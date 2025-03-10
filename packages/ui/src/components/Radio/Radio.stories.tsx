import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
    argTypes:{
        variant:{
            control: 'select',
            options: ['primary', 'secondary']
        },
        size:{
            control: 'select',
            options: ['small', 'medium', 'large']
        },
    }
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;
export const Primary: Story = {
    args: {
        variant: 'primary',
        size: 'small',
        name: 'primary',
        children: (
        <>
          <RadioGroupItem value="primary01" label="Option small 01"/>
          <RadioGroupItem value="primary02" label="Option small 02"/>
          <RadioGroupItem value="primary03" label="Option small 03"/>
        </>
      ),
    },
  };

export const Secondary: Story = {
    args: {
        variant: 'secondary',
        size: 'medium',
        name: 'secondary',
        children: (
        <>
          <RadioGroupItem value="secondary01" label="Option medium 01"/>
          <RadioGroupItem value="secondary02" label="Option medium 02"/>
          <RadioGroupItem value="secondary03" label="Option medium 03"/>
        </>
      ),
    },
}

export const Disabled: Story = {
    args: {
        variant: 'primary',
        size: 'large',
        name: 'disabled',
        children: (
        <>
          <RadioGroupItem value="disabled01" label="Option large 01" disabled />
          <RadioGroupItem value="disabled02" label="Option large 02" disabled />
          <RadioGroupItem value="disabled03" label="Option large 03" disabled />
        </>
      ),
    },
}