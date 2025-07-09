import { Command as CommandPrimitive } from "cmdk";
import { Dialog } from "../Dialog/Dialog";

export interface CommandProps extends React.ComponentProps<typeof CommandPrimitive> {
    value?: string;
    onValueChange?: (value: string) => void;
    defaultValue?: string;
    label?: string;
    asChild?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export interface CommandDialogProps extends React.ComponentProps<typeof Dialog> {
    title?: string;
    description?: string;
    className?: string;
    showCloseButton?: boolean;
    children?: React.ReactNode;
}

export interface CommandInputProps extends React.ComponentProps<typeof CommandPrimitive.Input> {
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface CommandListProps extends React.ComponentProps<typeof CommandPrimitive.List> {
    label?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface CommandEmptyProps extends React.ComponentProps<typeof CommandPrimitive.Empty> {
    className?: string;
    children?: React.ReactNode;
}

export interface CommandGroupProps extends React.ComponentProps<typeof CommandPrimitive.Group> {
    value?: string;
    heading?: string;
    className?: string;
    children?: React.ReactNode;
}

export interface CommandSeparatorProps extends React.ComponentProps<typeof CommandPrimitive.Separator> {
    alwaysRender?: boolean;
    className?: string;
    children?: React.ReactNode;
}

export interface CommandItemProps extends React.ComponentProps<typeof CommandPrimitive.Item> {
    value?: string;
    onSelect?: (value: string) => void;
    disabled?: boolean;
    keywords?: string[];
    className?: string;
    children?: React.ReactNode;
}

export interface CommandShortcutProps extends React.ComponentProps<"span"> {
    className?: string;
    children?: React.ReactNode;
}



