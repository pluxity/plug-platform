import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import React from "react";

export interface DropdownMenuProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Root> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  defaultOpen?: boolean
  modal?: boolean
}

export interface DropdownMenuTriggerProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Trigger> {
  asChild?: boolean
  children?: React.ReactNode
}

export interface DropdownMenuContentProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Content> {
  className?: string
  sideOffset?: number
  children?: React.ReactNode
}

export interface DropdownMenuGroupProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Group> {
  children?: React.ReactNode
}

export interface DropdownMenuItemProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Item> {
  className?: string
  inset?: boolean
  variant?: "default" | "destructive"
  children?: React.ReactNode
}

export interface DropdownMenuCheckboxItemProps extends React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  children?: React.ReactNode
  className?: string
}

export interface DropdownMenuRadioGroupProps extends React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup> {
  value?: string
  onValueChange?: (value: string) => void
  children?: React.ReactNode
}

export interface DropdownMenuRadioItemProps extends React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem> {
  value: string
  children?: React.ReactNode
  className?: string
}

export interface DropdownMenuLabelProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean
  children?: React.ReactNode
  className?: string
}

export interface DropdownMenuSeparatorProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Separator> {
  className?: string
}

export interface DropdownMenuShortcutProps extends React.ComponentProps<"span"> {
  children?: React.ReactNode
  className?: string
}

export interface DropdownMenuSubProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Sub> {
    children?: React.ReactNode;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?(open: boolean): void;
}

export interface DropdownMenuSubTriggerProps extends React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> {
  inset?: boolean
  children?: React.ReactNode
  className?: string
}

export interface DropdownMenuSubContentProps extends React.ComponentProps<typeof DropdownMenuPrimitive.SubContent> {
  children?: React.ReactNode
  className?: string
}
