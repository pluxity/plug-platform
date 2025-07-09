import * as MenubarPrimitive from "@radix-ui/react-menubar"

export interface MenubarProps extends React.ComponentProps<typeof MenubarPrimitive.Root> {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
    loop?: boolean;
    dir?: "ltr" | "rtl";
}

export interface MenubarMenuProps extends React.ComponentProps<typeof MenubarPrimitive.Menu> {
    children?: React.ReactNode;
    className?: string;
}       

export interface MenubarGroupProps extends React.ComponentProps<typeof MenubarPrimitive.Group> {
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarRadioGroupProps extends React.ComponentProps<typeof MenubarPrimitive.RadioGroup> {
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarTriggerProps extends React.ComponentProps<typeof MenubarPrimitive.Trigger> {
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarContentrops extends React.ComponentProps<typeof MenubarPrimitive.Content> {
    align?: "start" | "center" | "end";
    alignOffset?: number;
    sideOffset?: number;
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarItemProps extends React.ComponentProps<typeof MenubarPrimitive.Item> {
    inset?: boolean;
    variant?: "default" | "destructive";
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarCheckboxItemProps extends React.ComponentProps<typeof MenubarPrimitive.CheckboxItem> {
    children?: React.ReactNode;
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    className?: string;
}

export interface MenubarRadioItemProps extends React.ComponentProps<typeof MenubarPrimitive.RadioItem> {
    children?: React.ReactNode;
    value: string;
    className?: string;
}

export interface MenubarLabelProps extends React.ComponentProps<typeof MenubarPrimitive.Label> {
    inset?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarSeparatorProps extends React.ComponentProps<typeof MenubarPrimitive.Separator> {
    className?: string;
}

export interface MenubarShortcutProps extends React.ComponentProps<"span"> {
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarSubProps extends React.ComponentProps<typeof MenubarPrimitive.Sub> {
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarSubTriggerProps extends React.ComponentProps<typeof MenubarPrimitive.SubTrigger> {
    inset?: boolean;
    children?: React.ReactNode;
    className?: string;
}

export interface MenubarSubContentProps extends React.ComponentProps<typeof MenubarPrimitive.SubContent> {
    children?: React.ReactNode;
    className?: string;
}

