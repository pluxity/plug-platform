import type { Color, Size } from '../types';

type CheckboxColor = Exclude<Color, 'destructive'>;

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'size' | 'type'> {
    color?: CheckboxColor;
    size?: Size;
    type?: "rectangle" | "circle";
    label?: string;
}