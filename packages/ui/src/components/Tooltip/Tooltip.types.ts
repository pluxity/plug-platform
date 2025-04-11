import type { Placement } from '../types';

type TooltipPlacement = Exclude<Placement, 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'center'> | 'left' | 'right';
type TooltipTrigger = 'hover' | 'focus' | 'touch';

export interface TooltipProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    isActive?: boolean;
    children: React.ReactNode;
    trigger?: TooltipTrigger;
    position?: TooltipPlacement;
}