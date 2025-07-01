import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export interface CheckboxProps extends CheckboxPrimitive.CheckboxProps {
    className?: string;
    variant?: 'square' | 'round';
    checked?: boolean;
    disabled?: boolean;
    id?: string;
}