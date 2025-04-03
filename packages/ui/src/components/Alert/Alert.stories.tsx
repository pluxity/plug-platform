import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Button } from '../Button/Button';
import { Alert, AlertTitle, AlertDescription } from './Alert';

const meta: Meta<typeof Alert> = {
    title: 'Components/Alert',
    component: Alert,
    tags: ['autodocs'],
    argTypes: {
        variant: {
            control: { type: 'select' },
            options: ['default', 'success', 'error', 'notice', 'info']
        }
    }
};

export default meta;
type Story = StoryObj<typeof Alert>;

// 알럿 컨트롤러 컴포넌트
const AlertController: React.FC<{
    children: (props: { isOpen: boolean; onClose: () => void }) => React.ReactNode;
  }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => setIsOpen(true);
    const handleClose = () => {
        console.log(isOpen);
        setIsOpen(false);
    }
    
    return (
      <div>
        <Button onClick={handleOpen}>Alert 열기</Button>
        {children({ isOpen, onClose: handleClose })}
      </div>
    );
  };

export const Default : Story = {
    render: (args) => (
        <AlertController>    
            {({ isOpen, onClose }) => (
                <Alert {...args} isOpen={isOpen} onClose={onClose}>
                    <AlertTitle>Alert Title</AlertTitle>
                    <AlertDescription>This is a basic alert.</AlertDescription>
                </Alert>
            )}
        </AlertController>
    )
}

export const Variant : Story = {
    render: () => (
        <>
            <div className="mt-4 mb-2">Variant: default</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose}>
                        <AlertTitle>Alert Title</AlertTitle>
                        <AlertDescription>This is a basic alert.</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: success</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="success">
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your operations was successful!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: error</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="error">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>Sometion went wrong</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: notice</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="notice">
                        <AlertTitle>Notice</AlertTitle>
                        <AlertDescription>This action cannot be undone.</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: info</div>
            <AlertController>    
                {({ isOpen, onClose }) => (
                    <Alert isOpen={isOpen} onClose={onClose} variant="info">
                        <AlertTitle>Info</AlertTitle>
                        <AlertDescription>Be Notice!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
        </>
    )
}

