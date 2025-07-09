import * as NavigationMenuPrimitive from "@radix-ui/react-navigation-menu";

export interface NavigationMenuProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Root> {
    children?: React.ReactNode;
    viewport?: boolean;
    className?: string;
}

export interface NavigationMenuListProps extends React.ComponentProps<typeof NavigationMenuPrimitive.List> {
    children?: React.ReactNode;
    className?: string;
}

export interface NavigationMenuItemProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Item> {
    children?: React.ReactNode;
    className?: string;
}

export interface NavigationMenuTriggerProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Trigger> {
    children?: React.ReactNode;
    className?: string;
}

export interface NavigationMenuContentProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Content> {
    children?: React.ReactNode;
    className?: string;
}

export interface NavigationMenuLinkProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Link> {
    children?: React.ReactNode;
    className?: string;
    href?: string;
    active?: boolean;
}

export interface NavigationMenuIndicatorProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Indicator> {
    className?: string;
}

export interface NavigationMenuViewportProps extends React.ComponentProps<typeof NavigationMenuPrimitive.Viewport> {
    className?: string;
}
