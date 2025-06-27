import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react"
import { MultiSelect } from "./MultiSelect"

const meta: Meta<typeof MultiSelect> = {
  title: "ATOM/MultiSelect",
  component: MultiSelect,
  tags: ["autodocs"],
  args: {
    placeholder: "과일을 선택하세요",
    options: [
      { label: "Apple", value: "apple" },
      { label: "Banana", value: "banana" },
      { label: "Cherry", value: "cherry" },
      { label: "Grape", value: "grape" },
      { label: "Watermelon", value: "watermelon" },
    ],
  },
}
export default meta

type Story = StoryObj<typeof MultiSelect>

export const Default: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string[]>([])

    return (
      <div className="p-6">
        <MultiSelect {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}

export const PreSelected: Story = {
  render: function Render(args) {
    const [value, setValue] = useState<string[]>(["apple", "banana"])

    return (
      <div className="p-6">
        <MultiSelect {...args} value={value} onChange={setValue} />
      </div>
    )
  },
}
