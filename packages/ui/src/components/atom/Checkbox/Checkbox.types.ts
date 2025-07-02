import * as CheckboxPrimitive from "@radix-ui/react-checkbox";

export interface CheckboxProps extends React.ComponentProps<typeof CheckboxPrimitive.Root> {
    className?: string;
    variant?: 'square' | 'round';
    checked?: boolean;
    disabled?: boolean;
    id?: string;
}