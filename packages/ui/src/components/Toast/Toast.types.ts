import type { Placement } from '../types';

export interface ToastPortalProps {
    children: React.ReactNode;
}

export interface ToastProps extends React.ComponentProps<'div'>{
    variant?: 'default' | 'normal' | 'warning' | 'critical';
    placement?: Placement;
    closable?: boolean;
    duration?: number;
    autoClose?: boolean;
    autoCloseDuration?: number;
    isOpen: boolean;
    onClose?: () => void;
}

export interface ToastTitleProps extends React.ComponentProps<'h2'>{}

export interface ToastDescriptionProps extends React.ComponentProps<'p'>{}