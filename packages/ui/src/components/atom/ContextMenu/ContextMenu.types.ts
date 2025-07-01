import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export interface ContextMenuProps extends ContextMenuPrimitive.ContextMenuProps {
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuTriggerProps extends ContextMenuPrimitive.ContextMenuTriggerProps {
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuGroupProps extends ContextMenuPrimitive.ContextMenuGroupProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuPortalProps extends ContextMenuPrimitive.ContextMenuPortalProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuSubProps extends ContextMenuPrimitive.ContextMenuSubProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuRadioGroupProps extends ContextMenuPrimitive.ContextMenuRadioGroupProps {
    value?: string;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuSubTriggerProps extends ContextMenuPrimitive.ContextMenuSubTriggerProps {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    inset?: boolean;
    className?: string;
}

export interface ContextMenuSubContentProps extends ContextMenuPrimitive.ContextMenuSubContentProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuContentProps extends ContextMenuPrimitive.ContextMenuContentProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuItemProps extends ContextMenuPrimitive.ContextMenuItemProps {
    children?: React.ReactNode;
    inset?: boolean;
    variant?: "default" | "destructive";
    className?: string;
}

export interface ContextMenuCheckboxItemProps extends ContextMenuPrimitive.ContextMenuCheckboxItemProps {
    checked?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuRadioItemProps extends ContextMenuPrimitive.ContextMenuRadioItemProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuLabelProps extends ContextMenuPrimitive.ContextMenuLabelProps {
    children?: React.ReactNode;
    inset?: boolean;
    className?: string;
}

export interface ContextMenuSeparatorProps extends ContextMenuPrimitive.ContextMenuSeparatorProps {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuShortcutProps extends React.ComponentProps<"span"> {
    children?: React.ReactNode;
    className?: string;
}








