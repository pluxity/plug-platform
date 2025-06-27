import type { Meta, StoryObj } from "@storybook/react"
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTrigger,
} from "./AlertDialog"
import { Button } from "../Button/Button";

const meta: Meta<typeof AlertDialog> = {
    title: 'ATOM/AlertDialog',
    component: AlertDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
      open: {
        description: '다이얼로그의 열림/닫힘 상태',
        control: 'boolean',
        table: {
            type: { summary: 'boolean' },
            defaultValue: { summary: 'false' }
        }
    },
    onOpenChange: {
        description: '다이얼로그 상태 변경 시 호출되는 콜백',
        control: false,
        table: {
                type: { summary: '(open: boolean) => void' }
            }
        }
    },
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
    render: (args) => (
        <AlertDialog {...args}>
            <AlertDialogTrigger asChild>
            <Button variant="outline">Show Dialog</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogDescription>
                    This action cannot be undone. 
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const WithTitle: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Show Dialog (With Title)</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <h2 className="text-lg font-bold">타이틀이 있는 AlertDialog</h2>
          <AlertDialogDescription>
            이 작업은 되돌릴 수 없습니다.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
            <AlertDialogCancel>취소</AlertDialogCancel>
            <AlertDialogAction>확인</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};


  