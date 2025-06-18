import type { Meta, StoryObj } from "@storybook/react";
import {
  ToggleGroup,
  ToggleGroupItem,
} from "./ToggleGroup";
import { Bold, Italic, Underline } from "lucide-react";

const meta: Meta = {
  title: "MOLECULE/ToggleGroup",
  component: ToggleGroup,
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
    type: {
      control: { type: "radio" },
      options: ["single", "multiple"],
    },
  },
};

export default meta;

export const Single: StoryObj = {
  args: {
    type: "single",
    variant: "outline",
    size: "default",
    defaultValue: "bold",
  },
  render: () => (
    <ToggleGroup type="single">
      <ToggleGroupItem value="bold" aria-label="Bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Italic">
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const Multiple: StoryObj = {
  args: {
    type: "multiple",
    variant: "default",
    size: "lg",
    defaultValue: ["react", "vue"],
  },
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="react">React</ToggleGroupItem>
      <ToggleGroupItem value="vue">Vue</ToggleGroupItem>
      <ToggleGroupItem value="svelte">Svelte</ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const WithDisabledItem: StoryObj = {
  args: {
    type: "multiple",
    variant: "outline",
    size: "default",
    defaultValue: ["bold"],
  },
  render: () => (
    <ToggleGroup type="multiple">
      <ToggleGroupItem value="bold">
        <Bold />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" disabled>
        <Italic />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline">
        <Underline />
      </ToggleGroupItem>
    </ToggleGroup>
  ),
};

export const ToggleGroupCustomStyled: StoryObj = {
    render: () => (
      <ToggleGroup type="multiple">
        <ToggleGroupItem
          value="custom1"
          className="bg-[#f1f1f1] text-black data-[state=on]:bg-[#333333] data-[state=on]:text-white"
        >
          🐣 커스텀1
        </ToggleGroupItem>
        <ToggleGroupItem
          value="custom2"
          className="bg-[#ffe4e1] text-black data-[state=on]:bg-[#ff1493] data-[state=on]:text-white"
        >
          🎨 커스텀2
        </ToggleGroupItem>
      </ToggleGroup>
    ),
};