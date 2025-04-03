import type { DialogProps } from '../Dialog/Dialog.types';

export interface AlertProps extends DialogProps {
    variant?: 'default' | 'success' | 'error' | 'notice' | 'info';
    className?: string;
}