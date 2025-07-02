import * as ContextMenuPrimitive from "@radix-ui/react-context-menu";

export interface ContextMenuProps extends React.ComponentProps<typeof ContextMenuPrimitive.Root> {
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuTriggerProps extends React.ComponentProps<typeof ContextMenuPrimitive.Trigger> {
    disabled?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuGroupProps extends React.ComponentProps<typeof ContextMenuPrimitive.Group> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuPortalProps extends React.ComponentProps<typeof ContextMenuPrimitive.Portal> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuSubProps extends React.ComponentProps<typeof ContextMenuPrimitive.Sub> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuRadioGroupProps extends React.ComponentProps<typeof ContextMenuPrimitive.RadioGroup> {
    value?: string;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuSubTriggerProps extends React.ComponentProps<typeof ContextMenuPrimitive.SubTrigger> {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    inset?: boolean;
    className?: string;
}

export interface ContextMenuSubContentProps extends React.ComponentProps<typeof ContextMenuPrimitive.SubContent> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuContentProps extends React.ComponentProps<typeof ContextMenuPrimitive.Content> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuItemProps extends React.ComponentProps<typeof ContextMenuPrimitive.Item> {
    children?: React.ReactNode;
    inset?: boolean;
    variant?: "default" | "destructive";
    className?: string;
}

export interface ContextMenuCheckboxItemProps extends React.ComponentProps<typeof ContextMenuPrimitive.CheckboxItem> {
    checked?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuRadioItemProps extends React.ComponentProps<typeof ContextMenuPrimitive.RadioItem> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuLabelProps extends React.ComponentProps<typeof ContextMenuPrimitive.Label> {
    children?: React.ReactNode;
    inset?: boolean;
    className?: string;
}

export interface ContextMenuSeparatorProps extends React.ComponentProps<typeof ContextMenuPrimitive.Separator> {
    children?: React.ReactNode;
    className?: string;
}

export interface ContextMenuShortcutProps extends React.ComponentProps<"span"> {
    children?: React.ReactNode;
    className?: string;
}








