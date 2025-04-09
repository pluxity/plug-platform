import type { Color, Size } from '../types';

type RadioColor = Exclude<Color, 'destructive'>;

export interface RadioGroupProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    defaultValue?: string;
    color?: RadioColor;
    size?: Size;
    disabled?: boolean;
    name: string;
}

export interface RadioGroupItemProps extends Omit<React.ComponentProps<'label'>, 'ref'> {
    value: string;
    label?: React.ReactNode;
    disabled?: boolean;
    ref?: React.Ref<HTMLInputElement>;
}