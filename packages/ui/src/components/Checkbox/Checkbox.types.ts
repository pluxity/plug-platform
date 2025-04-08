import type { Color, Size } from '../types';

type CheckboxColor = Exclude<Color, 'destructive'>;

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'size' | 'type' | 'onChange'> {
    color?: CheckboxColor;
    size?: Size;
    type?: "rectangle" | "circle";
    label?: string;
    indeterminate?: boolean;
    inputClassName?: string;
    onChange?: (checked: boolean) => void;
}