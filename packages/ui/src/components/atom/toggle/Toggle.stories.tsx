import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "./Toggle";
import { Bold, Underline } from "lucide-react";

const meta: Meta = {
  title: "Design System/Toggle",
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

