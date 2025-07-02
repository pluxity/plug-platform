import type { Meta, StoryObj } from "@storybook/react";
import { ColorPicker } from "./ColorPicker";
import { useState } from "react";

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
  render: function Render(args) {
        const [color, setColor] = useState("");
        return(
            <ColorPicker {...args} color={color} onChange={setColor} />
        )
    }
}

export const ShowResult: Story = {
  render: function Render(args) {
        const [color, setColor] = useState("");
        return(
          <div className="flex flex-col gap-2">
            <ColorPicker {...args} color={color} onChange={setColor} />
            {
              color && (
                <div className="flex items-center gap-2">
                  <span 
                    className="w-8 h-8 rounded-full" 
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-sm text-gray-600">{color}</span>
                </div>
              )
            }

          </div>
        )
    }
}
