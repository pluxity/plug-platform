import type { Meta, StoryObj } from "@storybook/react"
import {AspectRatio} from "./AspectRatio"

const meta: Meta<typeof AspectRatio> = {
    title: 'Design System/AspectRatio',
    component: AspectRatio,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        ratio: {
            control: 'number',
            description: '비율',
        }
    }
}

export default meta
type Story = StoryObj<typeof AspectRatio>

export const Default: Story = {
    render: (args) => (
        <div className="flex items-center justify-center h-50 w-50">
            <AspectRatio {...args} ratio={16/10}>
                <div className="flex items-center justify-center bg-gray-200 rounded-md w-full h-full text-center">
                    <span className="text-xs">이미지, 비디오 등 일정한 비율로 보여주고 싶을 때 사용하세요.</span>
                </div>
            </AspectRatio>
        </div>
    )
}