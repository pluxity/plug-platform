import type { Color, Size } from '../types';

type CheckboxColor = Exclude<Color, 'destructive'>;
type CheckboxType = "rectangle" | "circle";

export interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'size' | 'type' | 'onChange'> {
    color?: CheckboxColor;
    size?: Size;
    type?: CheckboxType;
    label?: string;
    indeterminate?: boolean;
    inputClassName?: string;
    onChange?: (checked: boolean) => void;
}