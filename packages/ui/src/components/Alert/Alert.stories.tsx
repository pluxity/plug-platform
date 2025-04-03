import type { Meta, StoryObj } from '@storybook/react';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const meta: Meta<typeof Alert> = {
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'success', 'error', 'notice', 'info']
        },
        closable: {
            control: 'boolean',
            description: '닫기 버튼 표시 여부',
            defaultValue: false
          },
        onClose: { action: 'onClose'},
    }
};

export default meta;

type Story = StoryObj<typeof Alert>;

export const Default : Story = {
    render: (args) => (
        <Alert {...args}>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>This is a basic alert.</AlertDescription>
        </Alert>
    )
}

export const Variant : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Variant: default</div>
            <Alert>
                <AlertTitle>Alert Title</AlertTitle>
                <AlertDescription>This is a basic alert.</AlertDescription>
            </Alert>
            <div className="mt-4 mb-2">Variant: success</div>
            <Alert variant='success'>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your oerations was successful!</AlertDescription>
            </Alert>
            <div className="mt-4 mb-2">Variant: error</div>
            <Alert variant='error'>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Sometion went wrong</AlertDescription>
            </Alert>
            <div className="mt-4 mb-2">Variant: error</div>
            <Alert variant='notice'>
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>This action cannot be undone.</AlertDescription>
            </Alert>
            <div className="mt-4 mb-2">Variant: error</div>
            <Alert variant='info'>
                <AlertTitle>Info</AlertTitle>
                <AlertDescription>Be Notice!</AlertDescription>
            </Alert>
        </>
    )
}

export const Closeable : Story = {
    render: (args) => (
        <Alert {...args} closable>
            <AlertTitle>Alert Title</AlertTitle>
            <AlertDescription>This is a basic alert.</AlertDescription>
        </Alert>
    )
}