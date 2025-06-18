import type { Meta, StoryObj } from "@storybook/react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "./AlertDialog"
import { Button } from "../Button/Button";

const meta: Meta<typeof AlertDialog> = {
    title: 'atom/AlertDialog',
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
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
  
  