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
        },
        onClose: { action: 'onClose'},
    }
};

export default meta;
type Story = StoryObj<typeof Alert>;

// 알럿 컨트롤러 컴포넌트
const AlertController: React.FC<{
    children: (props: { isOpen: boolean; }) => React.ReactNode;
  }> = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const handleOpen = () => setIsOpen(true);
    
    return (
      <div>
        <Button onClick={handleOpen}>Alert 열기</Button>
        {children({ isOpen })}
      </div>
    );
  };

export const Default : Story = {
    render: (args) => (
        <AlertController>    
            {({ isOpen  }) => (
                <Alert {...args} isOpen={isOpen} >
                    <AlertTitle>Success</AlertTitle>
                    <AlertDescription>Your operations was successful!</AlertDescription>
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
                {({ isOpen  }) => (
                    <Alert isOpen={isOpen} >
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your operations was successful!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: success</div>
            <AlertController>    
                {({ isOpen  }) => (
                    <Alert isOpen={isOpen} variant="success" >
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your operations was successful!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: error</div>
            <AlertController>    
                {({ isOpen  }) => (
                    <Alert isOpen={isOpen} variant="error" >
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your operations was successful!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: notice</div>
            <AlertController>    
                {({ isOpen  }) => (
                    <Alert isOpen={isOpen} variant="notice" >
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your operations was successful!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
            <div className="mt-4 mb-2">Variant: info</div>
            <AlertController>    
                {({ isOpen  }) => (
                    <Alert isOpen={isOpen} variant="info" >
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>Your operations was successful!</AlertDescription>
                    </Alert>
                )}
            </AlertController>
        </>
    )
}

