import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";
import { Bold, Italic, Underline } from "lucide-react";

const meta: Meta = {
  title: "ATOM/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: { type: "radio" },
      options: ["default", "outline"],
    },
    size: {
      control: { type: "radio" },
      options: ["sm", "default", "lg"],
    },
  },
};

export default meta;

export const AllVariants: StoryObj = {
  render: () => (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 items-center">
        <Toggle variant="default" size="sm"><Bold /></Toggle>
        <Toggle variant="default" size="default"><Bold /></Toggle>
        <Toggle variant="default" size="lg"><Bold /></Toggle>
      </div>
      <div className="flex gap-2 items-center">
        <Toggle variant="outline" size="sm"><Underline /></Toggle>
        <Toggle variant="outline" size="default"><Underline /></Toggle>
        <Toggle variant="outline" size="lg"><Underline /></Toggle>
      </div>
    </div>
  )
}

export const TextToggle: StoryObj = {
  render: () => (
    <div className="flex gap-2">
      <Toggle variant="default">Default</Toggle>
      <Toggle variant="outline">Outline</Toggle>
    </div>
  )
}

export const DisabledToggle: StoryObj = {
  args: {
    children: <Italic />,
    disabled: true,
    "aria-label": "Italic",
  },
};

export const InvalidToggle: StoryObj = {
  args: {
    children: "Error",
    "aria-invalid": true,
    variant: "outline",
  },
};

export const CustomStyledToggle: StoryObj = {
  render: () => (
    <Toggle
      isCustom
      bgColor="#f2f2f2"
      activeBgColor="#333"
      textColor="#000"
      iconColor="#ff6600"
    >
      🎨 커스텀
    </Toggle>
  ),
};