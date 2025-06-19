import type { Meta, StoryObj } from "@storybook/react"
import { Label} from "./Label"
import { Checkbox } from "../Checkbox/Checkbox"

const meta: Meta<typeof Label> = {
    title: 'Design System/Label',
    component: Label,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],    
    argTypes: {
        disabled: { control: 'boolean' },
    }
}

export default meta
type Story = StoryObj<typeof Label>

export const Default: Story = {
    render: (args) => (
        <Label {...args}>레이블</Label>
    )
}

export const LabelDemo: Story = {
    render: () => (
        <div>
            <div className="flex items-center space-x-2">
                <Checkbox id="terms" />
                <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
        </div>
    )
}

export const LabelDemoDisabled: Story = {
    render: () => (
        <div>
            <div className="flex items-center space-x-2 opacity-60 cursor-not-allowed">
                <Checkbox id="terms-disabled" disabled />
                <Label htmlFor="terms-disabled">
                    Accept terms and conditions 
                </Label>
            </div>
        </div>
    )
}

