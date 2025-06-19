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
    title: 'Design System/AlertDialog',
    component: AlertDialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs']
}

export default meta
type Story = StoryObj<typeof AlertDialog>

export const Default: Story = {
    render: () => (
        <AlertDialog>
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

  