import * as SelectPrimitive from "@radix-ui/react-select";

export interface SelectProps extends React.ComponentProps<typeof SelectPrimitive.Root> {
    children?: React.ReactNode;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    disabled?: boolean;
    required?: boolean;
    name?: string;
}

export interface SelectGroupProps extends React.ComponentProps<typeof SelectPrimitive.Group> {
    children?: React.ReactNode;
}

export interface SelectValueProps extends React.ComponentProps<typeof SelectPrimitive.Value> {
    children?: React.ReactNode;
    placeholder?: string;
}

export interface SelectTriggerProps extends React.ComponentProps<typeof SelectPrimitive.Trigger> {
    children?: React.ReactNode;
    className?: string;
    size?: "sm" | "default";
}

export interface SelectContentProps extends React.ComponentProps<typeof SelectPrimitive.Content> {
    children?: React.ReactNode;
    className?: string;
    position?: "item-aligned" | "popper";
}

export interface SelectLabelProps extends React.ComponentProps<typeof SelectPrimitive.Label> {
    children?: React.ReactNode;
    className?: string;
}

export interface SelectItemProps extends React.ComponentProps<typeof SelectPrimitive.Item> {
    children?: React.ReactNode;
    className?: string;
    value: string;
}

export interface SelectSeparatorProps extends React.ComponentProps<typeof SelectPrimitive.Separator> {
    className?: string;
}

export interface SelectScrollUpButtonProps extends React.ComponentProps<typeof SelectPrimitive.ScrollUpButton> {
    className?: string;
}

export interface SelectScrollDownButtonProps extends React.ComponentProps<typeof SelectPrimitive.ScrollDownButton> {
    className?: string;
}
