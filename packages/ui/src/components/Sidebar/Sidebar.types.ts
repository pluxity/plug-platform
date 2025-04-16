import React from "react";

export interface SidebarProps extends Omit<React.ComponentProps<'aside'>, 'onChange'>{
    isOpen?: boolean;
    onChange?: (isOpen: boolean) => void;
    children?: React.ReactNode;
}

export interface SidebarMenuButtonProps extends React.ComponentProps<'button'>{
    isSubMenuOpen?: boolean;
}

export interface SidebarSubMenuProps extends React.ComponentProps<'ul'>{
    isSubMenuOpen?: boolean;
}
