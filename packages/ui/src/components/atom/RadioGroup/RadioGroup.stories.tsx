import type { Meta, StoryObj } from "@storybook/react"
import { RadioGroup, RadioGroupItem } from "./RadioGroup"
import { useState } from "react";

const meta: Meta = {
  title: "ATOM/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
}

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: function Render() {
    const [value, setValue] = useState("apple")

    return (
      <form className="space-y-4 p-6">
        <RadioGroup value={value} onValueChange={setValue}>
          <label className="flex items-center gap-3 text-sm">
            <RadioGroupItem value="apple" id="r1" />
            사과
          </label>
          <label className="flex items-center gap-3 text-sm">
            <RadioGroupItem value="banana" id="r2" />
            바나나
          </label>
          <label className="flex items-center gap-3 text-sm">
            <RadioGroupItem value="cherry" id="r3" />
            체리
          </label>
        </RadioGroup>
        <div className="text-xs text-gray-500">선택된 값: {value}</div>
      </form>
    )
  },
}
