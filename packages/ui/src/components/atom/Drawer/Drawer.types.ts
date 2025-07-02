import { Drawer as DrawerPrimitive } from "vaul";

export type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root> & {
    direction?: "top" | "right" | "bottom" | "left";
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
    defaultOpen?: boolean;
    onClose?: () => void;
    children?: React.ReactNode;
}

export interface DrawerTriggerProps extends React.ComponentProps<typeof DrawerPrimitive.Trigger> {
    children?: React.ReactNode;
}

export interface DrawerOverlayProps extends React.ComponentProps<typeof DrawerPrimitive.Overlay> {
    className?: string;
}

export interface DrawerContentProps extends React.ComponentProps<typeof DrawerPrimitive.Content> {
    className?: string;
    children?: React.ReactNode;
}

export interface DrawerHeaderProps extends React.ComponentProps<"div"> {
    children?: React.ReactNode;
    className?: string;
}

export interface DrawerFooterProps extends React.ComponentProps<"div"> {
    children?: React.ReactNode;
    className?: string;
}

export interface DrawerTitleProps extends React.ComponentProps<typeof DrawerPrimitive.Title> {
    children?: React.ReactNode;
    className?: string;
}

export interface DrawerDescriptionProps extends React.ComponentProps<typeof DrawerPrimitive.Description> {
    children?: React.ReactNode;
    className?: string;
}


