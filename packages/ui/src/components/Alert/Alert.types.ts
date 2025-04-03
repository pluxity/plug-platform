export interface AlertProps extends React.ComponentProps<'div'>{
    variant?: 'default' | 'success' | 'error' | 'notice' | 'info';
    closable?: boolean;
    onClose?: () => void;
}