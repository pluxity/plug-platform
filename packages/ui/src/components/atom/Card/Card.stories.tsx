import type { Meta, StoryObj } from "@storybook/react";
import { 
    Card,
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent, 
    CardFooter
} from "./Card";
import { Button } from "../Button/Button";
import { AspectRatio } from "../AspectRatio/AspectRatio";

const meta: Meta<typeof Card> = {
    title: 'ATOM/Card',
    component: Card,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],    
    argTypes:{
        className: {
            control: 'text',
            description: 'className',
        },
    }
}

export default meta
type Story = StoryObj<typeof Card>

export const Default: Story = {
    render: () => (
        <Card className="max-w-xs rounded-md shadow-sm border border-gray-100 overflow-hidden">
            <CardHeader>
                <AspectRatio ratio={16/10}>
                    <div className="flex items-center justify-center bg-gray-200 w-full h-full text-center rounded-sm">
                        <span className="text-xs">이미지, 비디오 등 일정한 비율로 보여주고 싶을 때 사용하세요.</span>
                    </div>
                </AspectRatio>
            </CardHeader>
            <CardContent>
                <CardTitle className="text-lg font-bold mb-1">강남역</CardTitle>
                <CardDescription className="text-sm mb-2">서울특별시 강남구 강남대로 지하 396</CardDescription>
            </CardContent>
            <CardFooter className="flex-col gap-2">
                <Button variant="secondary" className="w-full">취소</Button>
                <Button className="w-full">확인</Button>
            </CardFooter>
        </Card>
    )
}


