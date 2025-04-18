import React from "react";

export interface SidebarProps extends Omit<React.ComponentProps<'aside'>, 'onChange'>{
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    children?: React.ReactNode;
}

export interface SidebarMenuProps extends React.ComponentProps<'ul'>{
    className?: string;
    toggleable?: boolean;
    items?: {
        id?: string;
        title: string;
        toggleable?: boolean;
        link?: string;
        icon?: React.ReactNode;
        className?: string;
        submenu?: {
            id?: string;
            title: string;
            link?: string;
            className?: string;
        }[];
    }[];
}

export interface SidebarMenuItemProps extends React.ComponentProps<'li'>{
    toggleable?: boolean;
}

export interface SidebarMenuButtonProps extends React.ComponentProps<'button'>{
    isSubMenuOpen?: boolean;
    link?: string;
}

export interface SidebarSubMenuProps extends React.ComponentProps<'ul'>{
    isSubMenuOpen?: boolean;
}

export interface SidebarSubMenuItemProps extends React.ComponentProps<"button"> {
    link?: string;
}
