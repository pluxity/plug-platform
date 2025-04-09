import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup } from '../Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
    argTypes:{
        color:{
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
        color: 'primary',
        size: 'small',
        name: 'primary',
        children: (
        <>
          <RadioGroup name="primary">
            <RadioGroup.Item value="primary01" label="Option small 01"/>
            <RadioGroup.Item value="primary02" label="Option small 02"/>
            <RadioGroup.Item value="primary03" label="Option small 03"/>
          </RadioGroup>
        </>
      ),
    },
  };

export const Secondary: Story = {
    args: {
        color: 'secondary',
        size: 'medium',
        name: 'secondary',
        children: (
        <>
          <RadioGroup name="secondary">
            <RadioGroup.Item value="primary01" label="Option small 01"/>
            <RadioGroup.Item value="primary02" label="Option small 02"/>
            <RadioGroup.Item value="primary03" label="Option small 03"/>
          </RadioGroup>
        </>
      ),
    },
}

export const Disabled: Story = {
    args: {
        color: 'primary',
        size: 'large',
        name: 'disabled',
        children: (
        <>
          <RadioGroup name="disabled" disabled>
            <RadioGroup.Item value="disabled01" label="Option large 01" />
            <RadioGroup.Item value="disabled02" label="Option large 02" />
            <RadioGroup.Item value="disabled03" label="Option large 03" />
          </RadioGroup>
        </>
      ),
    },
}