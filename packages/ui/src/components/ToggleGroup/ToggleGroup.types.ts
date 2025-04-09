import { Size } from '../types';

export interface ToggleGroupProps extends Omit<React.ComponentProps<'div'>, 'onChange'>{
    size?: Size;
    type?: 'single' | 'multiple';
}

export interface ToggleGroupItemProps extends Omit<React.ComponentProps<'button'>, 'onChange'>{
    size?: Size;
}