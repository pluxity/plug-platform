import type { Meta, StoryObj } from "@storybook/react"
import { Avatar, AvatarFallback, AvatarImage } from "./Avatar"

const meta: Meta<typeof Avatar> = {
    title: 'ATOM/Avatar',
    component: Avatar,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
   
}

export default meta
type Story = StoryObj<typeof Avatar>

export const Default: Story = {
    render: () => (
        <Avatar>
            <AvatarImage />
            <AvatarFallback>프로필 이미지를 불러올 수 없을 경우 보여줄 텍스트가 들어갑니다.</AvatarFallback>
        </Avatar>
    )
}

export const ImageChange: Story = {
    render: () => (
        <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>프로필 이미지를 불러올 수 없을 경우 보여줄 텍스트가 들어갑니다.</AvatarFallback>
        </Avatar>
    )
}