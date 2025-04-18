import { cn } from '../../utils/classname';
import * as React from 'react';
import { Button } from '../Button/Button';
import CloseIcon from '../../assets/icons/close.svg';
import ErrorIcon from '../../assets/icons/alert_error.svg';
import SuccessIcon from '../../assets/icons/alert_success.svg';
import InfoIcon from '../../assets/icons/alert_info.svg';
import NoticeIcon from '../../assets/icons/alert_notice.svg';
import { Dialog } from '../Dialog/Dialog';
import type { AlertProps } from './Alert.types';

const Alert = ({
    variant = 'default',
    onClose,
    ref,
    className,
    children,
    isOpen,
    ...props
}: AlertProps) => {

    const alertStyle = 'flex gap-3 rounded-lg border border-gray-200 bg-white shadow-sm relative px-4 py-6 w-100';
    
    const alertVariant = {
        default: 'bg-white',
        success: 'bg-green-100',
        error: 'bg-destructive-100',
        notice: 'bg-yellow-100',
        info: 'bg-blue-100',
    }[variant];

    const alertIcon = {
        default: null,
        success: <SuccessIcon />,
        error: <ErrorIcon />,
        notice: <NoticeIcon />,
        info: <InfoIcon />,
    }[variant];

    return (
        <Dialog
            ref={ref}
            closeOnOverlayClick={false}
            closeOnEsc={false}
            isOpen={isOpen}
            onClose={onClose}
            contentClassName={cn(
                alertStyle, 
                alertVariant, 
                className
            )}
            {...props}
        >
            <Button
                variant='ghost'
                size='icon'
                className='absolute top-2 right-2 h-6 w-6 p-0 hover:bg-transparent'
                onClick={onClose}
                aria-label='닫기'
            >
                <CloseIcon />
            </Button>
            {variant !== 'default' && alertIcon}
            <div>{children}</div>
        </Dialog>
    );
};

Alert.displayName = 'Alert';

const AlertTitle = ({
    ref,
    className,
    children,
    ...props
}: React.ComponentProps<'h2'>) => {

    const alertTitleStyle = 'mb-2 font-bold leading-none tracking-tight'
    return (
        <h2
            ref={ref}
            className={cn(
                alertTitleStyle,
                className
            )}
            {...props}
        >
            {children}
        </h2>
    )
}

AlertTitle.displayName = 'AlertTitle';

const AlertDescription = ({
    ref,
    className,
    children,
    ...props
}: React.ComponentProps<'p'>) => {
    return (
        <p
            ref={ref}
            className={cn(
                'text-sm',
                className
            )}
            {...props}
        >
            {children}
        </p>
    )
}

AlertDescription.displayName = 'AlertDescription';


export { Alert, AlertTitle, AlertDescription };