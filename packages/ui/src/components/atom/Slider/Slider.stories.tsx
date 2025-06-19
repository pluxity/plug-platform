import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "ATOM/Slider",
  component: Slider,
  tags: ["autodocs"],
  argTypes: {
    orientation: {
      control: "radio",
      options: ["horizontal", "vertical"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {
    defaultValue: [50],
    min: 0,
    max: 100,
  },
};

export const Range: Story = {
  args: {
    defaultValue: [20, 80],
    min: 0,
    max: 100,
  },
};

export const Vertical: Story = {
  args: {
    defaultValue: [40],
    orientation: "vertical",
    min: 0,
    max: 100,
    className: "h-64",
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: [60],
    disabled: true,
    min: 0,
    max: 100,
  },
};
