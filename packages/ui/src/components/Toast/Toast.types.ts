export interface ToastProps extends React.ComponentProps<'div'>{
    variant?: 'default' | 'normal' | 'warning' | 'critical';
    placement?: 'top' | 'topStart' | 'topEnd' | 'bottom' | 'bottomStart' | 'bottomEnd' | 'center';
    closable?: boolean;
    duration?: number;
    autoClose?: boolean;
    autoCloseDuration?: number;
    isOpen: boolean;
    onClose?: () => void;
}