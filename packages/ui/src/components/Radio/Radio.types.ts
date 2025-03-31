import type { Color, Size } from '../types';

type RadioColor = Exclude<Color, 'destructive'>;

export interface RadioGroupProps extends Omit<React.ComponentProps<'div'>, 'onChange'> {
    defaultValue?: string;
    variant?: RadioColor;
    size?: Size;
    name: string;
    onChange: (value: string) => void;
    children: React.ReactNode;
}

export interface RadioItemProps extends Omit<React.ComponentProps<'label'>, 'ref'> {
    value: string;
    label?: React.ReactNode;
    disabled?: boolean;
    ref?: React.Ref<HTMLInputElement>;
}