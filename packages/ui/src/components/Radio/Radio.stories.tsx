import type { Meta, StoryObj } from '@storybook/react';
import { RadioGroup, RadioGroupItem } from './Radio';

const meta: Meta<typeof RadioGroup> = {
  title: 'Components/Radio',
  component: RadioGroup,
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof RadioGroup>;
export const Primary: Story = {
    args: {
      children: (
        <>
          <RadioGroupItem value="primary01" name="primary" variant="primary" size="small">
            Option small 01
          </RadioGroupItem>
          <RadioGroupItem value="primary02" name="primary" variant="primary" size="small">
            Option small 02
          </RadioGroupItem>
          <RadioGroupItem value="primary03" name="primary" variant="primary" size="small">
            Option small 03
          </RadioGroupItem>
        </>
      ),
    },
  };

export const Secondary: Story = {
    args: {
      children: (
        <>
          <RadioGroupItem value="secondary01" name="secondary" variant="secondary" size="medium">
            Option medium 01
          </RadioGroupItem>
          <RadioGroupItem value="secondary02" name="secondary" variant="secondary" size="medium">
            Option medium 02
          </RadioGroupItem>
          <RadioGroupItem value="secondary03" name="secondary" variant="secondary" size="medium">
            Option medium 03
          </RadioGroupItem>
        </>
      ),
    },
}

export const Disabled: Story = {
    args: {
      children: (
        <>
          <RadioGroupItem value="disabled01" name="disabled" variant="primary" size="large" disabled>
            Option large 01
          </RadioGroupItem>
          <RadioGroupItem value="disabled02" name="disabled" variant="primary" size="large" disabled>
            Option large 02
          </RadioGroupItem>
          <RadioGroupItem value="disabled03" name="disabled" variant="primary" size="large" disabled>
            Option large 03
          </RadioGroupItem>
        </>
      ),
    },
}