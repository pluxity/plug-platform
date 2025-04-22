import type { Placement } from '../types';

type SheetPlacement = Exclude<Placement, 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'> | 'left' | 'right';

export interface SheetPortalProps {
    children: React.ReactNode;
}

export interface SheetProps extends React.ComponentProps<"div"> {
    isOpen: boolean;
    closeOnOverlayClick?: boolean; 
    closable?: boolean;
    overlay?: boolean;
    onClose?: () => void;
    position?: SheetPlacement;
    children: React.ReactNode;
}

export interface SheetHeaderProps extends React.ComponentProps<"div"> {}

export interface SheetContentProps extends React.ComponentProps<"div"> {}

export interface SheetFooterProps extends React.ComponentProps<"div"> {}