import type { Placement } from '../types';

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