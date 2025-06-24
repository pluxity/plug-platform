import type { Meta, StoryObj } from "@storybook/react"

import { ColorPicker } from "./ColorPicker";
import React from "react";

const meta: Meta<typeof ColorPicker> = {
  title: "Atom/ColorPicker",
  component: ColorPicker,
  tags: ["autodocs"],
  argTypes: {
    color: { control: "color" },
  },
}

export default meta
type Story = StoryObj<typeof ColorPicker>

export const Default: Story = {
    render: (args) => {
        const [color, setColor] = React.useState("");
        return(
            <ColorPicker {...args} color={color} onChange={setColor} />
        )
    }
    
}

