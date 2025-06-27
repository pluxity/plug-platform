import type { Meta, StoryObj } from "@storybook/react"
import { Badge } from "./Badge"
import { CheckIcon } from "lucide-react"

const meta: Meta<typeof Badge> = {
    title: 'ATOM/Badge',
    component: Badge,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'secondary', 'destructive', 'outline'],
            description: '뱃지 유형',
        },
    }
}

export default meta
type Story = StoryObj<typeof Badge>

export const Default: Story = {
    render: (args) => (
        <Badge {...args}>Badge</Badge>
    )
}

export const VariantComparison: Story = {
    render: () => (
        <div className="flex gap-4 items-center">
            <Badge variant="default">Default</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="destructive">Destructive</Badge>
            <Badge variant="outline">Outline</Badge>
        </div>
    )
}

export const WithIcon: Story = {
    render: () => (
        <Badge>
            <CheckIcon className="w-3 h-3 mr-1" />
            아이콘 뱃지
        </Badge>
    )
}

export const Custom: Story = {
    render: () => (
        <Badge className="bg-point-blue h-10">custom badge</Badge>
    )
}