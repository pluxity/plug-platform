import type { Meta, StoryObj } from "@storybook/react"
import { Alert, AlertDescription, AlertTitle } from "./Alert"
import { 
  AlertCircleIcon, 
  CheckCircle2Icon, 
  PopcornIcon,
  InfoIcon,
  TriangleAlertIcon,
  XCircleIcon,
  BellIcon,
  ShieldIcon,
  ZapIcon,
} from "lucide-react"

const meta: Meta<typeof Alert> = {
  title: 'Design System/Alert',
  component: Alert,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive'],
      description: '알림 유형',
    }
  }
}

export default meta
type Story = StoryObj<typeof Alert>

export const Default: Story = {
    render: (args) => (
        <Alert {...args}>
            <AlertTitle>Heads up!</AlertTitle>
            <AlertDescription>
                You can add components and dependencies to your app using the cli.
            </AlertDescription>
        </Alert>
    )
}

export const WithIcons: Story = {
    render: () => (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert>
                <CheckCircle2Icon className="h-4 w-4" />
                <AlertTitle>Success! Your changes have been saved</AlertTitle>
                <AlertDescription>
                    This is an alert with icon, title and description.
                </AlertDescription>
            </Alert>
            <Alert>
                <PopcornIcon className="h-4 w-4" />
                <AlertTitle>
                    This Alert has a title and an icon. No description.
                </AlertTitle>
            </Alert>
            <Alert variant="destructive">
                <AlertCircleIcon className="h-4 w-4" />
                <AlertTitle>Unable to process your payment.</AlertTitle>
                <AlertDescription>
                    <p>Please verify your billing information and try again.</p>
                    <ul className="list-inside list-disc text-sm">
                        <li>Check your card details</li>
                        <li>Ensure sufficient funds</li>
                        <li>Verify billing address</li>
                    </ul>
                </AlertDescription>
            </Alert>
        </div>
    )
}

export const InfoAlert: Story = {
    render: () => (
        <Alert>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
                This is an informational alert with an info icon.
            </AlertDescription>
        </Alert>
    )
}

export const WarningAlert: Story = {
    render: () => (
        <Alert>
            <TriangleAlertIcon className="h-4 w-4" />
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>
                This is a warning alert with a warning icon.
            </AlertDescription>
        </Alert>
    )
}

export const ErrorAlert: Story = {
    render: () => (
        <Alert variant="destructive">
            <XCircleIcon className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                This is an error alert with an X circle icon.
            </AlertDescription>
        </Alert>
    )
}

export const NotificationAlert: Story = {
    render: () => (
        <Alert>
            <BellIcon className="h-4 w-4" />
            <AlertTitle>New Notification</AlertTitle>
            <AlertDescription>
                You have a new message in your inbox.
            </AlertDescription>
        </Alert>
    )
}

export const SecurityAlert: Story = {
    render: () => (
        <Alert>
            <ShieldIcon className="h-4 w-4" />
            <AlertTitle>Security Update</AlertTitle>
            <AlertDescription>
                Your account security has been updated successfully.
            </AlertDescription>
        </Alert>
    )
}

export const LightningAlert: Story = {
    render: () => (
        <Alert>
            <ZapIcon className="h-4 w-4" />
            <AlertTitle>Quick Action</AlertTitle>
            <AlertDescription>
                This is a quick action alert with a lightning icon.
            </AlertDescription>
        </Alert>
    )
}

export const AllIconsDemo: Story = {
    render: () => (
        <div className="grid w-full max-w-xl items-start gap-4">
            <Alert>
                <CheckCircle2Icon className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Operation completed successfully.</AlertDescription>
            </Alert>
            
            <Alert>
                <InfoIcon className="h-4 w-4" />
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>Here's some useful information.</AlertDescription>
            </Alert>
            
            <Alert>
                <TriangleAlertIcon className="h-4 w-4" />
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>Please proceed with caution.</AlertDescription>
            </Alert>
            
            <Alert variant="destructive">
                <XCircleIcon className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Something went wrong. Please try again.</AlertDescription>
            </Alert>
            
            <Alert>
                <BellIcon className="h-4 w-4" />
                <AlertTitle>Notification</AlertTitle>
                <AlertDescription>You have new notifications.</AlertDescription>
            </Alert>
            
            <Alert>
                <ShieldIcon className="h-4 w-4" />
                <AlertTitle>Security</AlertTitle>
                <AlertDescription>Your account is secure.</AlertDescription>
            </Alert>
            
            <Alert>
                <ZapIcon className="h-4 w-4" />
                <AlertTitle>Quick Action</AlertTitle>
                <AlertDescription>Fast and efficient operation.</AlertDescription>
            </Alert>
            
            <Alert>
                <PopcornIcon className="h-4 w-4" />
                <AlertTitle>Entertainment</AlertTitle>
                <AlertDescription>Time for some fun!</AlertDescription>
            </Alert>
        </div>
    )
}