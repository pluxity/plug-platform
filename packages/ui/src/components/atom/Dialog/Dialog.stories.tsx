import type { Meta, StoryObj } from "@storybook/react"
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
}

export default meta
type Story = StoryObj<typeof Dialog>

export const Default: Story = {
    render: (args) => (
        <Dialog {...args}>
          <DialogTrigger>Open</DialogTrigger>
          <DialogContent>
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
        <DialogContent dimmed>
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