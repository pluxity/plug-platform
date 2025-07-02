import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";

export interface AlertDialogProps extends React.ComponentProps<typeof AlertDialogPrimitive.Root> {
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    modal?: boolean;
    children?: React.ReactNode;
}

export interface AlertDialogTriggerProps extends React.ComponentProps<typeof AlertDialogPrimitive.Trigger> {
    asChild?: boolean;
    children?: React.ReactNode;
}

export interface AlertDialogPortalProps extends React.ComponentProps<typeof AlertDialogPrimitive.Portal> {
    children?: React.ReactNode;
}

export interface AlertDialogOverlayProps extends React.ComponentProps<typeof AlertDialogPrimitive.Overlay> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogContentProps extends React.ComponentProps<typeof AlertDialogPrimitive.Content> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogHeaderProps extends React.ComponentProps<"div"> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogFooterProps extends React.ComponentProps<"div"> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogTitleProps extends React.ComponentProps<typeof AlertDialogPrimitive.Title> {
    className?: string;
    children?: React.ReactNode;
}

export interface AlertDialogDescriptionProps extends React.ComponentProps<typeof AlertDialogPrimitive.Description> {
    className?: string;
    children?: React.ReactNode;
}   

export interface AlertDialogActionProps extends React.ComponentProps<typeof AlertDialogPrimitive.Action> {
    className?: string;
    children?: React.ReactNode;
}           

export interface AlertDialogCancelProps extends React.ComponentProps<typeof AlertDialogPrimitive.Cancel> {
    className?: string;
    children?: React.ReactNode;
}




