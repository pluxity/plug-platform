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
        name: "primary",
        children: (
        <>
          <RadioGroupItem value="primary01">
            Option small 01
          </RadioGroupItem>
          <RadioGroupItem value="primary02">
            Option small 02
          </RadioGroupItem>
          <RadioGroupItem value="primary03">
            Option small 03
          </RadioGroupItem>
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
          <RadioGroupItem value="secondary01">
            Option medium 01
          </RadioGroupItem>
          <RadioGroupItem value="secondary02">
            Option medium 02
          </RadioGroupItem>
          <RadioGroupItem value="secondary03">
            Option medium 03
          </RadioGroupItem>
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
          <RadioGroupItem value="disabled01" disabled>
            Option large 01
          </RadioGroupItem>
          <RadioGroupItem value="disabled02" disabled>
            Option large 02
          </RadioGroupItem>
          <RadioGroupItem value="disabled03" disabled>
            Option large 03
          </RadioGroupItem>
        </>
      ),
    },
}