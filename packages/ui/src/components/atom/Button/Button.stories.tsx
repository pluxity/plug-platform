import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./Button";
import { PlusIcon } from "lucide-react";

const meta: Meta<typeof Button> = {
    title: 'ATOM/Button',
    component: Button,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: 'select',
            options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
            description: '버튼 유형',
        },
        size: {
            control: 'select',
            options: ['default', 'sm', 'lg', 'icon'],
            description: '버튼 크기',
        },
        disabled: {
            control: 'boolean',
            description: '버튼 비활성화 여부',
        }
    }
}

export default meta
type Story = StoryObj<typeof Button>

export const Default: Story = {
    render: (args) => (
        <Button {...args}>기본 버튼</Button>
    )
}

export const SizeComparison: Story = {
    render: () => (
        <div className="flex gap-4 items-center">
            <Button size="sm">Small</Button>
            <Button size="default">Default</Button>
            <Button size="lg">Large</Button>
        </div>
    )
}

export const VariantComparison: Story = {
    render: () => (
        <div className="flex gap-4 items-center">
            <Button variant="default">Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
        </div>
    )
}

export const WithIcon: Story = {
    render: () => (
        <div className="flex gap-4 items-center">
            <Button>
                <PlusIcon />
                    아이콘 
                <PlusIcon />
            </Button>
            <Button variant="secondary">
                <PlusIcon />
                    아이콘
                <PlusIcon />
            </Button>
            <Button variant="outline">
                <PlusIcon />
                    아이콘 
                <PlusIcon />
            </Button>
            <Button variant="link">
                <PlusIcon />
                    링크
                <PlusIcon />
            </Button>
            <div className="bg-[#6B7482] rounded-sm">
                <Button variant="link" onBackground>
                    <PlusIcon />
                        배경위 링크
                    <PlusIcon />
                </Button>
            </div>
        </div>
    )
}