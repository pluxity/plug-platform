import type { Meta, StoryObj } from "@storybook/react"
import * as React from "react"
import { DatePicker } from "./DatePicker"

const meta: Meta<typeof DatePicker> = {
  title: 'Molecule/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
}
export default meta
type Story = StoryObj<typeof DatePicker>

export const Default: Story = {
  render: function Render(args) {
    const [date, setDate] = React.useState<Date>()
    return (
      <DatePicker
        {...args}
        value={date}
        onChange={setDate}
        placeholder="Pick a date"
      />
    )
  }
}