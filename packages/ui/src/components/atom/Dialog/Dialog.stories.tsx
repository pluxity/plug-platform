import type { Meta, StoryObj } from "@storybook/react";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./Dialog";

import { Button } from "../Button/Button";

const meta: Meta<typeof Dialog> = {
    title: 'ATOM/Dialog',
    component: Dialog,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],    
    argTypes: {
      open: {
        control: 'boolean',
        description: '다이얼로그의 열림/닫힘 상태를 제어합니다',
      },
      defaultOpen: {
        control: 'boolean',
        description: '다이얼로그의 초기 열림 상태를 설정합니다',
      },
      onOpenChange: {
        description: '다이얼로그 상태가 변경될 때 호출되는 콜백 함수',
      },
    },
  }

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
    render: (args) => (
        <Dialog {...args}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent title="도면 수정">
            <DialogHeader>
              <DialogTitle>Are you absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your account
                and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline">취소</Button>
              <Button>저장</Button>
            </DialogFooter>
          </DialogContent>
      </Dialog>
    )
}

export const OverlayDimmed: Story = {
  render: () => (
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent title="도면 수정" dimmed disableBackground={true}>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your account
              and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline">취소</Button>
            <Button>저장</Button>
          </DialogFooter>
        </DialogContent>
    </Dialog>
  )
}